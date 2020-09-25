/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Settings} from './settings'
import * as path from 'path'

export class Recognizer {
  versionId: string
  private readonly id: string
  private readonly applicationId: string | undefined
  private readonly version: string | undefined
  private readonly endpoint: string | undefined
  private readonly endpointKey: string | undefined
  private readonly $schema: string | undefined
  private appId: string
  private dialogPath: string | undefined

  constructor(private readonly luFile: string, targetFileName: string, dialogPath: string, schema?: string) {
    this.appId = ''
    this.id = `LUIS_${targetFileName.split('.')[0]}`
    this.applicationId = `=settings.luis.${targetFileName.split('.').join('_').replace(/-/g, '_')}.appId`
    this.endpoint = '=settings.luis.endpoint'
    this.endpointKey = '=settings.luis.endpointKey'
    this.version = `=settings.luis.${targetFileName.split('.').join('_').replace(/-/g, '_')}.version`
    this.versionId = "0.1"
    this.dialogPath = dialogPath
    this.$schema = schema
  }

  save(): string {
    let output: any = {
      $kind: 'Microsoft.LuisRecognizer',
      id: this.id,
      applicationId: this.applicationId,
      version: this.version,
      endpoint: this.endpoint,
      endpointKey: this.endpointKey
    }

    if (this.$schema) {
      output = {$schema: this.$schema, ...output}
    }

    return JSON.stringify(output, null, 4)
  }

  getAppId(): string {
    return this.appId
  }

  setAppId(appId: string) {
    this.appId = appId
  }

  getDialogPath(): string {
    return this.dialogPath as string
  }

  getLuPath() {
    return this.luFile
  }
}
