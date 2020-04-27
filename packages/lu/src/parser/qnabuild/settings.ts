/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class Settings {
  public qna: any
  private readonly settingsPath: string

  constructor(settingsPath: string, qna: any) {
    this.settingsPath = settingsPath
    this.qna = qna
  }

  save(): string {
    let output = {
      qna: this.qna
    }

    return JSON.stringify(output, null, 4)
  }

  getSettingsPath(): string {
    return this.settingsPath
  }
}
