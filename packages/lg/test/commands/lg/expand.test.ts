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

describe('lg:expand lg template', async () => {
  after(async function () {
    await fs.remove(generatedFolder)
  })

  before(async function () {
    await fs.remove(generatedFolder)
    await fs.mkdirp(generatedFolder)
  })

  const inputFileName = '4.lg'
  const outputFileName = '4.expand.lg'

  // test expand all templates
  test
  .command(['lg:expand',
    '--in',
    path.join(__dirname, testcaseFolderPath, inputFileName),
    '--out',
    generatedFolder,
    '--all',
    '-r',
    '-f'])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, outputFileName), path.join(verifiedFolderPath, outputFileName))
  })

  // test expand specific templates
  const templateName = 'MultiLineTemplate'
  test
  .command(['lg:expand',
    '--in',
    path.join(__dirname, testcaseFolderPath, inputFileName),
    '--out',
    generatedFolder,
    '--template',
    templateName,
    '-r',
    '-f'])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, outputFileName), path.join(verifiedFolderPath, '4.template.expand.lg'))
  })

  // test expand inline template
  // eslint-disable-next-line no-template-curly-in-string
  const inlineString = '${MultiLineTemplate()}'
  test
  .command(['lg:expand',
    '--in',
    path.join(__dirname, testcaseFolderPath, inputFileName),
    '--out',
    generatedFolder,
    '--expression',
    inlineString,
    '-r',
    '-f'])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, outputFileName), path.join(verifiedFolderPath, '4.inline.expand.lg'))
  })

  const testInputTemplate = 'TimeOfDayWithCondition'
  // test testInput
  test
  .command(['lg:expand',
    '--in',
    path.join(__dirname, testcaseFolderPath, inputFileName),
    '--out',
    generatedFolder,
    '--template',
    testInputTemplate,
    '--testInput',
    path.join(__dirname, testcaseFolderPath, 'data.json'),
    '-r',
    '-f'])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, outputFileName), path.join(verifiedFolderPath, '4.testinput.expand.lg'))
  })
})

describe('lg:expand lg template with scope', async () => {
  after(async function () {
    await fs.remove(generatedFolder)
  })

  before(async function () {
    await fs.remove(generatedFolder)
    await fs.mkdirp(generatedFolder)
  })

  const inputFileName = 'accessScope.lg'
  let outputFileName = 'accessScope.expand.lg'

  let testInputTemplate = 'welcomeUser'
  // test access nested path
  test
  .command(['lg:expand',
    '--in',
    path.join(__dirname, testcaseFolderPath, inputFileName),
    '--out',
    generatedFolder,
    '--template',
    testInputTemplate,
    '--testInput',
    path.join(__dirname, testcaseFolderPath, 'data.json'),
    '-r',
    '-f'])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, outputFileName), path.join(verifiedFolderPath, 'accessScope.testinput.expand.lg'))
  })

  testInputTemplate = 'AddItemReadBack'
  // test multiple nested path access
  test
  .command(['lg:expand',
    '--in',
    path.join(__dirname, testcaseFolderPath, inputFileName),
    '--out',
    generatedFolder,
    '--template',
    testInputTemplate,
    '--testInput',
    path.join(__dirname, testcaseFolderPath, 'data.json'),
    '-r',
    '-f'])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, outputFileName), path.join(verifiedFolderPath, 'accessScope2.testinput.expand.lg'))
  })

  testInputTemplate = 'GetIndex'
  // test multiple nested path access
  test
  .command(['lg:expand',
    '--in',
    path.join(__dirname, testcaseFolderPath, inputFileName),
    '--out',
    generatedFolder,
    '--template',
    testInputTemplate,
    '--testInput',
    path.join(__dirname, testcaseFolderPath, 'data.json'),
    '-r',
    '-f'])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, outputFileName), path.join(verifiedFolderPath, 'accessScope3.testinput.expand.lg'))
  })
})
