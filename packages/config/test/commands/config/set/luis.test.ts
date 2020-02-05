import {expect, test} from '@oclif/test'
import ConfigSetLuis from '../../../../src/commands/config/set/luis'
const sinon = require('sinon')
    
describe('config:set:luis', () => {
    
    beforeEach(() => {
        sinon.stub(ConfigSetLuis.prototype, 'saveConfig').returns(true)
    })
    
    afterEach(() => {
        sinon.restore();
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
    .it('displays an message indication values saved successfully', ctx => {
        expect(ctx.stdout).to.contain('Config settings saved')
    })

    test
    .stdout()
    .stderr()
    .command(['config:set:luis', '--appId', '8888', '--force'])
    .it('displays an message indication values saved successfully when force flag present', ctx => {
        expect(ctx.stdout).to.contain('Config settings saved')
    })
    
})
