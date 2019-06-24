import {Command} from '../src/command'
import {CLIError, ExitError} from '@oclif/errors' 
import {expect, fancy} from 'fancy-test'
let assert = require('assert');

describe('command', () => {
  fancy
  .do(async () => {
    const thrownError = new Error('failure')
    class Test extends Command {
        async run() {
  
          throw new Error('failure')
        }
      }

    return Test.run([])
  })
  .catch(/failure/)
  .it('errors out')

  fancy
  .do(async () => {
    const thrownError = new CLIError('failure')
    class Test extends Command {
        async run() {
  
          throw new CLIError('failure')
        }
      }

    return Test.run([])
  })
  .catch(/EEXIT: 0/)
  .it('Exits with error')

  fancy
  .stderr()
  .do(async () => {
    class Test extends Command {
        async run() {
            this.error('message')
        }
      }

    return Test.run([])
  })
  .do(output => expect(output.stderr).to.equal('message\n'))
  .it('writes to stderr')

  fancy
  .stdout()
  .do(async () => {
    class Test extends Command {
        async run() {
          this.telemetryEnabled = true
          this.trackEvent('event')
          this.log('No crash')
        }
      }

    return Test.run([])
  })
  .do(output => expect(output.stdout).to.equal('No crash\n'))
  .it('Track Event should not crash')

})