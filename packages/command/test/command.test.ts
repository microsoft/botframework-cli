import {Command} from '../src/command'
import {CLIError} from '@oclif/errors' 
import {expect, fancy} from 'fancy-test'
import ReadPipedStdin from '../src/readpipeddata'
import * as path from 'path';
import utils from '../src/utils'

describe('command', () => {
  fancy
  .stderr()
  .do(async () => {
    const thrownError = new Error('failure')
    class Test extends Command {
        async run() {
          throw new Error('failure')
        }
      }

    return Test.run([])
  })
  .do(output => expect(output.stderr).to.equal('Unknown error during execution. Please file an issue on https://github.com/microsoft/botframework-cli/issues\nfailure\n'))
  .it('Errors out')

  fancy
  .stderr()
  .do(async () => {
    const thrownError = new CLIError('failure')
    class Test extends Command {
        async run() {
          throw new CLIError('failure')
        }
      }

    return Test.run([])
  })
  .do(output => expect(output.stderr).to.equal('failure\n'))
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

  fancy
  .stderr()
  .do(async () => {
    class Test extends Command {
        async run() {
            let stdin = await this.readStdin()
            this.log(stdin)
        }
      }
    return Test.run([])
  })
  .do(output => expect(output.stderr).to.equal(''))
  .it('Command should return empty string if no stdin')

  fancy
  .stdin('test reading of piped data')
  .stdout()
  .do(async () => {
    try {
      const resp: any = await ReadPipedStdin.read()
      if (resp) console.log(resp)
    } catch (error) {
      if (error) console.log(`Error: ${error}`)
    }
  })
  .do(output => expect(output.stdout).to.equal('test reading of piped data\n'))
  .it('should read and echo the stdin input')

  fancy
  .stdin('')
  .stdout()
  .do(async () => {
    try {
      const resp: any = await ReadPipedStdin.read()
      if (resp) console.log(resp)
    } catch (error) {
      if (error) console.log(`Error: ${error}`)
    }
  })
  .do(output => expect(output.stdout).to.contain('No input'))
  .it('should receive an error if there is no stdin input')

  fancy
  .stdout()
  .do(async () => {
    class Test extends Command {
      async run() {
        try {
          const simpleChatFile = path.join(__dirname, 'fixtures/cli.sample.txt')
          const resp: any = await utils.readTextFile(simpleChatFile)
          this.log(resp.toString())
        } catch (error) {
          if (error) this.log(`Error: ${error}`)
        }
      }
    }
    return Test.run([])
  })
  .do(output => expect(output.stdout).to.contain('LulaBot: Hello there!'))
  .it('should read and echo the file contents')

  fancy
  .stdout()
  .do(async () => {
    class Test extends Command {
      async run() {
        try {
          const simpleChatFile = path.join(__dirname, 'fixtures/xxx.txt')
          const resp: any = await utils.readTextFile(simpleChatFile)
          this.log(resp.toString())
        } catch (error) {
          if (error) this.log(`Error: ${error}`)
        }
      }
    }
    return Test.run([])
  })
  .do(output => expect(output.stdout).to.contain('Error'))
  .it('should receive an error if file does not exist')


})