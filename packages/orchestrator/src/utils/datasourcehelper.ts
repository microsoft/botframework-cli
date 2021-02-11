/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import {LuisQnaHelper, Utility, OrchestratorHelper} from '@microsoft/bf-orchestrator';
import {OrchestratorSettings, OrchestratorDataSource, OrchestratorDataSourceSettings} from './settings';

export class DataSourceHelper {
  public static convertDispatchInputs(dispatchFile: string, dataSourceSettings: OrchestratorDataSourceSettings)  {
    const dispatch: any = JSON.parse(OrchestratorHelper.readFile(dispatchFile));
    if (!dispatch || !dispatch.services || dispatch.services.length === 0) {
      throw new Error(`Failed parsing ${dispatchFile}`);
    }

    dataSourceSettings.inputs = [];
    Utility.emptyFolder(dataSourceSettings.path);

    for (const service of dispatch.services) {
      let dataSource: OrchestratorDataSource;
      let routingName: string;
      let endpoint: string = '';
      switch (service.type) {
      case 'luis':
        endpoint = `https://${service.region}.api.cognitive.microsoft.com`;
        routingName = service.intentName ? service.intentName : `l_${service.name}`;
        dataSource = new OrchestratorDataSource(
          service.appId,
          service.authoringKey,
          service.version,
          endpoint,
          service.type,
          routingName,
          dataSourceSettings.path);
        break;
      case 'qna':
        routingName = service.intentName ? service.intentName : `q_${service.name}`;
        dataSource = new OrchestratorDataSource(
          service.kbId,
          service.subscriptionKey,
          '',
          endpoint,
          service.type,
          routingName,
          dataSourceSettings.path);
        break;
      case 'file':
        routingName = service.intentName ? service.intentName : service.name;
        dataSource = new OrchestratorDataSource(
          '',
          '',
          '',
          '',
          service.type,
          routingName,
          service.path);
        break;
      default:
        throw new Error(`Failed parsing ${dispatchFile}, unsupported type ${service.type}`);
      }

      dataSourceSettings.inputs.push(dataSource);
    }
  }

  public static isDispatchInput(input: string): boolean {
    if (OrchestratorHelper.isDirectory(input)) {
      return false;
    }
    return path.extname(input) === '.dispatch';
  }

  public static async getQnAFileFromQnaKb(input: OrchestratorDataSource, endpoint: string = ''): Promise<any> {
    const qna: any = await LuisQnaHelper.getQnaFromKb(input.id, input.key, endpoint);
    return qna;
  }

  public static async getLuFileFromLuisApp(input: OrchestratorDataSource): Promise<string> {
    const lu: string  = await LuisQnaHelper.getLuFromLuisApp(input.endpoint, input.id, input.key, input.version);
    return lu;
  }

  public static async ensureDataSourceAsync(input: OrchestratorDataSource, dataSourcePath: string, updateSettings: boolean = true): Promise<void> {
    let content: string = '';
    switch (input.type) {
    case 'luis':
      content = await DataSourceHelper.getLuFileFromLuisApp(input);
      if (content.length === 0) {
        throw new Error(`LUIS app id ${input.id} - subscriptionKey ${input.key} not found`);
      }
      break;
    case 'qna':
      content = await DataSourceHelper.getQnAFileFromQnaKb(input);
      if (content.length === 0) {
        throw new Error(`Qna kb id ${input.id} - subscriptionKey ${input.key} not found`);
      }
      break;
    case 'file':
      DataSourceHelper.ensureFileInDataSourceFolder(input, dataSourcePath);
      break;
    default:
      throw new Error('Invalid input type');
    }

    if (updateSettings && !OrchestratorSettings.hasDataSource(input)) {
      OrchestratorSettings.addUpdateDataSource(input);
    }

    if (content.length > 0) {
      let filePath: string = input.filePath;
      if (!OrchestratorHelper.isDirectory(filePath)) {
        filePath = path.dirname(filePath);
      }

      if (!filePath.endsWith('datasources')) {
        filePath = path.join(filePath, 'datasources');
      }

      if (input.type === 'luis') {
        if (Utility.isEmptyString(input.routingName)) {
          input.routingName = LuisQnaHelper.getLuisAppNameFromLu(content);
        }
        input.filePath = path.join(filePath, input.routingName + '.lu');
      } else if (input.type === 'qna') {
        if (Utility.isEmptyString(input.routingName)) {
          input.routingName = `q_${input.id}`;
        }
        input.filePath = path.join(filePath, input.routingName + '.qna');
      } else {
        throw new Error(`Invalid content for type ${input.type}`);
      }

      fs.writeFileSync(input.filePath, content);
    }
  }

  private static ensureFileInDataSourceFolder(input: OrchestratorDataSource, dataSourceFolder: string) {
    if (!Utility.exists(input.filePath)) {
      throw new Error(`Input file ${input.filePath} not found`);
    }

    if (OrchestratorHelper.isDirectory(input.filePath)) {
      throw new Error(`Invalid input file path ${input.filePath}`);
    }

    const destFilePath: string = path.join(dataSourceFolder, path.basename(input.filePath));
    if (!Utility.exists(destFilePath)) {
      fs.copyFileSync(input.filePath, destFilePath);
    }
  }
}
