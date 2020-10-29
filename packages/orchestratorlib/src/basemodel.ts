/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import {Utility} from './utility';
const unzip: any = require('unzip-stream');
const fetch: any = require('node-fetch');

export class OrchestratorBaseModel {
  public static async getAsync(
    baseModelPath: string,
    nlrId: string = '',
    onProgress: any = OrchestratorBaseModel.defaultHandler,
    onFinish: any = OrchestratorBaseModel.defaultHandler): Promise<void> {
    try {
      if (baseModelPath) {
        baseModelPath = path.resolve(baseModelPath);
      }
      if (baseModelPath.length === 0) {
        throw new Error('ERROR: please provide path to Orchestrator model');
      }
      Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): nlrId=${nlrId}`);
      Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): baseModelPath=${baseModelPath}`);

      const versions: any = await OrchestratorBaseModel.getVersionsAsync();
      onProgress('Downloading model...');
      if (!versions) {
        throw new Error('ERROR: failed getting nlr_versions.json');
      }

      if (nlrId === '') {
        nlrId = OrchestratorBaseModel.getDefaultModelId(versions);
      }

      if (nlrId === '') {
        throw new Error('ERROR: no default model found');
      }

      const modelInfo: any = versions.models[nlrId];
      if (!modelInfo) {
        throw new Error(`ERROR: Model info for model ${nlrId} not found`);
      }

      const modelUrl: string = modelInfo.modelUri;
      await OrchestratorBaseModel.getModelAsync(baseModelPath, modelUrl, onProgress, onFinish);
    } catch (error) {
      throw error;
    }
  }

  public static async getModelAsync(
    baseModelPath: string,
    modelUrl: string,
    onProgress: any = OrchestratorBaseModel.defaultHandler,
    onFinish: any = OrchestratorBaseModel.defaultHandler): Promise<void> {
    try {
      fs.mkdirSync(baseModelPath, {recursive: true});
      if (modelUrl.endsWith('7z')) {
        modelUrl = modelUrl.substr(0, modelUrl.length - 2) + 'zip';
      }
      // modelUrl = 'https://bcmodelsprod.azureedge.net/models/dte/onnx/pretrained.20200924.microsoft.dte.00.03.en.onnx.zip';
      const fileName: string = modelUrl.substring(modelUrl.lastIndexOf('/') + 1);
      const modelZipPath: string = path.join(baseModelPath, fileName);
      const response: any = await fetch(modelUrl);
      Utility.debuggingLog('OrchestratorBaseModel.getModelAsync(): calling  await response.arrayBuffer()');
      const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
      const uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
      Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): finished calling  await response.arrayBuffer(), arrayBuffer.byteLength=${arrayBuffer.byteLength}`);
      Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): finished calling  await response.arrayBuffer(), uint8Array.byteLength=${uint8Array.byteLength}`);
      fs.writeFileSync(modelZipPath, uint8Array);
      if (onProgress) {
        onProgress('OrchestratorBaseModel.getModelAsync(): model downloaded...');
      }
      Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): finished downloading model file: ${modelUrl} to ${modelZipPath}`);
      try {
        // eslint-disable-next-line new-cap
        fs.createReadStream(modelZipPath).pipe(unzip.Extract({path: baseModelPath})).on(
          'close', async () => {
            Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): entering on('close') : ${modelZipPath}`);
            if (onFinish) {
              Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): entering onFinish() : ${modelZipPath}`);
              await onFinish('OrchestratorBaseModel.getModelAsync(): calling onFinish()');
            }
            Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): on('close') extracting zip file from ${modelZipPath} to ${baseModelPath}`);
            fs.unlinkSync(modelZipPath);
            Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): cleaned up the zip file: ${modelZipPath}`);
            Utility.debuggingLog('OrchestratorBaseModel.getModelAsync(): finished');
          });
      } catch (error) {
        Utility.debuggingThrow(`FAILED to unzip ${modelZipPath}, modelUrl=${modelUrl}, baseModelPath=${baseModelPath}, error=${error}`);
      }
    } catch (error) {
      throw error;
    }
  }

  public static async getVersionsAsync(): Promise<object> {
    const response: any = await fetch('https://aka.ms/nlrversions');
    return response.json();
  }

  public static async listAsync(): Promise<string> {
    const json: any = await OrchestratorBaseModel.getVersionsAsync();
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
          OrchestratorBaseModel.deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(inputPath);
    }
  }

  public static getDefaultModelId(nlrVersions: any): string {
    let defaultVersion: string = nlrVersions.default;
    if (defaultVersion && defaultVersion.length > 0) {
      return defaultVersion;
    }

    defaultVersion = '';
    const models: any = nlrVersions.models;
    for (const modelVersion in models) {
      // eslint-disable-next-line no-prototype-builtins
      if (models.hasOwnProperty(modelVersion)) {
        if (defaultVersion === '') {
          defaultVersion = modelVersion;
          break;
        }
      }
    }

    return defaultVersion;
  }
}
