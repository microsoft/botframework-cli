/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as fs from 'fs';
import * as path from 'path';
import {Utility} from './utility';
const Zip: any = require('7zip-min');
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
      Utility.debuggingLog(`OrchestratorNlr.getModelAsync(): nlrId=${nlrId}`);
      Utility.debuggingLog(`OrchestratorNlr.getModelAsync(): baseModelPath=${baseModelPath}`);

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
      const fileName: string = modelUrl.substring(modelUrl.lastIndexOf('/') + 1);
      const modelZipPath: string = path.join(baseModelPath, fileName);
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
      if (onProgress) {
        onProgress('OrchestratorNlr.getModelAsync(): extracting...');
      }
      Zip.unpack(modelZipPath, baseModelPath, (err: Error) => {
        if (err === null) {
          if (onProgress) {
            onProgress('OrchestratorNlr.getModelAsync(): cleaning up...');
          }

          Utility.debuggingLog(`OrchestratorNlr.getModelAsync(): finished extracting model file: ${modelUrl} and extracted to ${baseModelPath}`);
          fs.unlinkSync(modelZipPath);
          Utility.debuggingLog(`OrchestratorNlr.getModelAsync(): cleaned up .7z file: ${modelZipPath}`);
          if (onFinish) {
            onFinish('OrchestratorNlr.getModelAsync(): rom OrchestratorNlr.getModelAsync() calling onFinish()');
          }
          Utility.debuggingLog('OrchestratorNlr.getModelAsync(): finished calling OrchestratorNlr.getModelAsync()');
        } else {
          Utility.debuggingLog('OrchestratorNlr.getModelAsync(): failed extracting base model.');
          if (onFinish) {
            onFinish('OrchestratorNlr.getModelAsync(): failed extracting base model.');
          }
          throw err;
        }
      });
      Utility.debuggingLog('OrchestratorNlr.getModelAsync(): finished calling fileStream.on()');
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
