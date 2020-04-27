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

describe('luis:cross training tests among lu and qna contents', () => {
  after(async function () {
    await fs.remove(path.join(__dirname, './../../../interruptionGen'))
  })

  test
    .stdout()
    .command(['luis:cross-train',
      '--in', `${path.join(__dirname, './../../fixtures/testcases/interruption')}`,
      '--intentName', '_Interruption',
      '--config', `${path.join(__dirname, './../../fixtures/testcases/interruption/mapping_rules.json')}`,
      '--out', './interruptionGen'])
    .it('luis:cross training can get expected result when handling multi locales and duplications', async () => {
      expect(await compareLuFiles('./../../../interruptionGen/main.lu', './../../fixtures/verified/interruption/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/main.qna', './../../fixtures/verified/interruption/main.qna')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.lu', './../../fixtures/verified/interruption/dia1.lu')).to.be.true
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
      '--out', './interruptionGen'])
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
      '--out', './interruptionGen'])
    .it('luis:cross training can get expected result when multiple dialog invocations occur in same trigger', async () => {
      expect(await compareLuFiles('./../../../interruptionGen/main.lu', './../../fixtures/verified/interruption3/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.lu', './../../fixtures/verified/interruption3/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia2.lu', './../../fixtures/verified/interruption3/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia3.lu', './../../fixtures/verified/interruption3/dia3.lu')).to.be.true
    })

  test
    .stdout()
    .command(['luis:cross-train',
      '--in', `${path.join(__dirname, './../../fixtures/testcases/interruption4')}`,
      '--intentName', '_Interruption',
      '--out', './interruptionGen',
      '--rootDialog', 'main/main.dialog'])
    .it('luis:cross training can get expected result when automatically detecting config based on rootdialog and file system', async () => {
      expect(await compareLuFiles('./../../../interruptionGen/main.lu', './../../fixtures/verified/interruption4/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.lu', './../../fixtures/verified/interruption4/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia2.lu', './../../fixtures/verified/interruption4/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia3.lu', './../../fixtures/verified/interruption4/dia3.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia4.lu', './../../fixtures/verified/interruption4/dia4.lu')).to.be.true
    })
})
