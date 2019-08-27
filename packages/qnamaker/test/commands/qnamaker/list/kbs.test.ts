import {expect, test} from '@oclif/test'
const nock = require('nock')
import {initEmptyTestConfigFile, initTestConfigFile, deleteTestConfigFile} from '../../../configfilehelper'

describe('qnamaker:list:kbs', () => {
  before(async function() {
    await initTestConfigFile()
    // runs before all tests in this block
    const scope = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
    .get('/knowledgebases')
    .reply(200,   
      {
        knowledgebases: [
          {
            id: "alksdjhfla878453l2ty8f",
            hostName: "https://some.hostname.net",
            lastAccessedTimestamp: "2019-07-26T23:46:07Z",
            lastChangedTimestamp: "2019-06-28T20:29:02Z",
            lastPublishedTimestamp: "2019-06-28T21:46:12Z",
            name: "name_test",
            userId: "ejw494875p23rhrlewjkf",
            urls: [],
            sources: [
              "Editorial"
            ],
            language: "English",
            enableHierarchicalExtraction: false,
            createdTimestamp: "2019-06-28T20:19:22Z"
          },
          {
            id: "kasdjhfliu4849r4",
            hostName: "https://some.hostname.net",
            lastAccessedTimestamp: "2019-08-07T22:45:26Z",
            lastChangedTimestamp: "2019-08-07T22:45:26Z",
            name: "QnA Maker FAQ",
            userId: "kq438lyriuhdleaihflkj",
            urls: [],
            sources: [
              "Manual.pdf",
              "Custom Editorial"
            ],
            language: "English",
            enableHierarchicalExtraction: false,
            createdTimestamp : "2019-08-07T22:45:26Z"
          }
        ]
      })
  
    })

    after(async function(){
      await deleteTestConfigFile()
    })

  test
    .stdout()
    .command(['qnamaker:list:kbs'])
    .it('Gets knowledgebase list', ctx => {
      expect(ctx.stdout).to.contain('"createdTimestamp": "2019-06-28T20:19:22Z"\n    },\n    {\n      "id": "kasdjhfliu4849r4",\n      "hostName": "https://some.hostname.net"')
    })
})

describe('qnamaker:list:kbs', () => {
  before(async function() {
    await initEmptyTestConfigFile()
  })

  after(async function(){
    await deleteTestConfigFile()
  })

  test
    .stderr()
    .command(['qnamaker:list:kbs'])
    .it('Prompts the user if no config passed or set in config.file', ctx => {
      expect(ctx.stderr).to.contain('Did you run qnamaker init yet?')
    })
})
