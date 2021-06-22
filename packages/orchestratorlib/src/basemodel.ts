/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import {Utility} from './utility';
import {httpsProxy} from './utility';
const unzip: any = require('unzip-stream');
import axios, {AxiosResponse} from 'axios';
import {Stream} from 'stream';
axios.interceptors.request.use(httpsProxy);

import {Utility as UtilityDispatcher} from '@microsoft/bf-dispatcher';

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

      if (basemodelId === '') {
        basemodelId = await OrchestratorBaseModel.getDefaultModelId(null, modelType, lang);
      }

      if (basemodelId === '') {
        throw new Error('ERROR: no model version id specified');
      }

      onProgress('Downloading model...');
      const modelUrl: string = 'https://aka.ms/' + basemodelId;
      await OrchestratorBaseModel.getModelAsync(baseModelPath, modelUrl, onProgress, onFinish);
    } catch (error) {
      UtilityDispatcher.debuggingThrowWithCause(
        `FAILED to get model ${baseModelPath}, basemodelId=${basemodelId}, modelType=${modelType}, lang=${lang}`,
        error);
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
      const fileName: string = modelUrl.substring(modelUrl.lastIndexOf('/') + 1);
      const modelZipPath: string = path.join(baseModelPath, fileName);
      Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): finished calling  fileName=${fileName}`);
      Utility.debuggingLog(`OrchestratorBaseModel.getModelAsync(): finished calling  modelZipPath=${modelZipPath}`);
      await this.downloadModel(modelUrl, modelZipPath);
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
        UtilityDispatcher.debuggingThrowWithCause(
          `FAILED to unzip ${modelZipPath}, modelUrl=${modelUrl}, baseModelPath=${baseModelPath}`,
          error);
      }
    } catch (error) {
      UtilityDispatcher.debuggingThrowWithCause(
        `FAILED to get model, modelUrl=${modelUrl}, baseModelPath=${baseModelPath}`,
        error);
    }
  }

  public static async getVersionsAsync(schemaVersion: string = OrchestratorBaseModel.NlrVersionsSchema): Promise<object> {
    const response: any = await axios.get(`https://aka.ms/nlrversions_${schemaVersion}`);
    return response.data;
  }

  public static async downloadModel(modelUrl: string, modelZipPath: string): Promise<(resolve: any) => void> {
    const response: AxiosResponse<Stream> = await axios({
      method: 'GET',
      url: modelUrl,
      responseType: 'stream',
    });
    Utility.debuggingLog('OrchestratorBaseModel.getModelAsync(): calling download zipped model files');
    response.data.pipe(fs.createWriteStream(modelZipPath));

    return new Promise((resolve: any) => {
      response.data.on('end', () => {
        resolve();
      });
    });
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

  public static async getDefaultModelId(nlrVersions: any = null, modelType: string = 'intent', lang: string = 'en'): Promise<string> {
    let defaultVersion: any = '';
    try {
      if (nlrVersions === null) {
        nlrVersions = await OrchestratorBaseModel.getVersionsAsync();
      }

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
      if (OrchestratorBaseModel.isEntityModelVersion(modelType, modelVersion) && modelVersion.indexOf(lang) > 0) {
        defaultVersion =  modelVersion;
        break;
      } else if (OrchestratorBaseModel.isIntentModelVersion(modelType, modelVersion) && modelVersion.indexOf(lang) > 0) {
        defaultVersion = modelVersion;
        break;
      } else if (OrchestratorBaseModel.isEntityModelVersion(modelType, modelVersion) ||
          OrchestratorBaseModel.isIntentModelVersion(modelType, modelVersion)) {
        defaultVersion = modelVersion;
      }
    }

    return defaultVersion;
  }

  public static getModelLanguageFromVersionId(versionId: string): string {
    const idx1: number = versionId.lastIndexOf('.');
    const str: string = versionId.substr(0, idx1);
    const idx2: number = str.lastIndexOf('.');
    let lang: string = versionId.substring(idx2 + 1, idx1);
    const idxUnderscore: number = lang.indexOf('_');
    if (idxUnderscore > 0) {
      lang = lang.substr(idxUnderscore + 1);
    }
    return lang;
  }

  public static isEntityModelVersion(modelType: string, modelVersion: string): boolean {
    return modelType === 'entity' && modelVersion.indexOf('example_ner') > 0;
  }

  public static isIntentModelVersion(modelType: string, modelVersion: string): boolean {
    return modelType === 'intent' && modelVersion.indexOf('example_ner') === 0;
  }
}
