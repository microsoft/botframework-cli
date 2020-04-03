/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, utils} from '@microsoft/bf-cli-command';
import * as path from 'path';
import * as fs from 'fs-extra';
const LUISBuilder = require('@microsoft/bf-lu').V2.LuisBuilder;
const QnamakerBuilder = require('@microsoft/bf-lu').V2.QnAMakerBuilder;

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
      const content = fs.readFileSync(filePath, {encoding:'utf8'}); 
      return content;
    } catch (error) {
      throw new CLIError(error)
    }
  }

  public static writeToFile(filePath: string, content: string): string {
    try {
      fs.writeFileSync(filePath, content);
      return filePath;
    } catch (error) {
      throw new CLIError(error)
    }
  }

  public static deleteFile(filePath: string)  {
    try {
      fs.unlinkSync(filePath);
    } catch {
    }
  }

  public static async getTsvContent(filePath: string, hierarchical: boolean)  {
    try {
      const utterancesLabelsMap: any = {};
      let tsvContent = '';

      if (OrchestratorHelper.isDirectory(filePath)) {
        await OrchestratorHelper.iterateInputFolder(filePath, utterancesLabelsMap, hierarchical);
      }
      else {
        await OrchestratorHelper.processFile(filePath, path.basename(filePath), utterancesLabelsMap, hierarchical);
      }

      for(var utterance in utterancesLabelsMap) {
        let labels = utterancesLabelsMap[utterance];
        let line = labels.join() + '\t' + utterance + '\n';
        tsvContent += line;
      }  

      return tsvContent;

    } catch(error) {
      throw new CLIError(error)
    }
  }

  static async processFile(
    filePath: string, 
    fileName: string, 
    utterancesLabelsMap: any,
    hierarchical: boolean) {

    let ext = path.extname(filePath);
    if (ext === '.lu') {
      console.log(`Processing ${filePath}...`);
      await OrchestratorHelper.parseLuFile(filePath, hierarchical ? fileName.substr(0, fileName.length - 3) : '', utterancesLabelsMap);
    }
    else if (ext === '.qna') {
      console.log(`Processing ${filePath}...`);
      await OrchestratorHelper.parseQnaFile(filePath, fileName.substr(0, fileName.length - 4), utterancesLabelsMap);
    }    
    else if (ext === '.json') {
      console.log(`Processing ${filePath}...`);
      OrchestratorHelper.getIntentsUtterances(fs.readJsonSync(filePath), hierarchical ? fileName.substr(0, fileName.length - 5) : '', utterancesLabelsMap);
    }
  }

  static async parseLuFile(luFile: string, hierarchicalLabel: string, utterancesLabelsMap: any) {
    let fileContents = OrchestratorHelper.readFile(luFile);
    let luisObject = await LUISBuilder.fromContentAsync(fileContents);     
    OrchestratorHelper.getIntentsUtterances(luisObject, hierarchicalLabel, utterancesLabelsMap);
  }
  
  static async parseQnaFile(qnaFile: string, label: string, utterancesLabelsMap: any) {
    let fileContents = OrchestratorHelper.readFile(qnaFile);
    let qnaObject = await QnamakerBuilder.fromContentAsync(fileContents);     
    OrchestratorHelper.getQnaQuestionsAsUtterances(qnaObject, label, utterancesLabelsMap);
  }

  static async iterateInputFolder(
    folderPath: string, 
    utterancesLabelsMap: any, 
    hierarchical: boolean) {
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
      let currentItemPath = path.join(folderPath,item);
      let isDirectory = fs.lstatSync(currentItemPath).isDirectory();
      let ext = '';
      
      if (!isDirectory) {
        await OrchestratorHelper.processFile(currentItemPath, item, utterancesLabelsMap, hierarchical);
      }
      else {
        await OrchestratorHelper.iterateInputFolder(currentItemPath, utterancesLabelsMap, hierarchical);
      }
    };  
  }
  
  static getIntentsUtterances(luisObject:any, hierarchicalLabel: string, utterancesLabelsMap: any) {
    luisObject.utterances.forEach((e: any) => {
      let label:string = e.intent.trim();
      let utterance:string = e.text.trim();    
      let existingLabels = utterancesLabelsMap[utterance];
      if (existingLabels == null) {
        if (hierarchicalLabel != null && hierarchicalLabel.length > 0) {
          utterancesLabelsMap[utterance] = [label, hierarchicalLabel];
        }
        else {
          utterancesLabelsMap[utterance] = [label];
        }
      }
      else {
        existingLabels.push(label);
        utterancesLabelsMap[utterance] = existingLabels;
      }   
    });
  }

  static getQnaQuestionsAsUtterances(qnaObject: any, label: string, utterancesLabelsMap: any) {
    qnaObject.kb.QnaList.forEach((e: any) => {
      let questions = e.questions;
      questions.forEach((q: string) => {
        let utterance = q.trim();    
        let existingLabels = utterancesLabelsMap[utterance];
        if (existingLabels == null) {
          utterancesLabelsMap[utterance] = [label];
        }
        else {
          existingLabels.push(label);
          utterancesLabelsMap[utterance] = existingLabels;
        }
      });
    });
  }
}