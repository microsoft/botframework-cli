import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')
const crossTrain = require('./../../../src/parser/cross-train/cross-train')

const compareLuFiles = async function (file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, "\n")
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, "\n")
  return result === fixtureFile
}

describe('luis:convert interruption intent among lu files', () => {
  after(async function () {
    await fs.remove(path.join(__dirname, './../../../interruptionGen'))
  })

  test
    .stdout()
    .it('luis:convert interruption intents and qna', async () => {
      const trainedResult = await crossTrain.train(
        `${path.join(__dirname, './../../fixtures/testcases/interruption')}`,
        '_Interruption',
        `${path.join(__dirname, './../../fixtures/testcases/interruption/mapping_rules.json')}`)

      await crossTrain.writeFiles(trainedResult.luResult, 'interruptionGen')
      await crossTrain.writeFiles(trainedResult.qnaResult, 'interruptionGen')

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
      expect(await compareLuFiles('./../../../interruptionGen/dia1.fr-fr.lu', './../../fixtures/verified/interruption/dia1.fr-fr.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia2.fr-fr.lu', './../../fixtures/verified/interruption/dia2.fr-fr.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/main.fr-fr.qna', './../../fixtures/verified/interruption/main.fr-fr.qna')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.fr-fr.qna', './../../fixtures/verified/interruption/dia1.fr-fr.qna')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia2.fr-fr.qna', './../../fixtures/verified/interruption/dia2.fr-fr.qna')).to.be.true
    })

  test
    .stdout()
    .it('luis:convert interruption intents when empty lu file occurs', async () => {
      const trainedResult = await crossTrain.train(
        `${path.join(__dirname, './../../fixtures/testcases/interruption2')}`,
        '_Interruption')

      await crossTrain.writeFiles(trainedResult.luResult, 'interruptionGen')
      await crossTrain.writeFiles(trainedResult.qnaResult, 'interruptionGen')

      expect(await compareLuFiles('./../../../interruptionGen/main.lu', './../../fixtures/verified/interruption2/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.lu', './../../fixtures/verified/interruption2/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia2.lu', './../../fixtures/verified/interruption2/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia3.lu', './../../fixtures/verified/interruption2/dia3.lu')).to.be.true
    })

  test
    .stdout()
    .it('luis:convert interruption intents when nestedIntentSection is enabled', async () => {
      const trainedResult = await crossTrain.train(
        `${path.join(__dirname, './../../fixtures/testcases/interruption3')}`,
        '_Interruption')

      await crossTrain.writeFiles(trainedResult.luResult, 'interruptionGen')
      await crossTrain.writeFiles(trainedResult.qnaResult, 'interruptionGen')

      expect(await compareLuFiles('./../../../interruptionGen/main.lu', './../../fixtures/verified/interruption3/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.lu', './../../fixtures/verified/interruption3/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia2.lu', './../../fixtures/verified/interruption3/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia3.lu', './../../fixtures/verified/interruption3/dia3.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia4.lu', './../../fixtures/verified/interruption3/dia4.lu')).to.be.true
    })

  test
    .stdout()
    .it('luis:convert interruption intents when local intents occur', async () => {
      const trainedResult = await crossTrain.train(
        `${path.join(__dirname, './../../fixtures/testcases/interruption4')}`,
        '_Interruption')

      await crossTrain.writeFiles(trainedResult.luResult, 'interruptionGen')
      await crossTrain.writeFiles(trainedResult.qnaResult, 'interruptionGen')

      expect(await compareLuFiles('./../../../interruptionGen/main.lu', './../../fixtures/verified/interruption4/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.lu', './../../fixtures/verified/interruption4/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia2.lu', './../../fixtures/verified/interruption4/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia3.lu', './../../fixtures/verified/interruption4/dia3.lu')).to.be.true
    })

  test
    .stdout()
    .it('luis:convert interruption intents when multiple dialog invocations occur in same trigger', async () => {
      const trainedResult = await crossTrain.train(
        `${path.join(__dirname, './../../fixtures/testcases/interruption5')}`,
        '_Interruption')

      await crossTrain.writeFiles(trainedResult.luResult, 'interruptionGen')
      await crossTrain.writeFiles(trainedResult.qnaResult, 'interruptionGen')

      expect(await compareLuFiles('./../../../interruptionGen/main.lu', './../../fixtures/verified/interruption5/main.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia1.lu', './../../fixtures/verified/interruption5/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia2.lu', './../../fixtures/verified/interruption5/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia3.lu', './../../fixtures/verified/interruption5/dia3.lu')).to.be.true
      expect(await compareLuFiles('./../../../interruptionGen/dia4.lu', './../../fixtures/verified/interruption5/dia4.lu')).to.be.true
    })
})
