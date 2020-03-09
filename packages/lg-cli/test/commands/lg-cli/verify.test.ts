/**
 * @module @microsoft/bf-cli-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {test} from '@oclif/test'
import {TestUtil} from './test-util'
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
    await fs.mkdir(generatedFolder)
  })

  const fileName = '3.error.lg'
  const outputFileName = '3.error.diagnostic.txt'

  test
  .command(['mslg:verify',
    '--in',
    path.join(__dirname, testcaseFolderPath, fileName),
    '--out',
    generatedFolder,
    '-r',
    '-f'])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, outputFileName), path.join(verifiedFolderPath, outputFileName))
  })
})
