/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class MultiLanguageRecognizer {
  public recognizers: any
  private readonly dialogPath: string
  private readonly $schema: string | undefined

  constructor(dialogPath: string, recognizers: any, schema?: string) {
    this.dialogPath = dialogPath
    this.recognizers = recognizers
    this.$schema = schema
  }

  save(): string {
    let output: any = {
      $kind: 'Microsoft.MultiLanguageRecognizer',
      recognizers: this.recognizers
    }

    if (this.$schema) {
      output = {$schema: this.$schema, ...output}
    }

    return JSON.stringify(output, null, 4)
  }

  getDialogPath(): string {
    return this.dialogPath
  }
}
