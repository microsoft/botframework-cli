/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class Settings {
  public luis: any
  private readonly settingsPath: string

  constructor(settingsPath: string, luis: any) {
    this.settingsPath = settingsPath
    this.luis = luis
  }

  save(): string {
    let output = {
      luis: this.luis
    }

    return JSON.stringify(output, null, 4)
  }

  getSettingsPath(): string {
    return this.settingsPath
  }
}
