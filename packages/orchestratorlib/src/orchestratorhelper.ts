/* eslint-disable no-await-in-loop */
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import {LabelType} from './labeltype';
import {Label} from './label';
import {Span} from './span';
import {ScoreEntity} from './scoreentity';
import {ScoreIntent} from './scoreintent';
import {Utility} from './utility';
import {PrebuiltToRecognizerMap} from './resources/recognizer-map';

const ReadText: any = require('read-text-file');
const LuisBuilder: any = require('@microsoft/bf-lu').V2.LuisBuilder;
const QnaMakerBuilder: any = require('@microsoft/bf-lu').V2.QnAMakerBuilder;
const processedFiles: string[] = [];

export class OrchestratorHelper {
  public static SnapshotFileName: string = 'orchestrator.blu';

  public static exists(path: string): boolean {
    return fs.existsSync(path);
  }

  public static isDirectory(path: string): boolean {
    try {
      const stats: fs.Stats = fs.statSync(path);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  public static readBluSnapshotFile(filePath: string): string {
    return Utility.processUnknownLabelsInBluFileContent(ReadText.readSync(filePath));
  }

  public static readFile(filePath: string): string {
    return ReadText.readSync(filePath);
  }

  public static writeToFile(filePath: string, content: string, options: any = {encoding: 'utf8', flag: 'w'}): string {
    fs.writeFileSync(filePath, content, options);
    Utility.writeToConsole(`Successfully wrote to file ${filePath}`);
    return filePath;
  }

  public static deleteFile(filePath: string)  {
    fs.unlinkSync(filePath);
  }

  public static createDteContent(utteranceLabelsMap: Map<string, Set<string>>) {
    const labelUtteranceMap: Map<string, string> = new Map<string, string>();
    // eslint-disable-next-line guard-for-in
    for (const utterance of utteranceLabelsMap.keys()) {
      const labels: Set<string> = utteranceLabelsMap.get(utterance) as Set<string>;
      labels.forEach((label: string) => {
        if (label in labelUtteranceMap) {
          labelUtteranceMap.set(label, labelUtteranceMap.get(label) + '|' + utterance);
        } else {
          labelUtteranceMap.set(label, utterance);
        }
      });
    }
    let key: number = 0;
    let tsvContent: string = '';
    // eslint-disable-next-line guard-for-in
    for (const label in labelUtteranceMap) {
      const utterances: string = labelUtteranceMap.get(label) as string;
      const line: string = key + '\t' + label + '\t' + utterances + '\n';
      tsvContent += line;
      key += 1;
    }

    return tsvContent;
  }

  public static async getTsvContent(
    inputPathConfiguration: string,
    hierarchical: boolean = false,
    outputDteFormat: boolean = false)  {
    const utteranceLabelsMap: Map<string, Set<string>> = (await OrchestratorHelper.getUtteranceLabelsMap(inputPathConfiguration, hierarchical)).utteranceLabelsMap;
    let tsvContent: string = '';

    if (outputDteFormat) {
      tsvContent = OrchestratorHelper.createDteContent(utteranceLabelsMap);
    } else {
      // eslint-disable-next-line guard-for-in
      for (const utterance of utteranceLabelsMap.keys()) {
        const labels: Set<string> = utteranceLabelsMap.get(utterance) as Set<string>;
        const line: string = [...labels].join() + '\t' + utterance + '\n';
        tsvContent += line;
      }
    }

    return tsvContent;
  }

  public static getSnapshotFromFile(file: string) {
    return new TextEncoder().encode(OrchestratorHelper.readBluSnapshotFile(file));
  }

  public static async getUtteranceLabelsMap(
    filePathConfiguration: string,
    hierarchical: boolean = false): Promise<{
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': Map<string, Label[]>;
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; }> {
    const utteranceLabelsMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    const utteranceEntityLabelsMap: Map<string, Label[]> = new Map<string, Label[]>();
    const utteranceEntityLabelDuplicateMap: Map<string, Label[]> = new Map<string, Label[]>();
    const filePaths: string[] = filePathConfiguration.split(',');
    for (const filePathEntry of filePaths) {
      if (OrchestratorHelper.isDirectory(filePathEntry)) {
        await OrchestratorHelper.iterateInputFolder(
          filePathEntry,
          utteranceLabelsMap,
          utteranceLabelDuplicateMap,
          utteranceEntityLabelsMap,
          utteranceEntityLabelDuplicateMap,
          hierarchical);
      } else {
        await OrchestratorHelper.processFile(
          filePathEntry,
          path.basename(filePathEntry),
          utteranceLabelsMap,
          utteranceLabelDuplicateMap,
          utteranceEntityLabelsMap,
          utteranceEntityLabelDuplicateMap,
          hierarchical);
      }
    }
    Utility.processUnknownLabelsInUtteranceLabelsMap({utteranceLabelsMap, utteranceLabelDuplicateMap});
    return {utteranceLabelsMap, utteranceLabelDuplicateMap, utteranceEntityLabelsMap, utteranceEntityLabelDuplicateMap};
  }

  /*
  If --in is a file
      - If --out is a folder, write to outFolder\inFileName.blu
      - If --out is a file, write to outFile
      - else, write to cwd()\orchestrator.blu
  Else
      - If --out is a folder, write to outFolder\orchestrator.blu
      - If --out is a file, write to outFile
      - else, write to cwd()\orchestrator.blu
  */
  public static getOutputPath(out: string, input: string): string {
    let retValue: string = out;
    if (OrchestratorHelper.isDirectory(out)) {
      if (OrchestratorHelper.isDirectory(input)) {
        retValue = path.join(out, OrchestratorHelper.SnapshotFileName);
      } else {
        const srcBaseFileName: string = path.basename(input);
        const dstBaseFileName: string = srcBaseFileName.substring(0, srcBaseFileName.lastIndexOf('.'));
        retValue = path.join(out, `${dstBaseFileName}.blu`);
      }
    }
    return retValue;
  }

  public static getDialogFilesContent(isDialog: boolean, baseName: string, recognizers: any = []) {
    if (!isDialog) return undefined;
    const recoContent: {
      '$kind': string;
      'modelPath': string;
      'snapshotPath': string;
      'entityRecognizers': any;
    } = {
      $kind: 'Microsoft.OrchestratorRecognizer',
      modelPath: '=settings.orchestrator.modelPath',
      snapshotPath: `=settings.orchestrator.snapshots.${baseName}`,
      entityRecognizers: recognizers,
    };

    const multiRecoContent: any = {
      $kind: 'Microsoft.MultiLanguageRecognizer',
      recognizers: {
        'en-us': `${baseName}.en-us.lu`,
        '': `${baseName}.en-us.lu`,
      },
    };

    return {orchestratorRecognizer: recoContent, multiLanguageRecognizer: multiRecoContent};
  }

  public static async getEntitiesInLu(luObject: any): Promise<any> {
    const luisObject: any = await LuisBuilder.fromLUAsync([luObject], OrchestratorHelper.findLuFiles);
    return this.transformEntities(luisObject);
  }

  public static transformEntities(luisObject: any): string[] {
    if (luisObject.prebuiltEntities === undefined || !Array.isArray(luisObject.prebuiltEntities) || luisObject.prebuiltEntities.length === 0) return [];
    const entitiesList: any = [];
    (luisObject.prebuiltEntities || []).forEach((item: any) => {
      const mapValue: any = PrebuiltToRecognizerMap[item.name.toLowerCase().trim()];
      if (mapValue !== undefined && mapValue !== '') {
        entitiesList.push({
          $kind: mapValue,
        });
      } else {
        process.stdout.write(`\n[WARN:] No entity recognizer available for Prebuilt entity '${item.name}'\n`);
      }
    });
    return entitiesList;
  }

  // eslint-disable-next-line max-params
  static async processFile(
    filePath: string,
    fileName: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>,
    hierarchical: boolean): Promise<void> {
    const ext: string = path.extname(filePath);
    const hierarchicalLabel: string = OrchestratorHelper.getLabelFromFileName(fileName, ext, hierarchical);
    if (ext === '.lu') {
      Utility.writeToConsole(`Processing ${filePath}...`);
      await OrchestratorHelper.parseLuFile(
        filePath,
        hierarchicalLabel,
        utteranceLabelsMap,
        utteranceLabelDuplicateMap,
        utteranceEntityLabelsMap,
        utteranceEntityLabelDuplicateMap);
    } else if (ext === '.qna') {
      Utility.writeToConsole(`Processing ${filePath}...`);
      await OrchestratorHelper.parseQnaFile(
        filePath,
        hierarchicalLabel,
        utteranceLabelsMap,
        utteranceLabelDuplicateMap);
    } else if (ext === '.json') {
      Utility.writeToConsole(`Processing ${filePath}...\n`);
      if (OrchestratorHelper.getLuisIntentsEnitiesUtterances(
        fs.readJsonSync(filePath),
        OrchestratorHelper.getLabelFromFileName(fileName, ext, hierarchical),
        utteranceLabelsMap,
        utteranceLabelDuplicateMap,
        utteranceEntityLabelsMap,
        utteranceEntityLabelDuplicateMap)) {
        return;
      }
      OrchestratorHelper.getJsonIntentsEntitiesUtterances(
        fs.readJsonSync(filePath),
        OrchestratorHelper.getLabelFromFileName(fileName, ext, hierarchical),
        utteranceLabelsMap,
        utteranceLabelDuplicateMap,
        utteranceEntityLabelsMap,
        utteranceEntityLabelDuplicateMap);
    } else if (ext === '.tsv' || ext === '.txt') {
      Utility.writeToConsole(`Processing ${filePath}...\n`);
      OrchestratorHelper.parseTsvFile(
        filePath,
        OrchestratorHelper.getLabelFromFileName(fileName, ext, hierarchical),
        utteranceLabelsMap,
        utteranceLabelDuplicateMap);
    } else if (ext === '.blu') {
      Utility.writeToConsole(`Processing ${filePath}...\n`);
      OrchestratorHelper.parseBluFile(
        filePath,
        utteranceLabelsMap,
        utteranceLabelDuplicateMap);
    } else {
      throw new Error(`${filePath} has invalid extension - lu, qna, json and tsv files are supported.`);
    }
  }

  static parseBluFile(
    bluFile: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>) {
    const lines: string[] = OrchestratorHelper.readFile(bluFile).split('\n');
    if (lines.length === 0 || lines.length === 1) {
      return;
    }
    lines.shift();
    OrchestratorHelper.tryParseLabelUtteranceTsv(lines, utteranceLabelsMap, utteranceLabelDuplicateMap, true);
  }

  // eslint-disable-next-line max-params
  static async parseLuFile(
    luFile: string,
    hierarchicalLabel: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>) {

    OrchestratorHelper.parseLuContent(
      luFile,
      OrchestratorHelper.readFile(luFile),
      hierarchicalLabel,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
  }

  // eslint-disable-next-line max-params
  static async parseLuContent(
    luFile: string,
    luContent: string,
    hierarchicalLabel: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>) {
    const luObject: any = {
      content: luContent,
      id: luFile,
    };
    const luisObject: any = await LuisBuilder.fromLUAsync([luObject], OrchestratorHelper.findLuFiles);
    OrchestratorHelper.getLuisIntentsEnitiesUtterances(
      luisObject,
      hierarchicalLabel,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
  }

  static parseTsvFile(
    tsvFile: string,
    hierarchicalLabel: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>) {
    Utility.debuggingLog(`OrchestratorHelper.parseTsvFile(), ready to read from '${tsvFile}'`);
    const lines: string[] = OrchestratorHelper.readFile(tsvFile).split('\n');
    Utility.debuggingLog(`OrchestratorHelper.parseTsvFile(), lines=${lines.length}`);
    if (lines.length === 0) {
      return;
    }
    if (!OrchestratorHelper.tryParseQnATsvFile(lines, hierarchicalLabel, utteranceLabelsMap, utteranceLabelDuplicateMap)) {
      OrchestratorHelper.tryParseLabelUtteranceTsv(lines, utteranceLabelsMap, utteranceLabelDuplicateMap);
    }
  }

  static tryParseLabelUtteranceTsv(
    lines: string[],
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    bluFormat: boolean = false): boolean {
    if (!bluFormat && OrchestratorHelper.hasLabelUtteranceHeader(lines[0])) {
      lines.shift();
    }
    Utility.debuggingLog(`processing #lines=${lines.length}`);
    let numberLinesProcessed: number  = 0;
    let numberLinesIgnored: number = 0;
    lines.forEach((line: string, lineIndex: number) => {
      if ((lineIndex % Utility.NumberOfInstancesPerProgressDisplayBatch) === 0) {
        // eslint-disable-next-line no-console
        Utility.debuggingLog(`processed lineIndex=${lineIndex}`);
      }
      // ---- NOTE-FOR-TESTING ---- if (lineIndex >= 8630000) {
      // ---- NOTE-FOR-TESTING ----   // eslint-disable-next-line no-console
      // ---- NOTE-FOR-TESTING ----   Utility.debuggingLog(`processed lineIndex=${lineIndex}, line='${line}'`);
      // ---- NOTE-FOR-TESTING ---- }
      const lineTrimmed: string = line.trim();
      if (lineTrimmed.length <= 0) {
        Utility.debuggingLog(`WARNING processing lineIndex=${lineIndex}, line='${line}', lineTrimmed.length <= 0`);
        numberLinesIgnored++;
        if ((numberLinesIgnored % Utility.NumberOfInstancesPerProgressDisplayBatch) === 0) {
          // eslint-disable-next-line no-console
          Utility.debuggingLog(`processed numberLinesIgnored=${numberLinesIgnored}`);
        }
        return;
      }
      try {
        const items: string[] = lineTrimmed.split('\t');
        if (items && (items.length >= 2)) {
          let labels: string = items[0] ? items[0] : '';
          const utteranceIdx: number = (items.length === 3 && !bluFormat) ? 2 : 1;
          let utterance: string = items[utteranceIdx] ? items[utteranceIdx] : '';
          labels = labels.trim();
          utterance = utterance.trim();
          // ---- NOTE-FOR-TESTING ---- if (utterance === 'constructor') {
          // ---- NOTE-FOR-TESTING ----   Utility.debuggingLog(`WARNING processing, utterance === 'constructor', lineIndex=${lineIndex}, line='${line}'`);
          // ---- NOTE-FOR-TESTING ----   numberLinesIgnored++;
          // ---- NOTE-FOR-TESTING ----   if ((numberLinesIgnored % Utility.NumberOfInstancesPerProgressDisplayBatch) === 0) {
          // ---- NOTE-FOR-TESTING ----     // eslint-disable-next-line no-console
          // ---- NOTE-FOR-TESTING ----     Utility.debuggingLog(`processed numberLinesIgnored=${numberLinesIgnored}`);
          // ---- NOTE-FOR-TESTING ----   }
          // ---- NOTE-FOR-TESTING ----   return;
          // ---- NOTE-FOR-TESTING ---- }
          const labelArray: string[] = labels.split(',');
          for (const label of labelArray) {
            if (label) {
              const labelTrimmed: string = label.trim();
              OrchestratorHelper.addNewLabelUtterance(
                utterance,
                labelTrimmed,
                '',
                utteranceLabelsMap,
                utteranceLabelDuplicateMap
              );
            }
          }
          numberLinesProcessed++;
          if ((numberLinesProcessed % Utility.NumberOfInstancesPerProgressDisplayBatch) === 0) {
            // eslint-disable-next-line no-console
            Utility.debuggingLog(`processed numberLinesProcessed=${numberLinesProcessed}`);
          }
        } else {
          Utility.debuggingLog(`WARNING processing, items.length < 2, lineIndex=${lineIndex}, line='${line}'`);
          numberLinesIgnored++;
          if ((numberLinesIgnored % Utility.NumberOfInstancesPerProgressDisplayBatch) === 0) {
            // eslint-disable-next-line no-console
            Utility.debuggingLog(`processed numberLinesIgnored=${numberLinesIgnored}`);
          }
        }
      } catch (error) {
        Utility.debuggingLog(`WARNING processing lineIndex=${lineIndex}, line='${line}', error=${error}`);
        numberLinesIgnored++;
        if ((numberLinesIgnored % Utility.NumberOfInstancesPerProgressDisplayBatch) === 0) {
          // eslint-disable-next-line no-console
          Utility.debuggingLog(`processed numberLinesIgnored=${numberLinesIgnored}`);
        }
        throw error;
      }
    });
    Utility.debuggingLog(`processed #lines=${lines.length}`);
    Utility.debuggingLog(`processed numberLinesProcessed=${numberLinesProcessed}`);
    Utility.debuggingLog(`processed numberLinesIgnored=${numberLinesIgnored}`);
    Utility.debuggingLog(`processed utteranceLabelsMap.size=${utteranceLabelsMap.size}`);
    Utility.debuggingLog(`processed utteranceLabelDuplicateMap.size=${utteranceLabelDuplicateMap.size}`);
    return true;
  }

  static tryParseQnATsvFile(
    lines: string[],
    label: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>): boolean {
    if (!OrchestratorHelper.isQnATsvHeader(lines[0])) {
      return false;
    }
    lines.shift();
    lines.forEach((line: string) => {
      const items: string[] = line.split('\t');
      if (items.length < 2) {
        return;
      }
      OrchestratorHelper.addNewLabelUtterance(
        items[0].trim(),
        label,
        '',
        utteranceLabelsMap,
        utteranceLabelDuplicateMap
      );
    });

    return true;
  }

  static isQnATsvHeader(header: string): boolean {
    return header.indexOf('Question') >= 0 && header.indexOf('Answer') > 0;
  }

  static hasLabelUtteranceHeader(header: string): boolean {
    return header.indexOf('Label') >= 0 &&
      (header.indexOf('Text') > 0 || header.indexOf('Utterance') > 0);
  }

  static async parseQnaFile(
    qnaFile: string,
    label: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>) {
    const fileContents: string = OrchestratorHelper.readFile(qnaFile);
    const lines: string[] = fileContents.split('\n');
    if (lines.length === 0) {
      return;
    }

    const newlines: string[] = [];
    lines.forEach((line: string) => {
      if (line.indexOf('> !# @qna.pair.source =') < 0) {
        newlines.push(line);
      }
    });

    // Utility.debuggingLog('OrchestratorHelper.parseQnaFile() ready to call QnaMakerBuilder.fromContent()');
    const qnaNormalized: string = Utility.cleanStringOnTabs(newlines.join('\n')); // ---- NOTE ---- QnaMakerBuilder does not like TAB
    const qnaObject: any = await QnaMakerBuilder.fromContent(qnaNormalized);
    if (qnaObject) {
      OrchestratorHelper.getQnaQuestionsAsUtterances(qnaObject, label, utteranceLabelsMap, utteranceLabelDuplicateMap);
    } else {
      throw new Error(`Failed parsing qna file ${qnaFile}`);
    }
  }

  // eslint-disable-next-line max-params
  static async iterateInputFolder(
    folderPath: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>,
    hierarchical: boolean): Promise<void> {
    const supportedFileFormats: string[] = ['.lu', '.json', '.qna', '.tsv', '.txt'];
    const items: string[] = fs.readdirSync(folderPath);
    for (const item of items) {
      const currentItemPath: string = path.join(folderPath, item);
      const isDirectory: boolean = OrchestratorHelper.isDirectory(currentItemPath);
      if (isDirectory) {
        // eslint-disable-next-line no-await-in-loop
        await OrchestratorHelper.iterateInputFolder(
          currentItemPath,
          utteranceLabelsMap,
          utteranceLabelDuplicateMap,
          utteranceEntityLabelsMap,
          utteranceEntityLabelDuplicateMap,
          hierarchical);
      } else {
        const ext: string = path.extname(item);
        if (processedFiles.includes(currentItemPath)) {
          continue;
        }
        if (supportedFileFormats.indexOf(ext) > -1) {
          // eslint-disable-next-line no-await-in-loop
          await OrchestratorHelper.processFile(
            currentItemPath,
            item,
            utteranceLabelsMap,
            utteranceLabelDuplicateMap,
            utteranceEntityLabelsMap,
            utteranceEntityLabelDuplicateMap,
            hierarchical);
        }
      }
    }
  }

  // eslint-disable-next-line max-params
  static getLuisIntentsEnitiesUtterances(
    luisObject: any,
    hierarchicalLabel: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>): boolean {
    try {
      // eslint-disable-next-line no-prototype-builtins
      if (luisObject.hasOwnProperty('utterances')) {
        luisObject.utterances.forEach((e: any) => {
          const label: string = e.intent.trim();
          const utterance: string = e.text.trim();
          OrchestratorHelper.addNewLabelUtterance(
            utterance,
            label,
            hierarchicalLabel,
            utteranceLabelsMap,
            utteranceLabelDuplicateMap
          );
          const entities: any[] = e.entities;
          entities.forEach((entityEntry: any) => {
            OrchestratorHelper.addNewEntityLabelUtterance(
              utterance,
              entityEntry,
              utteranceEntityLabelsMap,
              utteranceEntityLabelDuplicateMap);
          });
        });
        return true;
      }
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling getLuisIntentsEnitiesUtterances(), error=${error}`);
      throw error;
    }
    return false;
  }

  static getQnaQuestionsAsUtterances(
    qnaObject: any,
    label: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>): void {
    // Utility.debuggingLog(`OrchestratorHelper.getQnaQuestionsAsUtterances() called, qnaObject=${Utility.jsonStringify(qnaObject)}`);
    const isNotEmptyLabel: boolean = !Utility.isEmptyString(label);
    qnaObject.kb.qnaList.forEach((e: any) => {
      let answer: string = Utility.cleanStringOnSpaceCommas(e.answer);
      if (isNotEmptyLabel) {
        answer = label;
      }
      const questions: string[] = e.questions;
      questions.forEach((q: string) => {
        OrchestratorHelper.addNewLabelUtterance(
          q.trim(),
          answer,
          '',
          utteranceLabelsMap,
          utteranceLabelDuplicateMap
        );
      });
    });
  }

  // eslint-disable-next-line max-params
  static getJsonIntentsEntitiesUtterances(
    jsonObjectArray: any,
    hierarchicalLabel: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>): boolean {
    try {
      if (jsonObjectArray.length > 0)  {
        jsonObjectArray.forEach((jsonObject: any) => {
          const utterance: string = jsonObject.text.trim();
          // eslint-disable-next-line no-prototype-builtins
          if (jsonObject.hasOwnProperty('intents')) {
            const labels: string[] = jsonObject.intents;
            labels.forEach((label: string) => {
              OrchestratorHelper.addNewLabelUtterance(
                utterance,
                label,
                hierarchicalLabel,
                utteranceLabelsMap,
                utteranceLabelDuplicateMap);
            });
          }
          // eslint-disable-next-line no-prototype-builtins
          if (jsonObject.hasOwnProperty('entities')) {
            const entities: any[] = jsonObject.entities;
            entities.forEach((entityEntry: any) => {
              OrchestratorHelper.addNewEntityLabelUtterance(
                utterance,
                entityEntry,
                utteranceEntityLabelsMap,
                utteranceEntityLabelDuplicateMap);
            });
          }
        });
        return true;
      }
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling getJsonIntentsEntitiesUtterances(), error=${error}`);
      throw error;
    }
    return false;
  }

  static getJsonIntentEntityScoresUtterances(
    jsonObjectArray: any,
    utteranceLabelScoresMap: Map<string, ScoreIntent[]>,
    utteranceEntityLabelScoresMap: Map<string, ScoreEntity[]>): boolean {
    try {
      if (jsonObjectArray.length > 0) {
        jsonObjectArray.forEach((jsonObject: any) => {
          const utterance: string = jsonObject.text.trim();
          // eslint-disable-next-line no-prototype-builtins
          if (jsonObject.hasOwnProperty('intent_scores')) {
            const intentScores: any[] = jsonObject.intent_scores;
            utteranceLabelScoresMap.set(utterance, intentScores.map((intentScore: any) => {
              const intent: string = intentScore.intent;
              const score: number = intentScore.score;
              return ScoreIntent.newScoreIntent(intent, score);
            }));
          }
          // eslint-disable-next-line no-prototype-builtins
          if (jsonObject.hasOwnProperty('entity_scores')) {
            const entityScores: any[] = jsonObject.entity_scores;
            utteranceEntityLabelScoresMap.set(utterance, entityScores.map((entityScore: any) => {
              const entity: string = entityScore.entity;
              const startPos: number = entityScore.startPos;
              const endPos: number = entityScore.endPos;
              const score: number = entityScore.score;
              return ScoreEntity.newScoreEntityByPosition(entity, score, startPos, endPos);
            }));
          }
        });
        return true;
      }
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling getJsonIntentEntityScoresUtterances(), error=${error}`);
      throw error;
    }
    return false;
  }

  static getLabelFromFileName(fileName: string, ext: string, hierarchical: boolean) {
    return hierarchical ? fileName.substr(0, fileName.length - ext.length) : '';
  }

  // eslint-disable-next-line max-params
  static addNewLabelUtterance(
    utterance: string,
    label: string,
    hierarchicalLabel: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>): void {
    const isHierarchicalLabel: boolean = !Utility.isEmptyString(hierarchicalLabel);
    let existingLabels: Set<string> = new Set<string>();
    try {
      if (utteranceLabelsMap.has(utterance)) {
        existingLabels = utteranceLabelsMap.get(utterance) as Set<string>;
      }
      if (existingLabels.size > 0) {
        if (isHierarchicalLabel) {
          if (!OrchestratorHelper.addUniqueLabel(hierarchicalLabel, existingLabels)) {
            Utility.insertStringPairToStringIdStringSetNativeMap(utterance, hierarchicalLabel, utteranceLabelDuplicateMap);
          }
        } else if (!OrchestratorHelper.addUniqueLabel(label, existingLabels)) {
          Utility.insertStringPairToStringIdStringSetNativeMap(utterance, label, utteranceLabelDuplicateMap);
        }
      } else if (isHierarchicalLabel) {
        existingLabels.add(hierarchicalLabel);
        utteranceLabelsMap.set(utterance, existingLabels);
      } else {
        existingLabels.add(label);
        utteranceLabelsMap.set(utterance, existingLabels);
      }
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling addNewLabelUtterance(), error='${error}', label='${label}', utterance='${utterance}', hierarchicalLabel='${hierarchicalLabel}', isHierarchicalLabel='${isHierarchicalLabel}', existingLabels='${existingLabels}'`);
      throw error;
    }
  }

  // eslint-disable-next-line max-params
  static addNewEntityLabelUtterance(
    utterance: string,
    entityEntry: any,
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>): void {
    let existingEntityLabels: Label[] = [];
    try {
      // eslint-disable-next-line no-prototype-builtins
      if (utteranceEntityLabelsMap.has(utterance)) {
        existingEntityLabels = utteranceEntityLabelsMap.get(utterance) as Label[];
      }
      const entity: string = entityEntry.entity;
      const startPos: number = Number(entityEntry.startPos);
      const endPos: number = Number(entityEntry.endPos);
      // const entityMention: string = entityEntry.text;
      const entityLabel: Label = new Label(LabelType.Entity, entity, new Span(startPos, endPos - startPos + 1));
      if (Utility.isEmptyGenericArray(existingEntityLabels)) {
        existingEntityLabels = [entityLabel];
        utteranceEntityLabelsMap.set(utterance, existingEntityLabels);
      } else if (!OrchestratorHelper.addUniqueEntityLabelArray(entityLabel, existingEntityLabels)) {
        Utility.insertStringLabelPairToStringIdLabelSetNativeMap(utterance, entityLabel, utteranceEntityLabelDuplicateMap);
      }
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling addNewEntityLabelUtterance(), error='${error}', entityEntry='${entityEntry}', utterance='${utterance}', existingEntityLabels='${existingEntityLabels}'`);
      throw error;
    }
  }

  static addUniqueLabel(newLabel: string, labels: Set<string>): boolean {
    try {
      if (labels.has(newLabel)) {
        return false;
      }
      labels.add(newLabel);
      return true;
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling addUniqueLabel(), error='${error}', newLabel='${newLabel}', labels='${labels}'`);
      throw error;
    }
    return false;
  }

  // eslint-disable-next-line max-params
  static addNewLabelUtteranceToObejctDictionary(
    utterance: string,
    label: string,
    hierarchicalLabel: string,
    utteranceLabelsMap: { [id: string]: string[] },
    utteranceLabelDuplicateMap: Map<string, Set<string>>): void {
    const isHierarchicalLabel: boolean = !Utility.isEmptyString(hierarchicalLabel);
    let existingLabels: string[] = [];
    try {
      // eslint-disable-next-line no-prototype-builtins
      if (utteranceLabelsMap.hasOwnProperty(utterance)) {
        existingLabels = utteranceLabelsMap[utterance];
      }
      if (!Utility.isEmptyStringArray(existingLabels)) {
        if (isHierarchicalLabel) {
          if (!OrchestratorHelper.addUniqueLabelToArray(hierarchicalLabel, existingLabels)) {
            Utility.insertStringPairToStringIdStringSetNativeMap(utterance, hierarchicalLabel, utteranceLabelDuplicateMap);
          }
        } else if (!OrchestratorHelper.addUniqueLabelToArray(label, existingLabels)) {
          Utility.insertStringPairToStringIdStringSetNativeMap(utterance, label, utteranceLabelDuplicateMap);
        }
      } else if (isHierarchicalLabel) {
        utteranceLabelsMap[utterance] = [hierarchicalLabel];
      } else {
        utteranceLabelsMap[utterance] = [label];
      }
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling addNewLabelUtteranceToObejctDictionary(), error='${error}', label='${label}', utterance='${utterance}', hierarchicalLabel='${hierarchicalLabel}', isHierarchicalLabel='${isHierarchicalLabel}', existingLabels='${existingLabels}'`);
      throw error;
    }
  }

  // eslint-disable-next-line max-params
  static addNewEntityLabelUtteranceToObejctDictionary(
    utterance: string,
    entityEntry: any,
    utteranceEntityLabelsMap: { [id: string]: Label[] },
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>): void {
    let existingEntityLabels: Label[] = [];
    try {
      // eslint-disable-next-line no-prototype-builtins
      if (utteranceEntityLabelsMap.hasOwnProperty(utterance)) {
        existingEntityLabels = utteranceEntityLabelsMap[utterance];
      }
      const entity: string = entityEntry.entity;
      const startPos: number = Number(entityEntry.startPos);
      const endPos: number = Number(entityEntry.endPos);
      // const entityMention: string = entityEntry.text;
      const entityLabel: Label = new Label(LabelType.Entity, entity, new Span(startPos, endPos - startPos + 1));
      if (Utility.isEmptyGenericArray(existingEntityLabels)) {
        existingEntityLabels = [entityLabel];
        utteranceEntityLabelsMap[utterance] = existingEntityLabels;
      } else if (!OrchestratorHelper.addUniqueEntityLabelArray(entityLabel, existingEntityLabels)) {
        Utility.insertStringLabelPairToStringIdLabelSetNativeMap(utterance, entityLabel, utteranceEntityLabelDuplicateMap);
      }
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling addNewEntityLabelUtteranceToObejctDictionary(), error='${error}', entityEntry='${entityEntry}', utterance='${utterance}', existingEntityLabels='${existingEntityLabels}'`);
      throw error;
    }
  }

  static addUniqueLabelToArray(newLabel: string, labels: string[]): boolean {
    try {
      for (const label of labels) {
        if (label === newLabel) {
          return false;
        }
      }
      labels.push(newLabel);
      return true;
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling addUniqueLabelToArray(), error='${error}', newLabel='${newLabel}', labels='${labels}'`);
      throw error;
    }
    return false;
  }

  static addUniqueEntityLabelArray(newLabel: Label, labels: Label[]): boolean {
    try {
      for (const label of labels) {
        if (label.equals(newLabel)) {
          return false;
        }
      }
      labels.push(newLabel);
      return true;
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling addUniqueEntityLabelArray(), error='${error}', newLabel='${newLabel}', labels='${labels}'`);
      throw error;
    }
    return false;
  }

  static findLuFiles(srcId: string, idsToFind: string[]) {
    const baseDir: string = path.dirname(srcId);
    const retPayload: any[] = [];
    (idsToFind || []).forEach((ask: any)  => {
      const resourceToFind: string = path.isAbsolute(ask.filePath) ? ask.filePath : path.join(baseDir, ask.filePath);
      const fileContent: string = OrchestratorHelper.readFile(resourceToFind);
      if (!processedFiles.includes(resourceToFind)) {
        processedFiles.push(resourceToFind);
      }
      if (fileContent) {
        retPayload.push({
          content: fileContent,
          options: {
            id: ask.filePath,
          },
        });
      } else {
        throw new Error(`Content not found for ${resourceToFind}.`);
      }
    });
    return retPayload;
  }

  private static async getLuInputsEx(inputPath: string, retPayload: any[]) {
    if (OrchestratorHelper.isDirectory(inputPath)) {
      const items: string[] = fs.readdirSync(inputPath);
      for (const item of items) {
        const currentItemPath: string = path.join(inputPath, item);
        OrchestratorHelper.getLuInputsEx(currentItemPath, retPayload);
      }
    } else {
      const ext: string = path.extname(inputPath);
      if (ext === '.lu') {
        retPayload.push({
          content: OrchestratorHelper.readFile(inputPath),
          id: path.basename(inputPath),
        });
      }
    }
  }

  public static getLuInputs(inputPath: string) {
    const retPayload: any[] = [];
    OrchestratorHelper.getLuInputsEx(inputPath, retPayload)
    return retPayload;
  }

  public static  writeBuildOutputFiles(outputPath: string, buildOutputs: any[]) {
    for (const buildOutput of (buildOutputs || [])) {
      const baseName: any = buildOutput.id;
      const snapshotFile: string = path.join(outputPath, baseName + '.blu');
      OrchestratorHelper.writeToFile(snapshotFile, buildOutput.snapshot);
      Utility.debuggingLog(`Snapshot written to ${snapshotFile}`);

      const recoFileName: string = path.join(outputPath, `${baseName}.lu.dialog`);
      this.writeToFile(recoFileName, JSON.stringify(buildOutput.recognizer.orchestratorRecognizer, null, 2));
      Utility.debuggingLog(`Recognizer file written to ${recoFileName}`);

      const multiRecoFileName: string = path.join(outputPath, `${baseName}.en-us.lu.dialog`);
      this.writeToFile(multiRecoFileName, JSON.stringify(buildOutput.recognizer.multiLanguageRecognizer, null, 2));
      Utility.debuggingLog(`Multi language recognizer file written to ${multiRecoFileName}`);
    }
  }
}
