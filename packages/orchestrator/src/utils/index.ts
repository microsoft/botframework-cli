/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError} from '@microsoft/bf-cli-command';
import * as path from 'path';
import * as fs from 'fs-extra';
import {Utility} from '@microsoft/bf-orchestrator';
const ReadText: any = require('read-text-file');
const LuisBuilder: any = require('@microsoft/bf-lu').V2.LuisBuilder;
const QnaMakerBuilder: any = require('@microsoft/bf-lu').V2.QnAMakerBuilder;
const processedFiles: string[] = [];

export class OrchestratorHelper {
  public static isDirectory(path: string): boolean {
    try {
      const stats: fs.Stats = fs.statSync(path);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  public static readFile(filePath: string): string {
    try {
      return ReadText.readSync(filePath);
    } catch (error) {
      throw new CLIError(error);
    }
  }

  public static writeToFile(filePath: string, content: string): string {
    try {
      fs.writeFileSync(filePath, content);
      return filePath;
    } catch (error) {
      throw new CLIError(error);
    }
  }

  public static deleteFile(filePath: string)  {
    try {
      fs.unlinkSync(filePath);
    } catch {
    }
  }

  public static createDteContent(utterancesLabelsMap: any) {
    const labelUtteranceMap: { [label: string]: string} = {};
    // eslint-disable-next-line guard-for-in
    for (const utterance in utterancesLabelsMap) {
      const labels: any = utterancesLabelsMap[utterance];
      labels.forEach((label: string) => {
        if (label in labelUtteranceMap) {
          labelUtteranceMap[label] = labelUtteranceMap[label] + '|' + utterance;
        } else {
          labelUtteranceMap[label] = utterance;
        }
      });
    }
    let key: number = 0;
    let tsvContent: string = '';
    // eslint-disable-next-line guard-for-in
    for (const label in labelUtteranceMap) {
      const utterances: string = labelUtteranceMap[label];
      const line: string = key + '\t' + label + '\t' + utterances + '\n';
      tsvContent += line;
      key += 1;
    }

    return tsvContent;
  }

  public static async getTsvContent(
    filePath: string,
    hierarchical: boolean = false,
    outputDteFormat: boolean = false)  {
    try {
      const utterancesLabelsMap: any = {};
      let tsvContent: string = '';

      if (OrchestratorHelper.isDirectory(filePath)) {
        await OrchestratorHelper.iterateInputFolder(filePath, utterancesLabelsMap, hierarchical);
      } else {
        await OrchestratorHelper.processFile(filePath, path.basename(filePath), utterancesLabelsMap, hierarchical);
      }

      if (outputDteFormat) {
        tsvContent = OrchestratorHelper.createDteContent(utterancesLabelsMap);
      } else {
        // eslint-disable-next-line guard-for-in
        for (const utterance in utterancesLabelsMap) {
          const labels: any = utterancesLabelsMap[utterance];
          const line: string = labels.join() + '\t' + utterance + '\n';
          tsvContent += line;
        }
      }

      return tsvContent;
    } catch (error) {
      throw new CLIError(error);
    }
  }

  static async processFile(
    filePath: string,
    fileName: string,
    utterancesLabelsMap: any,
    hierarchical: boolean) {
    const ext: string = path.extname(filePath);
    if (ext === '.lu') {
      Utility.writeToConsole(`Processing ${filePath}...`);
      await OrchestratorHelper.parseLuFile(
        filePath,
        OrchestratorHelper.getLabelFromFileName(fileName, ext, hierarchical),
        utterancesLabelsMap);
    } else if (ext === '.qna') {
      Utility.writeToConsole(`Processing ${filePath}...`);
      await OrchestratorHelper.parseQnaFile(
        filePath,
        OrchestratorHelper.getLabelFromFileName(fileName, ext, hierarchical),
        utterancesLabelsMap);
    } else if (ext === '.json') {
      Utility.writeToConsole(`Processing ${filePath}...\n`);
      OrchestratorHelper.getIntentsUtterances(
        fs.readJsonSync(filePath),
        OrchestratorHelper.getLabelFromFileName(fileName, ext, hierarchical),
        utterancesLabelsMap);
    } else if (ext === '.tsv' || ext === '.txt') {
      OrchestratorHelper.parseTsvFile(
        filePath,
        OrchestratorHelper.getLabelFromFileName(fileName, ext, hierarchical),
        utterancesLabelsMap);
    } else if (ext === '.blu') {
      OrchestratorHelper.parseBluFile(
        filePath,
        utterancesLabelsMap);
    } else {
      throw new CLIError(`${filePath} has invalid extension - lu, qna, json and tsv files are supported.`);
    }
  }

  static async parseBluFile(bluFile: string, utterancesLabelsMap: any) {
    const lines: string[] = OrchestratorHelper.readFile(bluFile).split('\n');
    if (lines.length === 0) {
      return;
    }
    OrchestratorHelper.tryParseLabelUtteranceTsv(lines, utterancesLabelsMap, true);
  }

  static async parseLuFile(luFile: string, hierarchicalLabel: string, utterancesLabelsMap: any) {
    const fileContents: string = OrchestratorHelper.readFile(luFile);
    const luObject: any = {
      content: fileContents,
      id: luFile,
    };
    const luisObject: any = await LuisBuilder.fromLUAsync([luObject], OrchestratorHelper.findLuFiles);
    OrchestratorHelper.getIntentsUtterances(luisObject, hierarchicalLabel, utterancesLabelsMap);
  }

  static async parseTsvFile(tsvFile: string, hierarchicalLabel: string, utterancesLabelsMap: any) {
    const lines: string[] = OrchestratorHelper.readFile(tsvFile).split('\n');
    if (lines.length === 0) {
      return;
    }
    if (!OrchestratorHelper.tryParseQnATsvFile(lines, hierarchicalLabel, utterancesLabelsMap)) {
      OrchestratorHelper.tryParseLabelUtteranceTsv(lines, utterancesLabelsMap);
    }
  }

  static tryParseLabelUtteranceTsv(lines: string[], utterancesLabelsMap: any, bluFormat: boolean = false): boolean {
    if (!bluFormat && OrchestratorHelper.hasLabelUtteranceHeader(lines[0])) {
      lines.shift();
    }
    lines.forEach((line: string) => {
      const items: string[] = line.split('\t');
      if (items.length < 2) {
        return;
      }
      let labels: string = items[0] ? items[0] : '';
      const utteranceIdx: number = (items.length === 3 && !bluFormat) ? 2 : 1;
      let utterance: string = items[utteranceIdx] ? items[utteranceIdx] : '';
      labels = labels.trim();
      utterance = utterance.trim();
      OrchestratorHelper.addNewLabelUtterance(
        utterance,
        labels,
        '',
        utterancesLabelsMap
      );
    });
    return true;
  }

  static tryParseQnATsvFile(lines: string[], label: string, utterancesLabelsMap: any): boolean {
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
        utterancesLabelsMap
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

  static async parseQnaFile(qnaFile: string, label: string, utterancesLabelsMap: any) {
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

    const qnaObject: any = await QnaMakerBuilder.fromContent(newlines.join('\n'));
    if (qnaObject) {
      OrchestratorHelper.getQnaQuestionsAsUtterances(qnaObject, label, utterancesLabelsMap);
    } else {
      throw new CLIError(`Failed parsing qna file ${qnaFile}`);
    }
  }

  static async iterateInputFolder(
    folderPath: string,
    utterancesLabelsMap: any,
    hierarchical: boolean) {
    const supportedFileFormats: string[] = ['.lu', '.json', '.qna', '.tsv', '.txt', '.blu'];
    const items: string[] = fs.readdirSync(folderPath);
    for (const item of items) {
      const currentItemPath: string = path.join(folderPath, item);
      const isDirectory: boolean = fs.lstatSync(currentItemPath).isDirectory();

      if (isDirectory) {
        // eslint-disable-next-line no-await-in-loop
        await OrchestratorHelper.iterateInputFolder(currentItemPath, utterancesLabelsMap, hierarchical);
      } else {
        const ext: string = path.extname(item);
        if (processedFiles.includes(currentItemPath)) {
          continue;
        }
        if (supportedFileFormats.indexOf(ext) > -1) {
          // eslint-disable-next-line no-await-in-loop
          await OrchestratorHelper.processFile(currentItemPath, item, utterancesLabelsMap, hierarchical);
        }
      }
    }
  }

  static getIntentsUtterances(
    luisObject: any,
    hierarchicalLabel: string,
    utterancesLabelsMap: any) {
    // eslint-disable-next-line no-prototype-builtins
    if (luisObject.hasOwnProperty('utterances')) {
      luisObject.utterances.forEach((e: any) => {
        const label: string = e.intent.trim();
        const utterance: string = e.text.trim();

        OrchestratorHelper.addNewLabelUtterance(
          utterance,
          label,
          hierarchicalLabel,
          utterancesLabelsMap
        );
      });
    }
  }

  static getQnaQuestionsAsUtterances(qnaObject: any, label: string, utterancesLabelsMap: any) {
    qnaObject.kb.qnaList.forEach((e: any) => {
      const questions: string[] = e.questions;
      questions.forEach((q: string) => {
        OrchestratorHelper.addNewLabelUtterance(
          q.trim(),
          label,
          '',
          utterancesLabelsMap
        );
      });
    });
  }

  static getLabelFromFileName(fileName: string, ext: string, hierarchical: boolean) {
    return hierarchical ? fileName.substr(0, fileName.length - ext.length) : '';
  }

  static addNewLabelUtterance(
    utterance: string,
    label: string,
    hierarchicalLabel: string,
    utterancesLabelsMap: any) {
    const existingLabels: string[] = utterancesLabelsMap[utterance];
    if (existingLabels) {
      if (hierarchicalLabel && hierarchicalLabel.length > 0) {
        OrchestratorHelper.addUniqueLabel(hierarchicalLabel, existingLabels);
      } else {
        OrchestratorHelper.addUniqueLabel(label, existingLabels);
      }
      utterancesLabelsMap[utterance] = existingLabels;
    } else if (hierarchicalLabel && hierarchicalLabel.length > 0) {
      utterancesLabelsMap[utterance] = [hierarchicalLabel];
    } else {
      utterancesLabelsMap[utterance] = [label];
    }
  }

  static addUniqueLabel(newLabel: string, labels: string[]) {
    let labelExists: boolean = false;
    for (const label of labels) {
      if (label === newLabel) {
        labelExists = true;
        break;
      }
    }

    if (!labelExists) {
      labels.push(newLabel);
    }
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
        throw new CLIError(`Content not found for ${resourceToFind}.`);
      }
    });
    return retPayload;
  }
}
