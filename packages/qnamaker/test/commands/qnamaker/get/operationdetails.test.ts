import {expect, test} from '@oclif/test'
const nock = require('nock')
const fs = require('fs-extra')
import * as path from 'path'

describe('qnamaker:get:operationdetails', () => {
  before(async function() {
    let config = {
      subscriptionKey: "222222cccccctttttth223kk3k33",
      hostname: "https://somehost.net",
      endpointKey: "xxxxxxxxxxxxxxxxxxx",
      kbId: "xxxxxxxxxxxxxxxxxxxxxxx"
    }
    
    await fs.writeJson(path.join(process.cwd(), '.qnamakerrc'), config, {spaces: 2})
    // runs before all tests in this block
    const scope = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
    .get('/operations/52ce56bc-9b89-4532-9581-6caa88b02f90')
    .reply(200,   
      {
        operationState: "Succeeded",
        createdTimestamp: "2019-08-07T10:45:17Z",
        lastActionTimestamp: "2019-08-07T10:45:38Z",
        resourceLocation: "/knowledgebases/540c6c77-60e8-47df-a324-19f8c82bd692",
        userId: "sahalksfhlakjfhalkdsjfhfs",
        operationId: "52ce56bc-9b89-4532-9581-6caa88b02f90"
      })
  
    })

    after(async function(){
      await fs.remove(path.join(process.cwd(), '.qnamakerrc'))
    })

  test
    .stdout()
    .command(['qnamaker:get:operationdetails', '--operationId', '52ce56bc-9b89-4532-9581-6caa88b02f90'])
    .it('Get operation details', ctx => {
      expect(ctx.stdout).to.contain('"operationId": "52ce56bc-9b89-4532-9581-6caa88b02f90"')
    })
})
