/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError} from '@microsoft/bf-cli-command';
import * as path from 'path';
import * as fs from 'fs-extra';
import {Utility} from './utility';
const LUISBuilder = require('@microsoft/bf-lu').V2.LuisBuilder;
const QnamakerBuilder = require('@microsoft/bf-lu').V2.QnAMakerBuilder;
const QnamakerMaker = require('@microsoft/bf-lu').V2.QnamakerMaker;

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
      const content: string = fs.readFileSync(filePath, {encoding: 'utf8'});
      return content;
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

  public static async getTsvContent(filePath: string, hierarchical: boolean = false)  {
    try {
      const utterancesLabelsMap: any = {};
      let tsvContent: string = '';

      Utility.writeToConsole('Processing: filepath:' + filePath);
      if (OrchestratorHelper.isDirectory(filePath)) {
        await OrchestratorHelper.iterateInputFolder(filePath, utterancesLabelsMap, hierarchical);
      } else {
        await OrchestratorHelper.processFile(filePath, path.basename(filePath), utterancesLabelsMap, hierarchical);
      }

      // eslint-disable-next-line guard-for-in
      for (const utterance in utterancesLabelsMap) {
        const labels: any = utterancesLabelsMap[utterance];
        const line: string = labels.join() + '\t' + utterance + '\n';
        tsvContent += line;
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
    } else if (ext === '.tsv') {
      OrchestratorHelper.tryParseQnATsvFile(
        filePath,
        OrchestratorHelper.getLabelFromFileName(fileName, ext, hierarchical),
        utterancesLabelsMap);
    } else {
      throw new CLIError(`${filePath} has invalid extension - lu, qna, json and tsv files are supported.`);
    }
  }

  static async parseLuFile(luFile: string, hierarchicalLabel: string, utterancesLabelsMap: any) {
    const fileContents: string = OrchestratorHelper.readFile(luFile);
    const luisObject: any = await LUISBuilder.fromContentAsync(fileContents);
    OrchestratorHelper.getIntentsUtterances(luisObject, hierarchicalLabel, utterancesLabelsMap);
  }

  static tryParseQnATsvFile(tsvFile: string, label: string, utterancesLabelsMap: any) {
    const lines: string[] = OrchestratorHelper.readFile(tsvFile).split('\n');
    if (lines.length === 0 || !OrchestratorHelper.isQnATsvHeader(lines[0])) {
      return;
    }
    lines.shift();
    lines.forEach((line: string) => {
      const items: string[] = line.split('\t');
      if (items.length === 0) {
        return;
      }
      OrchestratorHelper.addNewLabelUtterance(
        items[0].trim(),
        label,
        '',
        utterancesLabelsMap
      );
    });
  }

  static isQnATsvHeader(header: string) {
    return header.indexOf('Question') > 0 && header.indexOf('Answer') > 0;
  }

  static async parseQnaFile(qnaFile: string, label: string, utterancesLabelsMap: any) {
    const fileContents: string = OrchestratorHelper.readFile(qnaFile);
    const qnaObject: any = await QnamakerBuilder.fromContent(fileContents);
    OrchestratorHelper.getQnaQuestionsAsUtterances(qnaObject, label, utterancesLabelsMap);
  }

  static async iterateInputFolder(
    folderPath: string,
    utterancesLabelsMap: any,
    hierarchical: boolean) {
    const supportedFileFormats: string[] = ['.lu', '.json', '.qna', '.tsv'];
    const items: string[] = fs.readdirSync(folderPath);
    for (const item of items) {
      const currentItemPath: string = path.join(folderPath, item);
      const isDirectory: boolean = fs.lstatSync(currentItemPath).isDirectory();

      if (isDirectory) {
        // eslint-disable-next-line no-await-in-loop
        await OrchestratorHelper.iterateInputFolder(currentItemPath, utterancesLabelsMap, hierarchical);
      } else {
        const ext: string = path.extname(item);
        if (supportedFileFormats.indexOf(ext) > -1) {
          // eslint-disable-next-line no-await-in-loop
          await OrchestratorHelper.processFile(currentItemPath, item, utterancesLabelsMap, hierarchical);
        }
      }
    }
  }

  static getIntentsUtterances(luisObject: any, hierarchicalLabel: string, utterancesLabelsMap: any) {
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
    let existingLabels = utterancesLabelsMap[utterance];
    if (existingLabels) {
      if (hierarchicalLabel != null && hierarchicalLabel.length > 0) {
        OrchestratorHelper.addUniqueLabel(hierarchicalLabel, existingLabels);
      }
      OrchestratorHelper.addUniqueLabel(label, existingLabels);
      utterancesLabelsMap[utterance] = existingLabels;
    }
    else {
      if (hierarchicalLabel != null && hierarchicalLabel.length > 0) {
        utterancesLabelsMap[utterance] = [label, hierarchicalLabel];
      }
      else {
        utterancesLabelsMap[utterance] = [label];
      }
    }
  }

  static addUniqueLabel(newLabel: string, labels: string[]) {
    let labelExists = false;
    for(const label of labels) {
      if (label === newLabel) {
        labelExists = true;
        break;
      }
    }  

    if (!labelExists) {
      labels.push(newLabel);
    }
  }
}