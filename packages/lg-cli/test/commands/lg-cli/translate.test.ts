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
const translatekey = 'edabe9fb17244f6a92ec617867e6d7cd'

describe('mslg:translate lg file', async () => {
  after(async function () {
    await fs.remove(generatedFolder)
  })

  before(async function () {
    await fs.remove(generatedFolder)
    await fs.mkdirp(generatedFolder)
  })

  // basic translate for fr
  const inputFileName = '2.lg'
  const fr = 'fr'
  const frOutputName = '2.fr.lg'

  test
  .command(['mslg:translate',
    '--translatekey',
    translatekey,
    '--in',
    path.join(__dirname, testcaseFolderPath, inputFileName),
    '--tgtlang',
    fr,
    '-f',
    '--out',
    generatedFolder])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, frOutputName), path.join(verifiedFolderPath, frOutputName))
  })

  // basic translate for zh-cn
  const zhcn = 'zh-cn'
  const cnOutputName = '2.zh-cn.lg'

  test
  .command(['mslg:translate',
    '--translatekey',
    translatekey,
    '--in',
    path.join(__dirname, testcaseFolderPath, inputFileName),
    '--tgtlang',
    zhcn,
    '-f',
    '--out',
    generatedFolder])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, cnOutputName), path.join(verifiedFolderPath, cnOutputName))
  })

  // test translate_comments option
  const outputCommentsName = '2.comments.zh-cn.lg'
  test
  .command(['mslg:translate',
    '--translatekey',
    translatekey,
    '--in',
    path.join(__dirname, testcaseFolderPath, inputFileName),
    '--tgtlang',
    zhcn,
    '--out',
    path.join(__dirname, generatedFolderPath, outputCommentsName),
    '-f',
    '--translate_comments'])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, outputCommentsName), path.join(verifiedFolderPath, outputCommentsName))
  })

  // test translate_link_text option
  const outputLinkName = '2.link.zh-cn.lg'
  test
  .command(['mslg:translate',
    '--translatekey',
    translatekey,
    '--in',
    path.join(__dirname, testcaseFolderPath, inputFileName),
    '--tgtlang',
    zhcn,
    '-f',
    '--out',
    path.join(__dirname, generatedFolderPath, outputLinkName),
    '--translate_link_text'])
  .it('', async () => {
    await TestUtil.compareFiles(path.join(generatedFolderPath, outputLinkName), path.join(verifiedFolderPath, outputLinkName))
  })
})
