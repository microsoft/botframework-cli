import 'mocha'
import { expect } from 'chai'
import * as util from 'util'
const exec = util.promisify(require('child_process').exec)

describe('functional tests for luis:application:* commands', () => {

    let appId = ''
    const endpoint = 'https://westus.api.cognitive.microsoft.com'
    const subscriptionKey = '261aa31eb8d14c9f8a4e9ef60436e879'
    
    before(async () => {
        // setup: create a test account
        const { stdout, stderr } = await exec(`bf luis:application:create --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --name functional_test_app --versionId 0.1`)
        if (stderr) return console.log(stderr)
        const regex = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/;
        appId = stdout.match(regex)[0]
        console.log(`Functional test app created: ${stdout}`)
    })

    after(async () => {
        // tear down: delete test account
        const { stdout, stderr } = await exec(`bf luis:application:delete --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${appId}`)
        if (stderr) return console.log(stderr)
        console.log(`Funcional test app deleted: ${stdout}`)
    })

    describe('verify that the test app has been created', () => {
      it('retrieve the details of the test app', async () => {
        const { stdout, stderr } = await exec(`bf luis:application:show --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${appId}`)
        if (stderr) return console.log(stderr)
        const response = JSON.parse(stdout.substr(0, stdout.search("Application data successfully output to console")))
        expect(response.id).to.equal(appId)
      })
    })

})