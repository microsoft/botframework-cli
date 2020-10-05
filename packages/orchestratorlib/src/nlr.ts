/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from 'fs';
import * as path from 'path';
import {Utility} from './utility';
const Zip: any = require('node-7z-forall');
const fetch: any = require('node-fetch');

export class OrchestratorNlr {
  public static async getAsync(nlrPath: string, nlrId: string, onProgress: any = OrchestratorNlr.defaultHandler, onFinish: any = OrchestratorNlr.defaultHandler) {
    try {
      if (nlrPath) {
        nlrPath = path.resolve(nlrPath);
      }

      if (nlrPath.length === 0) {
        throw new Error('Please provide path to Orchestrator model');
      }

      Utility.debuggingLog(`Version id: ${nlrId}`);
      Utility.debuggingLog(`Nlr path: ${nlrPath}`);

      const versions: any = await OrchestratorNlr.getNlrVersionsAsync();
      onProgress('Downloading model...');
      if (!versions) {
        throw new Error('Failed getting nlr_versions.json');
      }

      const modelInfo: any = versions.models[nlrId];
      if (!modelInfo) {
        throw new Error(`Model info for model ${nlrId} not found`);
      }

      const modelUrl: string = modelInfo.modelUri;
      await OrchestratorNlr.getModelAsync(nlrPath, modelUrl, onProgress, onFinish);
    } catch (error) {
      throw error;
    }
  }

  public static async getModelAsync(
    nlrPath: string,
    modelUrl: string,
    onProgress: any = OrchestratorNlr.defaultHandler,
    onFinish: any = OrchestratorNlr.defaultHandler): Promise<void> {
    try {
      const fileName: string = modelUrl.substring(modelUrl.lastIndexOf('/') + 1);
      const res: any = await fetch(modelUrl);
      fs.mkdirSync(nlrPath, {recursive: true});
      const modelZipPath: string = path.join(nlrPath, fileName);
      const fileStream: any = fs.createWriteStream(modelZipPath);
      res.body.pipe(fileStream);
      res.body.on('error', () => {
        throw new Error(`Failed downloading model file: ${modelUrl}`);
      });
      fileStream.on('finish', () => {
        if (onProgress) {
          onProgress('Model downloaded...');
        }
        Utility.debuggingLog(`Finished downloading model file: ${modelUrl} to ${modelZipPath}`);
        const seven: any = new Zip();
        if (onProgress) {
          onProgress('Extracting...');
        }
        seven.extractFull(modelZipPath, nlrPath).then(() => {
          if (onProgress) {
            onProgress('Cleaning up...');
          }
          Utility.debuggingLog(`Finished extracting model file: ${modelUrl} and extracted to ${nlrPath}`);
          fs.unlinkSync(modelZipPath);
          Utility.debuggingLog(`Cleaned up .7z file: ${modelZipPath}`);
          if (onFinish) {
            onFinish('From OrchestratorNlr.getModelAsync() calling onFinish()');
          }
          Utility.debuggingLog('Finished calling OrchestratorNlr.getModelAsync()');
        });
      });
    } catch (error) {
      throw error;
    }
  }

  public static async getNlrVersionsAsync(): Promise<string> {
    const response: any = await fetch('https://aka.ms/nlrversions');
    return response.json();
  }

  public static async listAsync(): Promise<string> {
    const json: any = await OrchestratorNlr.getNlrVersionsAsync();
    return JSON.stringify(json, null, 2);
  }

  public static defaultHandler(status: string) {
    Utility.debuggingLog(status);
  }

  private static deleteFolderRecursive(inputPath: string) {
    if (fs.existsSync(inputPath)) {
      fs.readdirSync(inputPath).forEach(function (file: string) {
        const curPath: string = path.join(inputPath, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          OrchestratorNlr.deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(inputPath);
    }
  }
}
