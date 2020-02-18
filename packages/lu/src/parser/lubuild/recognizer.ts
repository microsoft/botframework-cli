/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Settings} from './settings'
import * as path from 'path'

export class Recognizer {
  static load(luFile: string, targetFileName: string, dialogPath: string, luisSettings: Settings, existingRecognizer: any): Recognizer {
    if (existingRecognizer) {
      let recognizer = new Recognizer(luFile, targetFileName)
      recognizer.dialogPath = dialogPath
      Object.assign(recognizer, existingRecognizer)
      recognizer.setAppId(luisSettings.luis[path.basename(luFile).split('.').join('_')])

      return recognizer
    }

    let recognizer = new Recognizer(luFile, targetFileName)
    recognizer.dialogPath = dialogPath

    return recognizer
  }

  versionId: string
  readonly applicationId: string | undefined
  readonly endpoint: string | undefined
  readonly endpointKey: string | undefined

  private appId: string
  private dialogPath: string | undefined

  constructor(private readonly luFile: string, targetFileName: string) {
    this.appId = ''
    this.applicationId = `=settings.luis.${targetFileName.split('.').join('_')}`
    this.endpoint = '=settings.luis.endpoint'
    this.endpointKey = '=settings.luis.endpointKey'
    this.versionId = '0.1'
  }

  save(): string {
    let output = {
      $type: 'Microsoft.LuisRecognizer',
      applicationId: this.applicationId,
      endpoint: this.endpoint,
      endpointKey: this.endpointKey
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
