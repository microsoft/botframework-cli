import {expect, test} from '@oclif/test'
import * as path from 'path'

import {deleteTestConfigFile, getConfigFile, initTestConfigFile} from '../../../configfilehelper'
const nock = require('nock')
const fs = require('fs-extra')

describe('qnamaker:kb:create', () => {
  before(async function () {
    await initTestConfigFile()

    // runs before all tests in this block
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .post('/knowledgebases/createasync')
      .reply(200,
      {
        operationState: 'Succeeded',
        createdTimestamp: '2019-08-06T12:46:03Z',
        lastActionTimestamp: '2019-08-06T12:46:19Z',
        resourceLocation: '/knowledgebases/8600c573-2acf-4466-97e8-999ad4cecbc2',
        userId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        operationId: '5690998c-4438-4ae1-900a-88a2aa3bfa68'
      })

    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .get('/operations/5690998c-4438-4ae1-900a-88a2aa3bfa68')
      .reply(200,
      {
        operationState: 'Succeeded',
        createdTimestamp: '2019-08-06T12:46:03Z',
        lastActionTimestamp: '2019-08-06T12:46:19Z',
        resourceLocation: '/knowledgebases/8600c573-2acf-4466-97e8-999ad4cecbc2',
        userId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        operationId: '5690998c-4438-4ae1-900a-88a2aa3bfa68'
      })
  })

  after(async function () {
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:kb:create', '--in', `${path.join(__dirname, '../../../fixtures/kb.json')}`])
    .it('Creates kb qnamaker:kb:create --in', ctx => {
      let response = JSON.parse(ctx.stdout)
      expect(response.kbId).to.be.equal('8600c573-2acf-4466-97e8-999ad4cecbc2')
    })
})

describe('qnamaker:kb:create --save', () => {
  before(async function () {
    await initTestConfigFile()
    // runs before all tests in this block
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .post('/knowledgebases/createasync')
      .reply(200,
      {
        operationState: 'Succeeded',
        createdTimestamp: '2019-08-06T12:46:03Z',
        lastActionTimestamp: '2019-08-06T12:46:19Z',
        resourceLocation: '/knowledgebases/8600c573-2acf-4466-97e8-999ad4cecbc2',
        userId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        operationId: '5690998c-4438-4ae1-900a-88a2aa3bfa68'
      })

    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .get('/operations/5690998c-4438-4ae1-900a-88a2aa3bfa68')
      .reply(200,
      {
        operationState: 'Succeeded',
        createdTimestamp: '2019-08-06T12:46:03Z',
        lastActionTimestamp: '2019-08-06T12:46:19Z',
        resourceLocation: '/knowledgebases/8600c573-2acf-4466-97e8-999ad4cecbc2',
        userId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        operationId: '5690998c-4438-4ae1-900a-88a2aa3bfa68'
      })

    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .get('/endpointkeys')
      .reply(200,
      {
        primaryEndpointKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        secondaryEndpointKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        installedVersion: '5.15.0',
        lastStableVersion: '5.15.0'
      })

    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .get('/knowledgebases/8600c573-2acf-4466-97e8-999ad4cecbc2')
      .reply(200,
      {
        id: '8600c573-2acf-4466-97e8-999ad4cecbc2',
        hostName: 'https://somehostname.net',
        lastAccessedTimestamp: '2019-08-06T18:00:50Z',
        lastChangedTimestamp: '2019-08-06T18:00:50Z',
        name: 'QnA Maker FAQ',
        userId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        urls: [],
        sources: [
          'Manual.pdf',
          'Custom Editorial'
        ],
        language: 'English',
        enableHierarchicalExtraction: false,
        createdTimestamp: '2019-08-06T18:00:50Z'
      })

  })

  after(async function () {
    await deleteTestConfigFile()
  })

  test
    .command(['qnamaker:kb:create', '--in', `${path.join(__dirname, '../../../fixtures/kb.json')}`, '--save'])
    .it('Creates kb and awaits for the creation of it', async () => {
      let config = await fs.readJSON(getConfigFile())
      expect(config.qnamaker__kbId).to.contain('8600c573-2acf-4466-97e8-999ad4cecbc2')
    })
})

describe('qnamaker:kb:create No input', () => {
  test
    .stderr()
    .command(['qnamaker:kb:create'])
    .it('Creates kb qnamaker:kb:create --in', ctx => {
      expect(ctx.stderr).to.contain('No input. Please set file path with --in or pipe required data to the command')
    })
})
