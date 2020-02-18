import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')
const crossTrain = require('./../../../src/parser/lu/cross-train')

const compareLuFiles = async function (file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, "\n")
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, "\n")
  return result === fixtureFile
}

describe('luis:convert interuption intent among lu files', () => {
  after(async function () {
    await fs.remove(path.join(__dirname, './../../../interuptionGen'))
  })

  test
    .stdout()
    .it('luis:convert interuption intents and qna', async () => {
      const trainedResult = await crossTrain.train(
        `${path.join(__dirname, './../../fixtures/testcases/interuption')}`,
        '_Interuption',
        `${path.join(__dirname, './../../fixtures/testcases/interuption/mapping_rules.json')}`)

      await crossTrain.writeFiles(trainedResult.luResult, 'interuptionGen')
      await crossTrain.writeFiles(trainedResult.qnaResult, 'interuptionGen')

      expect(await compareLuFiles('./../../../interuptionGen/main.lu', './../../fixtures/verified/interuption/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/main.qna', './../../fixtures/verified/interuption/main.qna')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia1.lu', './../../fixtures/verified/interuption/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia1.qna', './../../fixtures/verified/interuption/dia1.qna')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia2.lu', './../../fixtures/verified/interuption/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia2.qna', './../../fixtures/verified/interuption/dia2.qna')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia3.lu', './../../fixtures/verified/interuption/dia3.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia3.qna', './../../fixtures/verified/interuption/dia3.qna')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia4.lu', './../../fixtures/verified/interuption/dia4.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/main.fr-fr.lu', './../../fixtures/verified/interuption/main.fr-fr.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia1.fr-fr.lu', './../../fixtures/verified/interuption/dia1.fr-fr.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia2.fr-fr.lu', './../../fixtures/verified/interuption/dia2.fr-fr.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/main.fr-fr.qna', './../../fixtures/verified/interuption/main.fr-fr.qna')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia1.fr-fr.qna', './../../fixtures/verified/interuption/dia1.fr-fr.qna')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia2.fr-fr.qna', './../../fixtures/verified/interuption/dia2.fr-fr.qna')).to.be.true
    })

  test
    .stdout()
    .it('luis:convert interuption intents when empty lu file occurs', async () => {
      const trainedResult = await crossTrain.train(
        `${path.join(__dirname, './../../fixtures/testcases/interuption2')}`,
        '_Interuption')

      await crossTrain.writeFiles(trainedResult.luResult, 'interuptionGen')
      await crossTrain.writeFiles(trainedResult.qnaResult, 'interuptionGen')

      expect(await compareLuFiles('./../../../interuptionGen/main.lu', './../../fixtures/verified/interuption2/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia1.lu', './../../fixtures/verified/interuption2/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia2.lu', './../../fixtures/verified/interuption2/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia3.lu', './../../fixtures/verified/interuption2/dia3.lu')).to.be.true
    })

  test
    .stdout()
    .it('luis:convert interuption intents when nestedIntentSection is enabled', async () => {
      const trainedResult = await crossTrain.train(
        `${path.join(__dirname, './../../fixtures/testcases/interuption3')}`,
        '_Interuption')

      await crossTrain.writeFiles(trainedResult.luResult, 'interuptionGen')
      await crossTrain.writeFiles(trainedResult.qnaResult, 'interuptionGen')

      expect(await compareLuFiles('./../../../interuptionGen/main.lu', './../../fixtures/verified/interuption3/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia1.lu', './../../fixtures/verified/interuption3/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia2.lu', './../../fixtures/verified/interuption3/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia3.lu', './../../fixtures/verified/interuption3/dia3.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia4.lu', './../../fixtures/verified/interuption3/dia4.lu')).to.be.true
    })

  test
    .stdout()
    .it('luis:convert interuption intents when local intents occur', async () => {
      const trainedResult = await crossTrain.train(
        `${path.join(__dirname, './../../fixtures/testcases/interuption4')}`,
        '_Interuption')

      await crossTrain.writeFiles(trainedResult.luResult, 'interuptionGen')
      await crossTrain.writeFiles(trainedResult.qnaResult, 'interuptionGen')

      expect(await compareLuFiles('./../../../interuptionGen/main.lu', './../../fixtures/verified/interuption4/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia1.lu', './../../fixtures/verified/interuption4/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia2.lu', './../../fixtures/verified/interuption4/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia3.lu', './../../fixtures/verified/interuption4/dia3.lu')).to.be.true
    })

  test
    .stdout()
    .it('luis:convert interuption intents when multiple dialog invocations occur in same trigger', async () => {
      const trainedResult = await crossTrain.train(
        `${path.join(__dirname, './../../fixtures/testcases/interuption5')}`,
        '_Interuption')

      await crossTrain.writeFiles(trainedResult.luResult, 'interuptionGen')
      await crossTrain.writeFiles(trainedResult.qnaResult, 'interuptionGen')

      expect(await compareLuFiles('./../../../interuptionGen/main.lu', './../../fixtures/verified/interuption5/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia1.lu', './../../fixtures/verified/interuption5/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia2.lu', './../../fixtures/verified/interuption5/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia3.lu', './../../fixtures/verified/interuption5/dia3.lu')).to.be.true
      expect(await compareLuFiles('./../../../interuptionGen/dia4.lu', './../../fixtures/verified/interuption5/dia4.lu')).to.be.true
    })

  test
    .stdout()
    .stderr()
    .it('luis:convert should throw exception when dialog call loop is detected in config', async (ctx) => {
      try {
        await crossTrain.train(
          `${path.join(__dirname, './../../fixtures/testcases/interuption6')}`,
          '_Interuption')
      } catch (err) {
        err.message.includes('Sorry, dialog call loop detected for lu file')
      }
    })
})
