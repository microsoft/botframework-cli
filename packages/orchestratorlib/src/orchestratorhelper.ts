/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
require('fast-text-encoding');

import {LabelType} from '@microsoft/bf-dispatcher';
import {Label} from '@microsoft/bf-dispatcher';
import {ScoreEntity} from '@microsoft/bf-dispatcher';
import {ScoreIntent} from '@microsoft/bf-dispatcher';
// import {Span} from '@microsoft/bf-dispatcher';

import {LabelResolver} from './labelresolver';
import {UtilityLabelResolver} from './utilitylabelresolver';

import {PrebuiltToRecognizerMap} from './resources/recognizer-map';

import {Utility} from './utility';

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

  public static mkDir(path: string): void {
    fs.mkdirSync(path);
  }

  public static readBluSnapshotFile(filePath: string): string {
    return ReadText.readSync(filePath);
    // ---- NOTE
    // the code below was trying to normalize unknown labels in a BLU file,
    // but the unknown labels should have been processed during ingesting
    // a raw input file (LU, QnA, TSV, etc.) and before creating a BLU file,
    // so there is really no need to process unknown labels in a BLU file
    // anymore. The line below is thus deprecated, especially now the BLU
    // file can be a JSON, so the statement below does not apply anyway.
    // ---- return Utility.processUnknownSpuriousLabelsInTsvBluFileContent(ReadText.readSync(filePath));
  }

  public static readFile(filePath: string): string {
    return ReadText.readSync(filePath);
  }

  public static writeToFile(filePath: string, content: string, options: any = {encoding: 'utf8', flag: 'w'}): string {
    const resolvedFilePath: string = Utility.dumpFile(filePath, content, options);
    if (Utility.isEmptyString(resolvedFilePath)) {
      Utility.debuggingLog(`ERROR: failed writing to file ${resolvedFilePath}`);
    } else {
      Utility.debuggingLog(`Successfully wrote to file ${resolvedFilePath}`);
    }
    return resolvedFilePath;
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
    const utteranceLabelsMap: Map<string, Set<string>> =
      (await OrchestratorHelper.getUtteranceLabelsMap(inputPathConfiguration, hierarchical)).utteranceLabelsMap;
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
    return Utility.exists(file) ? new TextEncoder().encode(OrchestratorHelper.readBluSnapshotFile(file)) : new Uint8Array();
  }

  public static async getUtteranceLabelsMap(
    filePathConfiguration: string,
    hierarchical: boolean = false,
    routingName: string = ''): Promise<{
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
        // eslint-disable-next-line no-await-in-loop
        await OrchestratorHelper.iterateInputFolder(
          filePathEntry,
          utteranceLabelsMap,
          utteranceLabelDuplicateMap,
          utteranceEntityLabelsMap,
          utteranceEntityLabelDuplicateMap,
          hierarchical);
      } else {
        // eslint-disable-next-line no-await-in-loop
        await OrchestratorHelper.processFile(
          filePathEntry,
          OrchestratorHelper.getRoutingNameFromFileName(filePathEntry, hierarchical, routingName),
          utteranceLabelsMap,
          utteranceLabelDuplicateMap,
          utteranceEntityLabelsMap,
          utteranceEntityLabelDuplicateMap);
      }
    }
    Utility.processUnknownSpuriousLabelsInUtteranceLabelsMap({utteranceLabelsMap, utteranceLabelDuplicateMap});
    return {utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap};
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

  public static getDialogFilesContent(baseName: string, recognizers: any = [], routingName: string = '', skillName: string = '') {
    let recoContent: any;
    if (Utility.isEmptyString(skillName)) {
      recoContent = {
        $kind: 'Microsoft.OrchestratorRecognizer',
        modelFolder: '=settings.orchestrator.modelPath',
        snapshotFile: `=settings.orchestrator.snapshots.${baseName}`,
        entityRecognizers: recognizers,
      };
    } else {
      // eslint-disable-next-line no-warning-comments
      // TODO: remove $designer or generate the id with randomly generated 6 alphanumeric characters
      routingName = Utility.isEmptyString(routingName) ? baseName : routingName;
      recoContent = {
        $kind: 'Microsoft.OnIntent',
        $designer: {
          id: '2oSiwz',
          name: `${routingName}`,
        },
        intent: `${routingName}`,
        actions: [
          {
            $kind: 'Microsoft.BeginSkill',
            $designer: {
              id: 'pDok9V',
            },
            activityProcessed: true,
            botId: '=settings.MicrosoftAppId',
            skillHostEndpoint: '=settings.skillHostEndpoint',
            connectionName: '=settings.connectionName',
            allowInterruptions: true,
            skillEndpoint: `=settings.skill['${skillName}'].endpointUrl`,
            skillAppId: `=settings.skill['${skillName}'].msAppId`,
          },
        ],
      };
    }

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
    routingName: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>): Promise<void> {
    const ext: string = path.extname(filePath);

    if (ext !== '.lu' &&
        ext !== '.json' &&
        ext !== '.qna' &&
        ext !== '.tsv' &&
        ext !== '.txt' &&
        ext !== '.blu' &&
        ext !== '.dispatch') {
      throw new Error(`${filePath} has invalid extension - only lu, qna, json, tsv and dispatch files are supported.`);
    }

    Utility.writeStringToConsoleStdout(`Processing ${filePath}...`);
    try {
      switch (ext) {
      case '.lu':
        await OrchestratorHelper.parseLuFile(
          filePath,
          routingName,
          utteranceLabelsMap,
          utteranceLabelDuplicateMap,
          utteranceEntityLabelsMap,
          utteranceEntityLabelDuplicateMap);
        break;
      case '.qna':
        await OrchestratorHelper.parseQnaFile(
          filePath,
          routingName,
          utteranceLabelsMap,
          utteranceLabelDuplicateMap);
        break;
      case '.json':
        if (OrchestratorHelper.getIntentsEntitiesUtterances(
          fs.readJsonSync(filePath),
          routingName,
          utteranceLabelsMap,
          utteranceLabelDuplicateMap,
          utteranceEntityLabelsMap,
          utteranceEntityLabelDuplicateMap)) {
          return;
        }
        if (!OrchestratorHelper.getJsonIntentsEntitiesUtterances(
          fs.readJsonSync(filePath),
          routingName,
          utteranceLabelsMap,
          utteranceLabelDuplicateMap,
          utteranceEntityLabelsMap,
          utteranceEntityLabelDuplicateMap)) {
          throw new Error('Failed to parse LUIS or JSON file on intent/entity labels');
        }
        break;
      case '.tsv':
      case '.txt':
        OrchestratorHelper.parseTsvFile(
          filePath,
          routingName,
          utteranceLabelsMap,
          utteranceLabelDuplicateMap);
        break;
      case '.blu':
        OrchestratorHelper.parseTsvBluFile(
          filePath,
          utteranceLabelsMap,
          utteranceLabelDuplicateMap);
        break;
      case '.dispatch':
        /*
        OrchestratorHelper.parseDispatchFile(
          filePath,
          utteranceLabelsMap,
          utteranceLabelDuplicateMap); */
        break;
      }
    } catch (error) {
      throw new Error(`Failed to parse ${filePath}`);
    }
  }

  // eslint-disable-next-line max-params
  static async parseJsonBluFile(
    jsonBluFile: string,
    hierarchicalLabel: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>) {
    const fileContents: string = OrchestratorHelper.readFile(jsonBluFile);
    Utility.debuggingLog('BEFORE calling OrchestratorHelper.parseJsonBluFile()');
    // Utility.debuggingLog(`BEFORE calling OrchestratorHelper.parseJsonBluFile(), fileContents=${fileContents}`);
    const jsonBluObject: any = JSON.parse(fileContents);
    Utility.debuggingLog('AFTER calling OrchestratorHelper.parseJsonBluFile()');
    OrchestratorHelper.getJsonBluIntentsEntitiesUtterances(
      jsonBluObject,
      hierarchicalLabel,
      utteranceLabelsMap,
      utteranceLabelDuplicateMap,
      utteranceEntityLabelsMap,
      utteranceEntityLabelDuplicateMap);
  }

  static parseTsvBluFile(
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

  /*
  static parseDispatchFile(
    dispatchFile: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>) {
    const fileContents: string = OrchestratorHelper.readFile(dispatchFile);
    Utility.debuggingLog('BEFORE calling OrchestratorHelper.parseDispatchFile()');
    const jsonDispatchSettings: any = JSON.parse(fileContents);
  }
*/
  // eslint-disable-next-line max-params
  static async parseLuFile(
    luFile: string,
    hierarchicalLabel: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>) {
    await OrchestratorHelper.parseLuContent(
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
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog1('parseLuContent(): calling getIntentsEntitiesUtterances(), luisObject=', luisObject);
    }
    try {
      const rvLu: boolean = OrchestratorHelper.getIntentsEntitiesUtterances(
        luisObject,
        hierarchicalLabel,
        utteranceLabelsMap,
        utteranceLabelDuplicateMap,
        utteranceEntityLabelsMap,
        utteranceEntityLabelDuplicateMap);
      if (!rvLu) {
        throw new Error('Failed to parse LUIS or JSON file on intent/entity labels');
      }
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling getIntentsEntitiesUtterances(), error=${error}`);
      throw error;
    }
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
    hierarchicalLabel: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>): boolean {
    if (!OrchestratorHelper.isQnATsvHeader(lines[0])) {
      return false;
    }
    const hasLabel: boolean = !Utility.isEmptyString(hierarchicalLabel);
    lines.shift();
    lines.forEach((line: string) => {
      const items: string[] = line.split('\t');
      if (items.length < 2) {
        return;
      }
      OrchestratorHelper.addNewLabelUtterance(
        items[0].trim(),
        hasLabel ? hierarchicalLabel : Utility.cleanStringOnSpaceCommas(items[1].trim()),
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
    hierarchicalLabel: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>) {
    const fileContents: string = OrchestratorHelper.readFile(qnaFile);
    const lines: string[] = fileContents.split('\n');
    if (lines.length === 0) {
      return;
    }

    const newlines: string[] = [];
    lines.forEach((line: string) => {
      if (line.toLowerCase().indexOf('@qna.pair.source =') < 0) {
        newlines.push(line);
      }
    });

    // Utility.debuggingLog('OrchestratorHelper.parseQnaFile() ready to call QnaMakerBuilder.fromContent()');
    const qnaNormalized: string = Utility.cleanStringOnTabs(newlines.join('\n')); // ---- NOTE ---- QnaMakerBuilder does not like TAB
    const qnaObject: any = await QnaMakerBuilder.fromContent(qnaNormalized);
    if (qnaObject) {
      OrchestratorHelper.getQnaQuestionsAsUtterances(qnaObject, hierarchicalLabel, utteranceLabelsMap, utteranceLabelDuplicateMap);
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
    const files: string[] = fs.readdirSync(folderPath);
    for (const file of files) {
      const currentItemPath: string = path.join(folderPath, file);
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
        const ext: string = path.extname(file);
        if (processedFiles.includes(currentItemPath)) {
          continue;
        }
        if (supportedFileFormats.indexOf(ext) > -1) {
          // eslint-disable-next-line no-await-in-loop
          await OrchestratorHelper.processFile(
            currentItemPath,
            OrchestratorHelper.getRoutingNameFromFileName(file, hierarchical),
            utteranceLabelsMap,
            utteranceLabelDuplicateMap,
            utteranceEntityLabelsMap,
            utteranceEntityLabelDuplicateMap);
        }
      }
    }
  }

  // eslint-disable-next-line max-params
  static getIntentsEntitiesUtterances(
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
      Utility.debuggingLog(`EXCEPTION calling getIntentsEntitiesUtterances(), error=${error}`);
      throw error;
    }
    return false;
  }

  static getQnaQuestionsAsUtterances(
    qnaObject: any,
    hierarchicalLabel: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>): void {
    // Utility.debuggingLog(`OrchestratorHelper.getQnaQuestionsAsUtterances() called, qnaObject=${Utility.jsonStringify(qnaObject)}`);
    const hasLabel: boolean = !Utility.isEmptyString(hierarchicalLabel);
    qnaObject.kb.qnaList.forEach((e: any) => {
      let answer: string;
      if (hasLabel) {
        answer = hierarchicalLabel;
      } else {
        answer = Utility.cleanStringOnSpaceCommas(e.answer);
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
  static getJsonBluIntentsEntitiesUtterances(
    jsonBluObject: any,
    hierarchicalLabel: string,
    utteranceLabelsMap: Map<string, Set<string>>,
    utteranceLabelDuplicateMap: Map<string, Set<string>>,
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>): boolean {
    try {
      let jsonBluExamplesArray: any = null;
      // eslint-disable-next-line no-prototype-builtins
      if (jsonBluObject.hasOwnProperty('examples')) {
        jsonBluExamplesArray = jsonBluObject.examples;
      } else {
        return false;
      }
      if (jsonBluExamplesArray.length > 0)  {
        jsonBluExamplesArray.forEach((jsonBluExample: any) => {
          const utterance: string = jsonBluExample.text.trim();
          // eslint-disable-next-line no-prototype-builtins
          if (jsonBluExample.hasOwnProperty('intents')) {
            const jsonBluExampleIntents: any = jsonBluExample.intents;
            jsonBluExampleIntents.forEach((jsonBluExampleIntent: any) => {
              const jsonBluExampleIntentLabel: string = jsonBluExampleIntent.name;
              OrchestratorHelper.addNewLabelUtterance(
                utterance,
                jsonBluExampleIntentLabel,
                hierarchicalLabel,
                utteranceLabelsMap,
                utteranceLabelDuplicateMap);
            });
          }
          // eslint-disable-next-line no-prototype-builtins
          if (jsonBluExample.hasOwnProperty('entities')) { // ---- NOTE-TODO-NEED-TO-REEXAMINE-AFTER-BLU-IS-IMPLEMENTED ----
            const jsonBluExampleEntities: any[] = jsonBluExample.entities;
            jsonBluExampleEntities.forEach((jsonBluExampleEntity: any) => {
              const jsonBluExampleEntityLabel: string = jsonBluExampleEntity.entity;
              const jsonBluExampleEntityOffset: number = jsonBluExampleEntity.offset;
              const jsonBluExampleEntityLength: number = jsonBluExampleEntity.length;
              OrchestratorHelper.addNewEntityLabelObjectUtterance(
                utterance,
                Label.newEntityLabel(jsonBluExampleEntityLabel, jsonBluExampleEntityOffset, jsonBluExampleEntityLength),
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

  static getRoutingNameFromFileName(filePath: string, hierarchical: boolean, routingName: string = '') {
    if (!hierarchical) {
      return '';
    }
    const fileName: string = path.basename(filePath);
    const ext: string = path.extname(filePath);
    return Utility.isEmptyString(routingName) ? fileName.substr(0, fileName.length - ext.length) : routingName;
  }

  // ---- NOTE-TO-REFACTOR ----
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

  // ---- NOTE-TO-REFACTOR ----
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
      const entityName: string = entityEntry.entity;
      const startPos: number = Number(entityEntry.startPos);
      const endPos: number = Number(entityEntry.endPos);
      // const entityMention: string = entityEntry.text;
      if (Utility.isEmptyString(entityName) || (startPos === undefined) || (endPos === undefined)) {
        Utility.debuggingThrow(`EMPTY entityName: '${entityName}', startPos='${startPos}', endPos='${endPos}', entityEntry='${entityEntry}', utterance='${utterance}'`);
      }
      const entityLabel: Label = Label.newEntityLabelByPosition(entityName, startPos, endPos);
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

  // ---- NOTE-TO-REFACTOR ----
  // eslint-disable-next-line max-params
  static addNewEntityLabelObjectUtterance(
    utterance: string,
    entityEntry: Label,
    utteranceEntityLabelsMap: Map<string, Label[]>,
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>): void {
    let existingEntityLabels: Label[] = [];
    try {
      // eslint-disable-next-line no-prototype-builtins
      if (utteranceEntityLabelsMap.has(utterance)) {
        existingEntityLabels = utteranceEntityLabelsMap.get(utterance) as Label[];
      }
      const labelType: LabelType = entityEntry.labeltype;
      const entityName: string = entityEntry.name;
      const offset: number = entityEntry.span.offset;
      const length: number = entityEntry.span.length;
      // ---- NOTE-NOT-AVAILABLE ---- const entityMention: string = entityEntry.text;
      if (Utility.isEmptyString(entityName) || (labelType === undefined) || (offset === undefined) || (length === undefined)) {
        Utility.debuggingThrow(`EMPTY entityName: '${entityName}', labelType='${labelType}', offset='${offset}', length='${length}', entityEntry='${entityEntry}', utterance='${utterance}'`);
      }
      if (Utility.isEmptyGenericArray(existingEntityLabels)) {
        existingEntityLabels = [entityEntry];
        utteranceEntityLabelsMap.set(utterance, existingEntityLabels);
      } else if (!OrchestratorHelper.addUniqueEntityLabelArray(entityEntry, existingEntityLabels)) {
        Utility.insertStringLabelPairToStringIdLabelSetNativeMap(utterance, entityEntry, utteranceEntityLabelDuplicateMap);
      }
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling addNewEntityLabelUtterance(), error='${error}', entityEntry='${entityEntry}', utterance='${utterance}', existingEntityLabels='${existingEntityLabels}'`);
      throw error;
    }
  }

  // ---- NOTE-TO-REFACTOR ----
  static addUniqueLabel(newLabel: string, labels: Set<string>): boolean {
    try {
      if (labels.has(newLabel)) {
        return false;
      }
      if (Utility.isEmptyString(newLabel)) {
        Utility.debuggingThrow(`EMPTY newLabel: '${newLabel}'`);
      }
      labels.add(newLabel);
      return true;
    } catch (error) {
      Utility.debuggingLog(`EXCEPTION calling addUniqueLabel(), error='${error}', newLabel='${newLabel}', labels='${labels}'`);
      throw error;
    }
    return false;
  }

  // ---- NOTE-TO-REFACTOR ----
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

  // ---- NOTE-TO-REFACTOR ----
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
      const entityName: string = entityEntry.entity;
      const startPos: number = Number(entityEntry.startPos);
      const endPos: number = Number(entityEntry.endPos);
      // const entityMention: string = entityEntry.text;
      const entityLabel: Label = Label.newEntityLabelByPosition(entityName, startPos, endPos);
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

  // ---- NOTE-TO-REFACTOR ----
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

  // ---- NOTE-TO-REFACTOR ----
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

  static findLuFiles(srcId: string, idsToFind: string[]): any[] {
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

  private static async getLuInputsEx(inputPath: string, retPayload: any[]): Promise<void> {
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
          id: path.basename(inputPath, '.lu'),
        });
      }
    }
  }

  public static getLuInputs(inputPath: string): any[] {
    const retPayload: any[] = [];
    OrchestratorHelper.getLuInputsEx(inputPath, retPayload);
    return retPayload;
  }

  public static  writeBuildOutputFiles(outputPath: string, retPayload: any): void {
    const buildOutputs: any[] = retPayload.outputs;
    const bluPaths: any = retPayload.settings.orchestrator.snapshots;
    for (const buildOutput of (buildOutputs || [])) {
      const baseName: any = buildOutput.id;
      const snapshotFile: string = path.join(outputPath, baseName + '.blu');
      OrchestratorHelper.writeToFile(snapshotFile, buildOutput.snapshot);
      Utility.debuggingLog(`Snapshot written to ${snapshotFile}`);

      if (buildOutput.recognizer !== undefined) {
        const recoFileName: string = path.join(outputPath, `${baseName}.lu.dialog`);
        this.writeToFile(recoFileName, Utility.jsonStringify(buildOutput.recognizer.orchestratorRecognizer, null, 2));
        Utility.debuggingLog(`Recognizer file written to ${recoFileName}`);

        const multiRecoFileName: string = path.join(outputPath, `${baseName}.en-us.lu.dialog`);
        this.writeToFile(multiRecoFileName, Utility.jsonStringify(buildOutput.recognizer.multiLanguageRecognizer, null, 2));
        Utility.debuggingLog(`Multi language recognizer file written to ${multiRecoFileName}`);
      }

      bluPaths[baseName] = snapshotFile;
    }
  }

  // eslint-disable-next-line max-params
  public static async processLuContent(
    luObject: any,
    routingName: string = '',
    isDialog: boolean = false,
    fullEmbedding: boolean = false,
    labelResolver: any = null,
    skillName: string = '') {
    Utility.debuggingLog(`routingName=${routingName}`);

    if (!labelResolver) {
      Utility.debuggingLog('OrchestratorHelper.processLuFile(), ready to call LabelResolver.createLabelResolver()');
      labelResolver = LabelResolver.createLabelResolver();
      Utility.debuggingLog('OrchestratorHelper.processLuFile(), after calling LabelResolver.createLabelResolver()');
      Utility.debuggingLog('Created label resolver');
    }
    if (fullEmbedding) {
      UtilityLabelResolver.resetLabelResolverSettingUseCompactEmbeddings(fullEmbedding);
    }

    const baseName: string = luObject.id;

    const result: {
      'utteranceLabelsMap': Map<string, Set<string>>;
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': Map<string, Label[]>;
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } = {
        utteranceLabelsMap: new Map<string, Set<string>>(),
        utteranceLabelDuplicateMap: new Map<string, Set<string>>(),
        utteranceEntityLabelsMap: new Map<string, Label[]>(),
        utteranceEntityLabelDuplicateMap: new Map<string, Label[]>()};

    await OrchestratorHelper.parseLuContent(
      luObject.id,
      luObject.content,
      routingName,
      result.utteranceLabelsMap,
      result.utteranceLabelDuplicateMap,
      result.utteranceEntityLabelsMap,
      result.utteranceEntityLabelDuplicateMap);

    Utility.debuggingLog(`Processed ${luObject.id}`);
    LabelResolver.addExamples(result, labelResolver);
    const snapshot: any = labelResolver.createSnapshot();
    const entities: any = await OrchestratorHelper.getEntitiesInLu(luObject);
    const recognizer: any = isDialog ? OrchestratorHelper.getDialogFilesContent(baseName, entities, routingName, skillName) : undefined;
    return {id: baseName, snapshot: snapshot, recognizer: recognizer};
  }
}
