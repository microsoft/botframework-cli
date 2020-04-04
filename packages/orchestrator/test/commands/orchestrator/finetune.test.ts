import {expect, test} from '@oclif/test';
const path = require('path')
const fs = require('fs-extra')
const uuidv1 = require('uuid/v1')

const compareFiles = async function (file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, '\n')
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, '\n')
  expect(fixtureFile).to.deep.equal(result)
  return result === fixtureFile
}

describe('orchestrator:finetune cli parameters test', () => {
  test
  .stdout()
  .stderr()
  .command(['orchestrator:finetune'])
  .it('FT.0000 orchestrator:finetune', ctx => {
    expect(ctx.stderr).to.contain('Missing 1 required arg')
  });

  test
  .stdout()
  .command(['orchestrator:finetune', '--help'])
  .it('FT.0001 should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Manage Orchestrator fine tuning.')
  });

  test
  .stdout()
  .stderr()
  .command(['orchestrator:finetune', 'put'])
  .it('FT.0002 displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain('Missing 1 required arg')
  });

  test
  .stdout()
  .stderr()
  .command(['orchestrator:finetune', '--put'])
  .it('FT.0002 displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain('Command "--put" unknown')
  });

  if (process.env.USE_EMULATOR === 'true') {
    test
    .stdout()
    .stderr()
    .command(['luis:build', '--get'])
    .it('displays an error if any required output parameters are missing', ctx => {
      expect(ctx.stderr).to.contain('Missing input. Please use stdin or pass a file or folder location with --in flag')
    });
  }
});
