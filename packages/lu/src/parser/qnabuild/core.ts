/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Recognizer} from './recognizer'
import {MultiLanguageRecognizer} from './multi-language-recognizer'
import {Settings} from './settings'
import * as path from 'path'
const Content = require('./../lu/qna')
const LUOptions = require('./../lu/luOptions')
const {ServiceBase} = require('./serviceBase')
const NEWLINE = require('os').EOL

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

  public async getEndpointKeys() {
    const response = await this.service.createRequest('/endpointkeys', 'GET')
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  public generateDeclarativeAssets(recognizers: Array<Recognizer>, multiRecognizer: MultiLanguageRecognizer, settings: Settings)
    : Array<any> {
    let contents = new Array<any>()
    for (const recognizer of recognizers) {
      let content = new Content(recognizer.save(), new LUOptions(path.basename(recognizer.getDialogPath()), true, '', recognizer.getDialogPath()))
      contents.push(content)
    }

    if (multiRecognizer) {
      const multiLangContent = new Content(multiRecognizer.save(), new LUOptions(path.basename(multiRecognizer.getDialogPath()), true, '', multiRecognizer.getDialogPath()))
      contents.push(multiLangContent)
    }

    if (settings) {
      const settingsContent = new Content(settings.save(), new LUOptions(path.basename(settings.getSettingsPath()), true, '', settings.getSettingsPath()))
      contents.push(settingsContent)
    }

    return contents
  }

  public isKBEqual(kbA: any, kbB: any): boolean {
    const qnaListA = kbA.qnaList
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

    const qnaDocumentsB = kbB.qnaDocuments || []
    const qnaListBToCompare = qnaDocumentsB.map((qna: any) => {
      return {
        id: qna.id,
        answer: qna.answer,
        source: qna.source,
        questions: qna.questions,
        metadata: qna.metadata,
        context: qna.context
      }
    })

    const equal = this.isQnaListEqual(qnaListAToCompare, qnaListBToCompare)

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
      fileContent += '<a id = "0"></a>' + NEWLINE + NEWLINE
      fileContent += '> !# @qna.pair.source = ' + qnaItem.source + NEWLINE + NEWLINE
      fileContent += '## ? ' + qnaItem.questions[0] + NEWLINE
      qnaItem.questions.splice(0, 1)
      qnaItem.questions.forEach((question: any) => {
        fileContent += '- ' + question + NEWLINE
      })
      fileContent += NEWLINE
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
          let promptQnA = qnaList.find((item: any) => item.id === prompt.qnaId)
          if (promptQnA) {
            fileContent += promptQnA.context.isContextOnly === true ? ' \`context-only\`' : ''
          }
          fileContent += NEWLINE
        })
      }
      fileContent += NEWLINE
    })

    return fileContent
  }
}
