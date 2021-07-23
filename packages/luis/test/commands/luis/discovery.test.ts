/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { expect, test } from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')

const compareLuFiles = async function (file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, '\n')
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, '\n')
  return result === fixtureFile
}

describe('luis:discovery tests', () => {
  test
    .stdout()
    .command(['luis:discovery', '--help'])
    .exit(1)
    .it('should print the help contents when --help is passed as an argument', (ctx: any) => {
      expect(ctx.stdout).to.contain('Discover all dialogs using Luis model as the recognizer.')
    })

  test
    .only()
    .stdout()
    .command(['luis:discovery', '--in', `${path.join(__dirname, './../../fixtures/testcases/discovery')}`, '-o', '.'])
    .it('luis:cross training only do inner dialog', async () => {
      expect(await compareLuFiles('./../../../luisModel.json', './../../fixtures/verified/discovery/luisModel.output')).to.be.true
    })
})
