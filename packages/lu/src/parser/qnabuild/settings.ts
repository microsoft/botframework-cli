/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class Settings {
  public qnamaker: any
  private readonly settingsPath: string

  constructor(settingsPath: string, qnamaker: any) {
    this.settingsPath = settingsPath
    this.qnamaker = qnamaker
  }

  save(): string {
    let output = {
      qnamaker: this.qnamaker
    }

    return JSON.stringify(output, null, 4)
  }

  getSettingsPath(): string {
    return this.settingsPath
  }
}
