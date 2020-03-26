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
        id: 0,
        answer: qna.answer,
        source: qna.source,
        questions: qna.questions,
        metadata: qna.metadata
      }
    })

    const qnaListAToCompare = qnaListA.map((qna: any) => {
      return {
        id: 0,
        answer: qna.answer,
        source: qna.source,
        questions: qna.questions,
        metadata: qna.metadata
      }
    })

    let equal = this.isArrayEqual(qnaListAToCompare, qnaListBToCompare)

    if (equal) {
      const qnaUrlsA = kbA.urls || []
      const qnaFilesA = kbA.files || []
      const urlsAndFileNamesResA = new Set(qnaUrlsA.concat(qnaFilesA.map((qnaFile: any) => qnaFile.fileName)))
      const otherResourcesB = new Set(qnaDocumentsB.filter((qnaDoc: any) => !qnaListSourcesA.includes(qnaDoc.source)).map((qna: any) => qna.source))

      equal = this.isArrayEqual([...urlsAndFileNamesResA], [...otherResourcesB])
    }

    return equal
  }

  // compare object arrays
  private isArrayEqual(x: any, y: any) {
    let xObj = []
    let yObj = []

    if (x && x.length > 0) {
      xObj = JSON.parse(JSON.stringify(x).toLowerCase().replace(/ {2}/g, ' ').replace(/\\r\\n/g, '\\n'))
    }

    if (y && y.length > 0) {
      yObj = JSON.parse(JSON.stringify(y).toLowerCase().replace(/ {2}/g, ' ').replace(/\\r\\n/g, '\\n'))
    }

    if (xObj.length !== yObj.length) return false
    if (differenceWith(xObj, yObj, isEqual).length > 0) return false

    return true
  }
}
