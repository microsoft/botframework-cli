/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Utility} from './utility';
const LuisBuilder: any = require('@microsoft/bf-lu').V2.LuisBuilder;
const QnaMakerBuilder: any = require('@microsoft/bf-lu').V2.QnAMakerBuilder;
const processedFiles: string[] = [];

export class OrchestratorHelper {
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

  static async parseBluFile(bluFileContent: string, utterancesLabelsMap: any) {
    const lines: string[] = bluFileContent.split('\n');
    if (lines.length === 0) {
      return;
    }
    OrchestratorHelper.tryParseLabelUtteranceTsv(lines, utterancesLabelsMap, true);
  }

  static async parseLuFile(luObject: any, luSearchFn: any, hierarchicalLabel: string, utterancesLabelsMap: any) {
    const luisObject: any = await LuisBuilder.fromLUAsync([luObject], luSearchFn);
    OrchestratorHelper.getIntentsUtterances(luisObject, hierarchicalLabel, utterancesLabelsMap);
  }

  static async parseTsvFile(tsvFileContent: string, hierarchicalLabel: string, utterancesLabelsMap: any) {
    const lines: string[] = tsvFileContent.split('\n');
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

  static async parseQnaFile(qnaFileContent: string, label: string, utterancesLabelsMap: any) {
    const lines: string[] = qnaFileContent.split('\n');
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
      throw new Error(`Failed parsing qna content ${qnaFileContent}`);
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
}
