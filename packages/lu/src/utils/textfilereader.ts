/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fs = require('fs-extra')
const error = require('./../parser/utils/exception')
const retCode = require('./../parser/utils/enums/CLI-errors')
const helpers = require('./../parser/utils/helpers')

export async function readTextFile(file: any): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fs.existsSync(file)) {
        return reject('ENOENT: no such file or directory, ' + file)
      }
      let fileBuffer = await fs.readFile(file)
      return resolve(helpers.fixBuffer(fileBuffer))
    } catch (err) {
      if (err.message.match(/ENOENT: no such file or directory/)) {
        return reject(new error(retCode.errorCode.INVALID_INPUT_FILE, err.message))
      }

      return reject(`Invalid Input. Sorry, unable to parse file: ${err}`)
    }
  })
}
