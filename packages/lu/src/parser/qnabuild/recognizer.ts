/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class Recognizer {
  private readonly id: string
  private readonly knowledgeBaseId: string | undefined
  private readonly hostname: string | undefined
  private readonly endpointKey: string | undefined
  private readonly $schema: string | undefined
  private kbId: string
  private dialogPath: string | undefined

  constructor(private readonly qnaFile: string, targetFileName: string, dialogPath: string, schema?: string) {
    this.kbId = ''
    this.id = `QnA_${targetFileName.split('.')[0]}`
    this.knowledgeBaseId = `=settings.qna.${targetFileName.split('.').join('_').replace(/-/g, '_')}`
    this.hostname = '=settings.qna.hostname'
    this.endpointKey = '=settings.qna.endpointKey'
    this.dialogPath = dialogPath
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
