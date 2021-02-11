/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fetch: any = require('node-fetch');
const LuisUrlPath: string = '/luis/authoring/v3.0-preview/apps';
const DefaultQnaMakerEndpoint: string = 'https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/';
const DefaultLuisVersion: any = '0.1';

export class LuisQnaHelper {
  public static async getLuFromLuisApp(endpoint: string, appId: string, subscriptionKey: string, versionId: string = DefaultLuisVersion): Promise<string> {
    // Sample URL: https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/export?format=lu
    if (versionId.length === 0) {
      versionId = DefaultLuisVersion;
    }
    if (endpoint.endsWith('/')) {
      endpoint = endpoint.slice(0, -1);
    }
    const url: string = `${endpoint}${LuisUrlPath}/${appId}/versions/${versionId}/export?format=lu`;
    const options: any = {
      headers: {'Ocp-Apim-Subscription-Key': subscriptionKey},
    };
    const response: any = await fetch(url, options);
    return response.text();
  }

  public static async getQnaFromKb(kbId: string, subscriptionKey: string, endpoint: string = DefaultQnaMakerEndpoint): Promise<string> {
    // Sample URL: https://west.api.cognitive.microsoft.com/qnamaker/v4.0/knowledgebases/{kbId}/test/qna?qnaformat=true
    if (endpoint === '') {
      endpoint = DefaultQnaMakerEndpoint;
    }
    if (endpoint.endsWith('/')) {
      endpoint = endpoint.slice(0, -1);
    }
    const url: string = `${endpoint}/knowledgebases/${kbId}/test/qna?qnaformat=true`;
    const options: any = {
      headers: {'Ocp-Apim-Subscription-Key': subscriptionKey},
    };
    const response: any = await fetch(url, options);
    return response.text();
  }

  public static getLuisAppNameFromLu(content: string): string {
    const LuisAppNameComment: any = '> !# @app.name = ';
    const idxStart: number = content.indexOf(LuisAppNameComment) + 17;
    return 'l_' + content.substring(idxStart, content.indexOf('>', idxStart)).trim();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getQnAKbNameFromQna(content: string): string {
    return 'q_kb';
  }
}
