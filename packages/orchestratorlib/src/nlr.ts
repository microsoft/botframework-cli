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
  public static async getAsync(
    nlrPath: string,
    nlrId: string = '',
    onProgress: any = OrchestratorNlr.defaultHandler,
    onFinish: any = OrchestratorNlr.defaultHandler): Promise<void> {
    try {
      if (nlrPath) {
        nlrPath = path.resolve(nlrPath);
      }
      if (nlrPath.length === 0) {
        throw new Error('ERROR: please provide path to Orchestrator model');
      }
      Utility.debuggingLog(`OrchestratorNlr.getModelAsync(): nlrId=${nlrId}`);
      Utility.debuggingLog(`OrchestratorNlr.getModelAsync(): nlrPath=${nlrPath}`);

      const versions: any = await OrchestratorNlr.getNlrVersionsAsync();
      onProgress('Downloading model...');
      if (!versions) {
        throw new Error('ERROR: failed getting nlr_versions.json');
      }

      if (nlrId === '') {
        nlrId = OrchestratorNlr.getDefaultModelId(versions.models);
      }

      if (nlrId === '') {
        throw new Error('ERROR: no default model found');
      }

      const modelInfo: any = versions.models[nlrId];
      if (!modelInfo) {
        throw new Error(`ERROR: Model info for model ${nlrId} not found`);
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
      fs.mkdirSync(nlrPath, {recursive: true});
      const fileName: string = modelUrl.substring(modelUrl.lastIndexOf('/') + 1);
      const modelZipPath: string = path.join(nlrPath, fileName);
      const response: any = await fetch(modelUrl);
      Utility.debuggingLog('OrchestratorNlr.getModelAsync(): calling  await response.arrayBuffer()');
      const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
      const uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
      fs.writeFileSync(modelZipPath, uint8Array);
      Utility.debuggingLog(`OrchestratorNlr.getModelAsync(): finished calling  await response.arrayBuffer(), arrayBuffer.byteLength=${arrayBuffer.byteLength}`);
      Utility.debuggingLog(`OrchestratorNlr.getModelAsync(): finished calling  await response.arrayBuffer(), uint8Array.byteLength=${uint8Array.byteLength}`);
      if (onProgress) {
        onProgress('OrchestratorNlr.getModelAsync(): model downloaded...');
      }
      Utility.debuggingLog(`OrchestratorNlr.getModelAsync(): finished downloading model file: ${modelUrl} to ${modelZipPath}`);
      const seven: any = new Zip();
      if (onProgress) {
        onProgress('OrchestratorNlr.getModelAsync(): extracting...');
      }
      await seven.extractFull(modelZipPath, nlrPath).then(() => {
        if (onProgress) {
          onProgress('OrchestratorNlr.getModelAsync(): cleaning up...');
        }
        Utility.debuggingLog(`OrchestratorNlr.getModelAsync(): finished extracting model file: ${modelUrl} and extracted to ${nlrPath}`);
        fs.unlinkSync(modelZipPath);
        Utility.debuggingLog(`OrchestratorNlr.getModelAsync(): cleaned up .7z file: ${modelZipPath}`);
        if (onFinish) {
          onFinish('OrchestratorNlr.getModelAsync(): rom OrchestratorNlr.getModelAsync() calling onFinish()');
        }
        Utility.debuggingLog('OrchestratorNlr.getModelAsync(): finished calling OrchestratorNlr.getModelAsync()');
      });
      Utility.debuggingLog('OrchestratorNlr.getModelAsync(): finished calling fileStream.on()');
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

  public static defaultHandler(status: string): void {
    Utility.debuggingLog(status);
  }

  public static async defaultHandlerAsync(status: string): Promise<void> {
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

  public static getDefaultModelId(models: any): string {
    let defaultVersion: any = '';
    for (const modelVersion in models) {
      // eslint-disable-next-line no-prototype-builtins
      if (models.hasOwnProperty(modelVersion)) {
        const model: any = models[modelVersion];
        if ('isDefault' in model && model.isDefault) {
          return modelVersion;
        }

        if (defaultVersion === '') {
          defaultVersion = modelVersion;
        }
      }
    }

    return defaultVersion;
  }
}
