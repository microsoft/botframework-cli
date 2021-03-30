/**
 * @module @microsoft/bf-lg-cli
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {test} from '@oclif/test'
import * as fs from 'fs-extra'
import * as path from 'path'
import {TestUtil} from './test-util'

const  testcaseFolderPath = './../../fixtures/testcase'
const  generatedFolderPath = './../../fixtures/generated'
const  verifiedFolderPath = './../../fixtures/verified'
const  generatedFolder = path.join(__dirname, generatedFolderPath)

describe('lg:analyze lg file', async () => {
  after(async function () {
    await fs.remove(generatedFolder)
  })

  before(async function () {
    await fs.remove(generatedFolder)
    await fs.mkdirp(generatedFolder)
  })

  // lg file
  test
  .command(['lg:analyze',
    '--in',
    path.join(__dirname, testcaseFolderPath, 'analyze/stop.lg'),
    '--out',
    generatedFolder,
    '-r',
    '-f'])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, 'analysisResult.txt'), path.join(verifiedFolderPath, 'analysisResult1.txt'))
  })

  // lg files folder
  test
  .command(['lg:analyze',
    '--in',
    path.join(__dirname, testcaseFolderPath, 'analyze'),
    '--out',
    generatedFolder,
    '-r',
    '-f'])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, 'analysisResult.txt'), path.join(verifiedFolderPath, 'analysisResult2.txt'))
  })
})
