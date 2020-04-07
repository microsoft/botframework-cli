/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Recognizer} from './recognizer'
import {MultiLanguageRecognizer} from './multi-language-recognizer'
import {Settings} from './settings'
import {isEqual, differenceWith} from 'lodash'
import * as path from 'path'
const Content = require('./../lu/qna')
const LUOptions = require('./../lu/luOptions')
const {ServiceBase} = require('./../utils/serviceBase')
const NEWLINE = require('os').EOL;

export class QnaBuildCore {
  private readonly service: any

  constructor(subscriptionkey: string, endpoint: string) {
    this.service = new ServiceBase(endpoint, subscriptionkey)
  }

  public async getKBList() {
    const response = await this.service.createRequest('/knowledgebases', 'GET')
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  public async getKB(kbId: string) {
    const response = await this.service.createRequest(`/knowledgebases/${kbId}`, 'GET')
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  public async importKB(kbPayload: any) {
    const response = await this.service.createRequest('/knowledgebases/createasync', 'POST', kbPayload)
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  public async getOperationStatus(operationId: string) {
    const response = await this.service.createRequest(`/operations/${operationId}`, 'GET')
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  public async exportKB(kbId: string, environment: string) {
    const response = await this.service.createRequest(`/knowledgebases/${kbId}/${environment}/qna`, 'GET')
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  public async updateKB(kbId: string, replaceKb: any) {
    const response = await this.service.createRequest(`/knowledgebases/${kbId}`, 'PATCH', replaceKb)
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  public async replaceKB(kbId: string, replaceKb: any) {
    const response = await this.service.createRequest(`/knowledgebases/${kbId}`, 'PUT', replaceKb)
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  public async publishKB(kbId: string) {
    const response = await this.service.createRequest(`/knowledgebases/${kbId}`, 'POST')
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  public async replaceAlt(altJson: any) {
    const response = await this.service.createRequest('/alterations', 'PUT', altJson)
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  public generateDeclarativeAssets(recognizers: Array<Recognizer>, multiRecognizers: Array<MultiLanguageRecognizer>, settings: Array<Settings>)
    : Array<any> {
    let contents = new Array<any>()
    for (const recognizer of recognizers) {
      let content = new Content(recognizer.save(), new LUOptions(path.basename(recognizer.getDialogPath()), true, '', recognizer.getDialogPath()))
      contents.push(content)
    }

    for (const multiRecognizer of multiRecognizers) {
      const multiLangContent = new Content(multiRecognizer.save(), new LUOptions(path.basename(multiRecognizer.getDialogPath()), true, '', multiRecognizer.getDialogPath()))
      contents.push(multiLangContent)
    }

    for (const setting of settings) {
      const settingsContent = new Content(setting.save(), new LUOptions(path.basename(setting.getSettingsPath()), true, '', setting.getSettingsPath()))
      contents.push(settingsContent)
    }

    return contents
  }

  public isKBEqual(kbA: any, kbB: any): boolean {
    const qnaListA = kbA.qnaList
    const qnaListSourcesA = qnaListA.map((qna: any) => qna.source)
    
    const qnaDocumentsB = kbB.qnaDocuments || []
    const qnaListBToCompare = qnaDocumentsB.filter((qnaDoc: any) => qnaListSourcesA.includes(qnaDoc.source)).map((qna: any) => {
      return {
        id: qna.id,
        answer: qna.answer,
        source: qna.source,
        questions: qna.questions,
        metadata: qna.metadata,
        context: qna.context
      }
    })

    const qnaListAToCompare = qnaListA.map((qna: any) => {
      return {
        id: qna.id,
        answer: qna.answer,
        source: qna.source,
        questions: qna.questions,
        metadata: qna.metadata,
        context: qna.context
      }
    })

    let equal = this.isQnaListEqual(qnaListAToCompare, qnaListBToCompare)

    if (equal) {
      const qnaUrlsA = kbA.urls || []
      const qnaFilesA = kbA.files || []
      const urlsAndFileNamesResA = new Set(qnaUrlsA.concat(qnaFilesA.map((qnaFile: any) => qnaFile.fileName)))
      const otherResourcesB = new Set(qnaDocumentsB.filter((qnaDoc: any) => !qnaListSourcesA.includes(qnaDoc.source)).map((qna: any) => qna.source))

      equal = this.isArrayEqual([...urlsAndFileNamesResA], [...otherResourcesB])
    }

    return equal
  }

  private isQnaListEqual(qnaListA: any, qnaListB: any) {
    let kbAQnA = this.parseToQnAContent(qnaListA).toLowerCase()
    let kbBQnA = this.parseToQnAContent(qnaListB).toLowerCase()
    
    return kbAQnA === kbBQnA
  }

  private parseToQnAContent(qnaList: any) {
    let fileContent = ''
    qnaList.forEach((qnaItem: any) => {
      fileContent += `<a id = "0"></a>` + NEWLINE + NEWLINE
      fileContent += '> !# @qna.pair.source = ' + qnaItem.source + NEWLINE + NEWLINE
      fileContent += '## ? ' + qnaItem.questions[0] + NEWLINE
      qnaItem.questions.splice(0, 1)
      qnaItem.questions.forEach((question: any) => {
        fileContent += '- ' + question + NEWLINE
      })
      fileContent += NEWLINE;
      if (qnaItem.metadata && qnaItem.metadata.length > 0) {
        fileContent += '**Filters:**' + NEWLINE
        qnaItem.metadata.forEach((filter: any) => {
          fileContent += '- ' + filter.name + ' = ' + filter.value + NEWLINE
        })
        fileContent += NEWLINE
      }
      fileContent += '```markdown' + NEWLINE
      fileContent += qnaItem.answer + NEWLINE
      fileContent += '```' + NEWLINE
      if (qnaItem.context && qnaItem.context.prompts && qnaItem.context.prompts.length !== 0) {
        fileContent += NEWLINE + '**Prompts:**' + NEWLINE
        qnaItem.context.prompts.forEach((prompt: any) => {
          fileContent += `- [${prompt.displayText}]`
          // See if the linked prompt is context only and if so, add the decoration.
          let promptQnA = qnaList.find((item: any) => item.id == prompt.qnaId)
          if (promptQnA) {
            fileContent += promptQnA.context.isContextOnly === true ? ` \`context-only\`` : ''
          }
          fileContent += NEWLINE
        })
      }
      fileContent += NEWLINE
    })

    return fileContent
  }

  // compare arrays
  private isArrayEqual(x: any, y: any) {
    if (x.length !== y.length) return false
    if (differenceWith(x, y, isEqual).length > 0) return false

    return true
  }
}
