/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import {LuisQnaHelper} from './luisqnahelper';
import {Utility} from './utility';
import {OrchestratorHelper} from './orchestratorhelper';
import {OrchestratorSettings, OrchestratorDataSource, OrchestratorDataSourceSettings} from './settings';

export class DataSourceHelper {
  public static convertDispatchInputs(dispatchJson: any, dataSourceSettings: OrchestratorDataSourceSettings)  {
    if (!dispatchJson || !dispatchJson.services || dispatchJson.services.length === 0) {
      throw new Error(`Failed parsing ${dispatchJson}`);
    }

    dataSourceSettings.inputs = [];
    Utility.emptyFolder(dataSourceSettings.path);

    for (const service of dispatchJson.services) {
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
        throw new Error(`Failed parsing ${dispatchJson}, unsupported type ${service.type}`);
      }

      if (!dataSourceSettings.hasDataSource(dataSource, true)) {
        dataSourceSettings.inputs.push(dataSource);
      }
    }
  }

  public static isDispatchInput(input: string): boolean {
    if (OrchestratorHelper.isDirectory(input)) {
      return false;
    }
    return path.extname(input) === '.dispatch';
  }

  public static async getQnAFileFromQnaKb(input: OrchestratorDataSource, endpoint: string = ''): Promise<any> {
    const qna: any = await LuisQnaHelper.getQnaFromKb(input.Id, input.Key, endpoint);
    return qna;
  }

  public static async getLuFileFromLuisApp(input: OrchestratorDataSource): Promise<string> {
    const lu: string  = await LuisQnaHelper.getLuFromLuisApp(input.Endpoint, input.Id, input.Key, input.Version);
    return lu;
  }

  public static async ensureDataSourceAsync(input: OrchestratorDataSource, dataSourcePath: string, updateSettings: boolean = true): Promise<void> {
    let content: string = '';
    switch (input.Type) {
    case 'luis':
      if (Utility.isEmptyString(input.Endpoint)) {
        throw new Error('LUIS endpoint required, ie --endpoint https://westus.api.cognitive.microsoft.com');
      }
      content = await DataSourceHelper.getLuFileFromLuisApp(input);
      if (content.length === 0) {
        throw new Error(`LUIS app id ${input.Id} - subscriptionKey ${input.Key} not found`);
      }
      break;
    case 'qna':
      content = await DataSourceHelper.getQnAFileFromQnaKb(input);
      if (content.length === 0) {
        throw new Error(`Qna kb id ${input.Id} - subscriptionKey ${input.Key} not found`);
      }
      break;
    case 'file':
      if (Utility.isEmptyString(input.RoutingName)) {
        throw new Error('routingName parameter is required');
      }
      DataSourceHelper.ensureFileInDataSourceFolder(input, dataSourcePath);
      break;
    default:
      throw new Error('Invalid input type');
    }

    const currentSettings: OrchestratorSettings = OrchestratorSettings.getCurrent();
    if (updateSettings && !currentSettings.hasDataSource(input)) {
      currentSettings.addUpdateDataSource(input);
    }

    if (content.length > 0) {
      let filePath: string = dataSourcePath;
      if (!OrchestratorHelper.isDirectory(filePath)) {
        filePath = path.dirname(filePath);
      }

      if (!filePath.toLowerCase().endsWith('datasources')) {
        filePath = path.join(filePath, 'dataSources');
        fs.mkdirSync(filePath, {recursive: true});
      }

      if (input.Type === 'luis') {
        if (Utility.isEmptyString(input.RoutingName)) {
          input.RoutingName = LuisQnaHelper.getLuisAppNameFromLu(content);
        }
        input.FilePath = path.join(filePath, input.RoutingName + '.lu');
      } else if (input.Type === 'qna') {
        input.RoutingName = Utility.isEmptyString(input.RoutingName) ? `q_${input.Id}` : `${input.RoutingName}`;
        input.FilePath = path.join(filePath, input.RoutingName + '.qna');
      } else {
        throw new Error(`Invalid content for type ${input.Type}`);
      }

      fs.writeFileSync(input.FilePath, content);
    }
  }

  public static removeDataSource(dataSource: OrchestratorDataSource): boolean {
    const existingSource: OrchestratorDataSource = OrchestratorSettings.getCurrent().DataSources.remove(dataSource);
    if (existingSource && Utility.exists(existingSource.FilePath)) {
      Utility.deleteFile(existingSource.FilePath);
      return true;
    }
    return false;
  }

  private static ensureFileInDataSourceFolder(input: OrchestratorDataSource, dataSourceFolder: string) {
    if (!Utility.exists(input.FilePath)) {
      throw new Error(`Input file ${input.FilePath} not found`);
    }

    if (OrchestratorHelper.isDirectory(input.FilePath)) {
      throw new Error(`Invalid input file path ${input.FilePath}`);
    }

    const destFilePath: string = path.join(dataSourceFolder, path.basename(input.FilePath));
    if (!Utility.exists(destFilePath)) {
      fs.copyFileSync(input.FilePath, destFilePath);
      input.FilePath = destFilePath;
    }
  }
}
