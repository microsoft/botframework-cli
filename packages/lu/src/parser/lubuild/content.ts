/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const Lu = require('./../lu/lu')

export class Content extends Lu {
  public path: string
  public name: string

  constructor(id: string, path: string, content: string, locale?: string) {
    super(content, id, true, locale)
    this.path = path
    if (this.language) {
      if (this.language !== '') {
        this.name = id + '.' + this.language + '.lu'
      } else {
        this.name = id + '.lu'
      }
    } else {
      this.name = this.id
    }
  }
}
