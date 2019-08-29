import {expect, test} from '@oclif/test'
import cli from 'cli-ux'
const fs = require('fs-extra')
const nock = require('nock')
import {initTestConfigFile, deleteTestConfigFile, getConfigFile} from '../../configfilehelper'

describe('qnamaker:init', () => {
    before(async function() {
      await initTestConfigFile()
      const scope = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .get('/endpointkeys')
      .reply(200,
        {
          primaryEndpointKey: "aaaaa-bbbbb-cccc-dddddd",
          secondaryEndpointKey: "xxxxx-xxxxxx-xxxxxx-xxxxx"
        })

        const scope2 = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .get('/knowledgebases/abcdefg')
      .reply(200, 
        {
          id: "9d091697-fb8c-4ed5-9ac0-35bf8273bfff",
          hostName: "https://myqnamakerbot.azurewebsites.net",
          lastAccessedTimestamp: "2018-03-16T10:59:46Z",
          lastChangedTimestamp: "2018-03-16T10:58:10Z",
          lastPublishedTimestamp: "2018-03-16T10:59:56Z",
          name: "My QnA Maker Bot",
          userId: "03a4f4ce-30a6-4ec6-b436-02bcdf6153e1",
          urls: [
            "https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs",
            "https://docs.microsoft.com/en-us/bot-framework/resources-bot-framework-faq"
          ],
          sources: [
            "Custom Editorial",
            "SurfaceManual.pdf"
          ]
        }
      )
    });

    after(async function() {
      await deleteTestConfigFile()
    });

    test
    .stub(cli, 'prompt', () => async () => 'abcdefg')
    .stub(cli, 'confirm', () => async () => 'y')
    .command(['qnamaker:init'])
    .do(async output => {
      let config = await fs.readJSON(getConfigFile())
      expect(config.qnamaker.subscriptionKey).to.contain('abcdefg')
    })
    .it('Creates .qna.rc file')
})
