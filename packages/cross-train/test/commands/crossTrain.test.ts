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

describe('luis:convert interuption intent among lu files', () => {
  after(async function () {
    await fs.remove(path.join(__dirname, './../../interuptionGen'))
  })

  test
    .stdout()
    .command(['cross-train',
      '--in', `${path.join(__dirname, './../fixtures/testcases/interuption')}`,
      '--intentName', '_Interuption',
      '--config', `${path.join(__dirname, './../fixtures/testcases/interuption/mapping_rules.json')}`,
      '--out', './interuptionGen'])
    .it('luis:convert interuption intents and qna', async () => {
      expect(await compareLuFiles('./../../interuptionGen/main.lu', './../fixtures/verified/interuption/main.lu')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/main.qna', './../fixtures/verified/interuption/main.qna')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/dia1.lu', './../fixtures/verified/interuption/dia1.lu')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/dia1.qna', './../fixtures/verified/interuption/dia1.qna')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/dia2.lu', './../fixtures/verified/interuption/dia2.lu')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/dia2.qna', './../fixtures/verified/interuption/dia2.qna')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/dia3.lu', './../fixtures/verified/interuption/dia3.lu')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/dia3.qna', './../fixtures/verified/interuption/dia3.qna')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/dia4.lu', './../fixtures/verified/interuption/dia4.lu')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/main.fr-fr.lu', './../fixtures/verified/interuption/main.fr-fr.lu')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/dia1.fr-fr.lu', './../fixtures/verified/interuption/dia1.fr-fr.lu')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/dia2.fr-fr.lu', './../fixtures/verified/interuption/dia2.fr-fr.lu')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/main.fr-fr.qna', './../fixtures/verified/interuption/main.fr-fr.qna')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/dia1.fr-fr.qna', './../fixtures/verified/interuption/dia1.fr-fr.qna')).to.be.true
      expect(await compareLuFiles('./../../interuptionGen/dia2.fr-fr.qna', './../fixtures/verified/interuption/dia2.fr-fr.qna')).to.be.true
    })
})
