/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {test, expect} from '@oclif/test'
import * as fs from 'fs-extra'
import * as path from 'path'

const  testcaseFolderPath = './../../fixtures/testcase'
const  generatedFolderPath = './../../fixtures/generated'
const  verifiedFolderPath = './../../fixtures/verified'
const  generatedFolder = path.join(__dirname, generatedFolderPath)

describe('mslg:verify lg file', async () => {
  after(async function () {
    await fs.remove(generatedFolder)
  })

  before(async function () {
    await fs.remove(generatedFolder)
    await fs.mkdirp(generatedFolder)
  })

  // simple lg
  test
  .command(['mslg:verify',
    '--in',
    path.join(__dirname, testcaseFolderPath, '1.lg'),
    '--out',
    generatedFolder,
    '-r',
    '-f'])
  .it('', async () => {
    const result =  await fs.pathExists(path.join(generatedFolderPath, '1.diagnostic.txt'))
    expect(result).to.deep.equal(false)
  })

  // lg that has imports
  test
  .command(['mslg:verify',
    '--in',
    path.join(__dirname, testcaseFolderPath, '2.lg'),
    '--out',
    generatedFolder,
    '-r',
    '-f'])
  .it('', async () => {
    const result =  await fs.pathExists(path.join(generatedFolderPath, '2.diagnostic.txt'))
    expect(result).to.deep.equal(false)
  })

  // error lg file
  const errorFileName = '3.lg'

  test
  .command(['mslg:verify',
    '--in',
    path.join(__dirname, testcaseFolderPath, errorFileName),
    '-r',
    '-f'])
  .it('', async () => {
    // show diagnostics in terminal
  })
})
