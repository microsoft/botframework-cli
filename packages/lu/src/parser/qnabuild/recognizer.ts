/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Settings} from './settings'
import * as path from 'path'

export class Recognizer {
  static load(qnaFile: string, targetFileName: string, dialogPath: string, qnaSettings: Settings, existingRecognizer: any, schema?: string): Recognizer {
    if (existingRecognizer) {
      let recognizer = new Recognizer(qnaFile, targetFileName, schema)
      recognizer.dialogPath = dialogPath
      Object.assign(recognizer, existingRecognizer)
      recognizer.setKBId(qnaSettings.qna[path.basename(qnaFile).split('.').join('_')])

      return recognizer
    }

    let recognizer = new Recognizer(qnaFile, targetFileName, schema)
    recognizer.dialogPath = dialogPath

    return recognizer
  }

  private readonly id: string
  private readonly knowledgeBaseId: string | undefined
  private readonly hostname: string | undefined
  private readonly endpointKey: string | undefined
  private readonly $schema: string | undefined
  private kbId: string
  private dialogPath: string | undefined

  constructor(private readonly qnaFile: string, targetFileName: string, schema?: string) {
    this.kbId = ''
    this.id = `QnA_${targetFileName.split('.')[0]}`
    this.knowledgeBaseId = `=settings.qna.${targetFileName.split('.').join('_').replace(/-/g, '_')}`
    this.hostname = '=settings.qna.hostname'
    this.endpointKey = '=settings.qna.endpointKey'
    this.$schema = schema
  }

  save(): string {
    let output: any = {
      $kind: 'Microsoft.QnAMakerRecognizer',
      id: this.id,
      knowledgeBaseId: this.knowledgeBaseId,
      hostname: this.hostname,
      endpointKey: this.endpointKey
    }

    if (this.$schema) {
      output = {$schema: this.$schema, ...output}
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
