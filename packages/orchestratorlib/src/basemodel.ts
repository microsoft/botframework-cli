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
  public static NlrVersionsSchema: string = '0.2';

  // eslint-disable-next-line max-params
  public static async getAsync(
    baseModelPath: string,
    basemodelId: string = '',
    onProgress: any = OrchestratorBaseModel.defaultHandler,
    onFinish: any = OrchestratorBaseModel.defaultHandler,
    modelType: string = 'intent',
    lang: string = 'en'): Promise<void> {
    try {
      if (baseModelPath) {
        baseModelPath = path.resolve(baseModelPath);
      }
      if (baseModelPath.length === 0) {
        throw new Error('ERROR: please provide path to Orchestrator model');
      }
      Utility.debuggingLog(`OrchestratorBaseModel.getAsync(): basemodelId=${basemodelId}`);
      Utility.debuggingLog(`OrchestratorBaseModel.getAsync(): baseModelPath=${baseModelPath}`);

      const versions: any = await OrchestratorBaseModel.getVersionsAsync();
      Utility.debuggingLog(`OrchestratorBaseModel.getAsync(): versions=${versions}`);
      onProgress('Downloading model...');
      if (!versions) {
        throw new Error('ERROR: failed getting basemodel configuration from https://aka.ms/nlrversions');
      }

      if (basemodelId === '') {
        basemodelId = OrchestratorBaseModel.getDefaultModelId(versions, modelType, lang);
      }

      if (basemodelId === '') {
        throw new Error('ERROR: no default model found');
      }

      const modelInfo: any = versions.models[basemodelId];
      if (!modelInfo) {
        throw new Error(`ERROR: Model info for model ${basemodelId} not found`);
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
    Utility.debuggingLog('OrchestratorBaseModel.getModelAsync(): entering');
    try {
      fs.mkdirSync(baseModelPath, {recursive: true});
      Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): finished calling  modelUrl=${modelUrl}`);
      // modelUrl = 'https://bcmodelsprod.azureedge.net/models/dte/onnx/pretrained.20200924.microsoft.dte.00.03.en.onnx.zip';
      const fileName: string = modelUrl.substring(modelUrl.lastIndexOf('/') + 1);
      const modelZipPath: string = path.join(baseModelPath, fileName);
      Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): finished calling  fileName=${fileName}`);
      Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): finished calling  modelZipPath=${modelZipPath}`);
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
        await new Promise((resolve: any) => {
          fs.createReadStream(modelZipPath).pipe(
            // eslint-disable-next-line new-cap
            unzip.Extract({path: baseModelPath})).on(
            'close', async () => {
              Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): on('close') entering : ${modelZipPath}`);
              if (onFinish) {
                Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): on('close') entering onFinish() : ${modelZipPath}`);
                await onFinish('OrchestratorBaseModel.getModelAsync(): on(\'close\') calling onFinish()');
              }
              Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): on('close') extracting zip file from ${modelZipPath} to ${baseModelPath}`);
              fs.unlinkSync(modelZipPath);
              Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): on('close') cleaned up the zip file: ${modelZipPath}`);
              Utility.debuggingLog('OrchestratorBaseModel.getModelAsync(): on(\'close\') finished');
              resolve();
            });
        });
        Utility.debuggingLog('OrchestratorBaseModel.getModelAsync(): leaving');
      } catch (error) {
        Utility.debuggingThrow(`FAILED to unzip ${modelZipPath}, modelUrl=${modelUrl}, baseModelPath=${baseModelPath}, error=${error}`);
      }
    } catch (error) {
      throw error;
    }
  }

  public static async getVersionsAsync(schemaVersion: string = OrchestratorBaseModel.NlrVersionsSchema): Promise<object> {
    const response: any = await fetch(`https://aka.ms/nlrversions_${schemaVersion}`);
    return response.json();
  }

  public static async listAsync(all: boolean = false): Promise<object> {
    const nlrVersions: any = await OrchestratorBaseModel.getVersionsAsync();
    if (all) {
      return nlrVersions.models;
    }

    const defaultModels: any = {};
    // eslint-disable-next-line guard-for-in
    for (const key in nlrVersions.defaults) {
      const value: string = nlrVersions.defaults[key];
      defaultModels[value] = nlrVersions.models[value];
    }
    return defaultModels;
  }

  public static defaultHandler(status: string): void {
    Utility.debuggingLog(status);
  }

  public static async defaultHandlerAsync(status: string): Promise<void> {
    Utility.debuggingLog(status);
  }

  public static getDefaultModelId(nlrVersions: any, modelType: string = 'intent', lang: string = 'en'): string {
    let defaultVersion: any = '';
    try {
      const defaultVersions: any = nlrVersions.defaults;
      const requestedVersion: string = `${lang}_${modelType}`;
      // eslint-disable-next-line no-prototype-builtins
      if (defaultVersions && defaultVersions.hasOwnProperty(requestedVersion)) {
        return defaultVersions[requestedVersion];
      }
    } catch {
    }

    defaultVersion = '';
    const models: any = nlrVersions.models;
    for (const modelVersion in models) {
      if (modelType === 'entity' && modelVersion.indexOf('example_ner') > 0 && modelVersion.indexOf(lang) > 0) {
        defaultVersion =  modelVersion;
        break;
      } else if (modelType === 'entity' && modelVersion.indexOf('example_ner') === 0 && modelVersion.indexOf(lang) > 0) {
        defaultVersion = modelVersion;
        break;
      } else {
        defaultVersion = modelVersion;
      }
    }

    return defaultVersion;
  }
}
