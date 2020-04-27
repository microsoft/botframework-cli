import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile, getConfigFile} from './../../../configfilehelper'
const fs = require('fs-extra')
    
describe('config:set:luis', () => {  
    before(async function() {
        await initTestConfigFile()
      });
    
      after(async function() {
        await deleteTestConfigFile()
      });

    test
    .stdout()
    .command(['config:set:luis', '--help'])
    .it('should print the help contents when --help is passed as an argument', ctx => {
        expect(ctx.stdout).to.contain('Stores default LUIS application values in global config.')
    })
    
    test
    .stdout()
    .stderr()
    .command(['config:set:luis'])
    .it('displays an message indication nothing saved if no config values passed', ctx => {
        expect(ctx.stdout).to.contain('No config settings specified')
    })
    
    test
    .stdout()
    .stderr()
    .command(['config:set:luis', '--appId', '9999'])
    .it('displays an message indication values saved successfully', async ctx => {
        let config = await fs.readJSON(getConfigFile())
        expect(config.luis__appId).to.contain('9999')
        expect(ctx.stdout).to.contain('appId set to 9999')
    })
    
})
