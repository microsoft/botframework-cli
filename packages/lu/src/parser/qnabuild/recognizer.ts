/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Settings} from './settings'
import * as path from 'path'

export class Recognizer {
  static load(qnaFile: string, targetFileName: string, dialogPath: string, qnaSettings: Settings, existingRecognizer: any): Recognizer {
    if (existingRecognizer) {
      let recognizer = new Recognizer(qnaFile, targetFileName)
      recognizer.dialogPath = dialogPath
      Object.assign(recognizer, existingRecognizer)
      recognizer.setKBId(qnaSettings.qnamaker[path.basename(qnaFile).split('.').join('_')])

      return recognizer
    }

    let recognizer = new Recognizer(qnaFile, targetFileName)
    recognizer.dialogPath = dialogPath

    return recognizer
  }

  readonly knowledgeBaseId: string | undefined
  readonly endpoint: string | undefined
  readonly endpointKey: string | undefined

  private kbId: string
  private dialogPath: string | undefined

  constructor(private readonly qnaFile: string, targetFileName: string) {
    this.kbId = ''
    this.knowledgeBaseId = `{settings.qna.${targetFileName.split('.').join('_')}}`
    this.endpoint = '{settings.qna.hostname}'
    this.endpointKey = '{settings.qna.endpointKey}'
  }

  save(): string {
    let output = {
      $type: 'Microsoft.QnAMakerRecognizer',
      knowledgeBaseId: this.knowledgeBaseId,
      endpoint: this.endpoint,
      endpointKey: this.endpointKey
    }

    return JSON.stringify(output, null, 4)
  }

  getKBId(): string {
    return this.kbId
  }

  setKBId(kbId: string) {
    this.kbId = kbId
  }

  getDialogPath(): string {
    return this.dialogPath as string
  }

  getQnaPath() {
    return this.qnaFile
  }
}
