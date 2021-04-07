import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')

const compareLuFiles = async function (file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, "\n")
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, "\n")
  return result === fixtureFile
}

describe('luis:cross-train tests for cli parameters', () => {
  test
    .stdout()
    .stderr()
    .command(['luis:cross-train'])
    .exit(1)
    .it('displays an error if --in is not provided', ctx => {
      expect(ctx.stderr).to.contain('Missing input. Please specify a folder with --in flag')
    })

  test
    .stdout()
    .stderr()
    .command(['luis:cross-train', '--in', `${path.join(__dirname, './../../fixtures/testcases/interruption')}`])
    .exit(1)
    .it('displays an error if config is not provided', ctx => {
      expect(ctx.stderr).to.contain('Missing cross train config. Please provide config file path by --config')
    })
})

describe('luis:cross-train tests for lu and qna contents', () => {
  after(async function () {
    await fs.remove(path.join(__dirname, './../../../interruptionGen'))
  })

  test
    .stdout()
    .command(['luis:cross-train',
      '--in', `${path.join(__dirname, './../../fixtures/testcases/interruption')}`,
      '--intentName', '_Interruption',
      '--config', `${path.join(__dirname, './../../fixtures/testcases/interruption/mapping_rules.json')}`,
      '--out', './interruptionGen',
      '--force'])
    .it('luis:cross training can get expected result when handling multi locales and duplications', async () => {
      expect(await compareLuFiles('./../../../interruptionGen/Main.lu', './../../fixtures/verified/interruption/Main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/Main.qna', './../../fixtures/verified/interruption/Main.qna')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/Dia1.lu', './../../fixtures/verified/interruption/Dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.qna', './../../fixtures/verified/interruption/dia1.qna')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia2.lu', './../../fixtures/verified/interruption/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia2.qna', './../../fixtures/verified/interruption/dia2.qna')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia3.lu', './../../fixtures/verified/interruption/dia3.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia3.qna', './../../fixtures/verified/interruption/dia3.qna')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia4.lu', './../../fixtures/verified/interruption/dia4.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/main.fr-fr.lu', './../../fixtures/verified/interruption/main.fr-fr.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/main.fr-fr.qna', './../../fixtures/verified/interruption/main.fr-fr.qna')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.fr-fr.lu', './../../fixtures/verified/interruption/dia1.fr-fr.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.fr-fr.qna', './../../fixtures/verified/interruption/dia1.fr-fr.qna')).to.be.true
    })

  test
    .stdout()
    .command(['luis:cross-train',
      '--in', `${path.join(__dirname, './../../fixtures/testcases/interruption2')}`,
      '--intentName', '_Interruption',
      '--config', `${path.join(__dirname, './../../fixtures/testcases/interruption2/config.json')}`,
      '--out', './interruptionGen',
      '--force'])
    .it('luis:cross training can get expected result when nestedIntentSection is enabled', async () => {
      expect(await compareLuFiles('./../../../interruptionGen/main.lu', './../../fixtures/verified/interruption2/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.lu', './../../fixtures/verified/interruption2/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia2.lu', './../../fixtures/verified/interruption2/dia2.lu')).to.be.true
    })

  test
    .stdout()
    .command(['luis:cross-train',
      '--in', `${path.join(__dirname, './../../fixtures/testcases/interruption3')}`,
      '--intentName', '_Interruption',
      '--config', `${path.join(__dirname, './../../fixtures/testcases/interruption3/config.json')}`,
      '--out', './interruptionGen',
      '--force'])
    .it('luis:cross training can get expected result when multiple dialog invocations occur in same trigger', async () => {
      expect(await compareLuFiles('./../../../interruptionGen/main.lu', './../../fixtures/verified/interruption3/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.lu', './../../fixtures/verified/interruption3/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia2.lu', './../../fixtures/verified/interruption3/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia3.lu', './../../fixtures/verified/interruption3/dia3.lu')).to.be.true
    })

  test
    .stdout()
    .command(['luis:cross-train',
      '--in', `${path.join(__dirname, './../../fixtures/testcases/interruption5')}`,
      '--intentName', '_Interruption',
      '--config', `${path.join(__dirname, './../../fixtures/testcases/interruption5/mapping_rules.json')}`,
      '--out', './interruptionGen'])
    .it('luis:cross training can split large DeferToLUIS QA pair into smaller ones when it has more than 1000 questions', async () => {
      expect(await compareLuFiles('./../../../interruptionGen/main(1).lu', './../../fixtures/verified/interruption5/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/main(1).qna', './../../fixtures/verified/interruption5/main.qna')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1(1).lu', './../../fixtures/verified/interruption5/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1(1).qna', './../../fixtures/verified/interruption5/dia1.qna')).to.be.true
    })

  test
    .stdout()
    .stderr()
    .command(['luis:cross-train',
    '--in', `${path.join(__dirname, './../../fixtures/testcases/interruption6')}`,
    '--intentName', '_Interruption',
    '--config', `${path.join(__dirname, './../../fixtures/testcases/interruption6/mapping_rules.json')}`,
    '--out', './interruptionGen',
    '--log'])
    .it('displays a warning if log is set true', ctx => {
      expect(ctx.stdout).to.contain('[WARN] line 1:0 - line 1:15: no utterances found for intent definition: "# hotelLocation"')
    })

  test
    .stdout()
    .command(['luis:cross-train',
      '--in', `${path.join(__dirname, './../../fixtures/testcases/interruption5')}`,
      '--intentName', '_Interruption',
      '--config', `${path.join(__dirname, './../../fixtures/testcases/interruption5/mapping_rules.json')}`,
      '--out', './interruptionGen',
      '--force',
      '--intra-dialog',
      '--no-inner-dialog'])
    .it('luis:cross training only do inner dialog', async () => {
      expect(await compareLuFiles('./../../../interruptionGen/main.lu', './../../fixtures/verified/interruption6/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/main.qna', './../../fixtures/verified/interruption6/main.qna')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.lu', './../../fixtures/verified/interruption6/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.qna', './../../fixtures/verified/interruption6/dia1.qna')).to.be.true
    })

  test
    .stdout()
    .command(['luis:cross-train',
      '--in', `${path.join(__dirname, './../../fixtures/testcases/interruption5')}`,
      '--intentName', '_Interruption',
      '--config', `${path.join(__dirname, './../../fixtures/testcases/interruption5/mapping_rules.json')}`,
      '--out', './interruptionGen',
      '--force',
      '--inner-dialog',
      '--no-intra-dialog'])
    .it('luis:cross training only do intra dialog', async () => {
      expect(await compareLuFiles('./../../../interruptionGen/main.lu', './../../fixtures/verified/interruption7/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/main.qna', './../../fixtures/verified/interruption7/main.qna')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.lu', './../../fixtures/verified/interruption7/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.qna', './../../fixtures/verified/interruption7/dia1.qna')).to.be.true
    })

    test
    .stdout()
    .command(['luis:cross-train',
      '--in', `${path.join(__dirname, './../../fixtures/testcases/application')}`,
      '--config', `${path.join(__dirname, './../../fixtures/testcases/application/cross-train.config.json')}`,
      '--out', './interruptionGen',
      '--force'])
    .it('luis:cross training should able to import files out of current directory', async () => {
      expect(await compareLuFiles('./../../../interruptionGen/application.lu', './../../fixtures/verified/interruption8/application.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/application.qna', './../../fixtures/verified/interruption8/application.qna')).to.be.true
    })
})