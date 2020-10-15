/**
 * @module @microsoft/bf-lg-cli
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {test} from '@oclif/test'
import {TestUtil} from './test-util'
import * as fs from 'fs-extra'
import * as path from 'path'

const nock = require('nock')

const  testcaseFolderPath = './../../fixtures/testcase'
const  generatedFolderPath = './../../fixtures/generated'
const  verifiedFolderPath = './../../fixtures/verified'
const  generatedFolder = path.join(__dirname, generatedFolderPath)
const translatekey = '11111111111111111111111111111111'
const subsregion = 'japaneast'

describe('lg:translate to fr', async () => {
  const response = require('./../../fixtures/testcase/translate-fr-1.json')
  const response2 = require('./../../fixtures/testcase/translate-fr-2.json')

  after(async function () {
    await fs.remove(generatedFolder)
  })

  before(async function () {
    await fs.remove(generatedFolder)
    await fs.mkdirp(generatedFolder)

    nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response)

    nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response2)
  })

  // basic translate for fr
  const inputFileName = '2.lg'
  const fr = 'fr'
  const frOutputName = '2.fr.lg'

  test
    .command(['lg:translate',
      '--translatekey',
      translatekey,
      '--region',
      subsregion,
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
})

describe('lg:translate to zh-cn', async () => {
  const response = require('./../../fixtures/testcase/translate-zh-cn-1.json')
  const response2 = require('./../../fixtures/testcase/translate-zh-cn-2.json')

  after(async function () {
    //await fs.remove(generatedFolder)
  })

  before(async function () {
    await fs.remove(generatedFolder)
    await fs.mkdirp(generatedFolder)

    nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response)

    nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response2)
  })

  // basic translate for zh-cn
  const inputFileName = '2.lg'
  const zhcn = 'zh-cn'
  const cnOutputName = '2.zh-cn.lg'

  test
  .command(['lg:translate',
    '--translatekey',
    translatekey,
    '--region',
    subsregion,
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
})

describe('lg:translate to zh-cn with comments', async () => {
  const response = require('./../../fixtures/testcase/translate-zh-cn-with-comments-1.json')
  const response2 = require('./../../fixtures/testcase/translate-zh-cn-with-comments-2.json')

  after(async function () {
    await fs.remove(generatedFolder)
  })

  before(async function () {
    await fs.remove(generatedFolder)
    await fs.mkdirp(generatedFolder)

    nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response)

    nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response2)
  })

  // test translate_comments option
  const inputFileName = '2.lg'
  const zhcn = 'zh-cn'
  const outputCommentsName = '2.comments.zh-cn.lg'
  test
  .command(['lg:translate',
    '--translatekey',
    translatekey,
    '--region',
    subsregion,
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
})

describe('lg:translate to zh-cn with translate_link_text', async () => {
  const response = require('./../../fixtures/testcase/translate-zh-cn-with-link-text-1.json')
  const response2 = require('./../../fixtures/testcase/translate-zh-cn-with-link-text-2.json')

  after(async function () {
    await fs.remove(generatedFolder)
  })

  before(async function () {
    await fs.remove(generatedFolder)
    await fs.mkdirp(generatedFolder)

    nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response)

    nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response2)
  })

  // test translate_link_text option
  const inputFileName = '2.lg'
  const zhcn = 'zh-cn'
  const outputLinkName = '2.link.zh-cn.lg'
  test
  .command(['lg:translate',
    '--translatekey',
    translatekey,
    '--region',
    subsregion,
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
