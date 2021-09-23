/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const path = require('path')

export function getLuisCultureFromPath(file: string): string | null {
    let fn = path.basename(file, path.extname(file))
    let lang = path.extname(fn).substring(1)
    switch (lang.toLowerCase()) {
      case 'en-us':
      case 'ar-ar':
      case 'zh-cn':
      case 'nl-nl':
      case 'fr-fr':
      case 'fr-ca':
      case 'de-de':
      case 'gu-in':
      case 'hi-in':
      case 'it-it':
      case 'ja-jp':
      case 'ko-kr':
      case 'mr-in':
      case 'pt-br':
      case 'es-es':
      case 'es-mx':
      case 'ta-in':
      case 'te-in':
      case 'tr-tr':
        return lang
      default:
        return null
    }
  }