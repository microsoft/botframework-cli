import { expect, test } from '@oclif/test'
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
    await fs.remove(path.join(__dirname, './../../../interuptionGen'))
  })

  test
    .stdout()
    .command(['luis:cross-train', '--in', `${path.join(__dirname, './../../fixtures/testcases/interuption')}`, '--root', `${path.join(__dirname, './../../fixtures/testcases/interuption/main/main.lu')}, ${path.join(__dirname, './../../fixtures/testcases/interuption/main/main.fr-fr.lu')}`, '--out', 'interuptionGen', '--intentname', '_Interuption', '--recurse'])
    .it('luis:convert interuption intents when interuption intents are set', async () => {
      expect(await compareLuFiles('./../../../interuptionGen/main.lu', './../../fixtures/verified/interuption/main.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/dia1.lu', './../../fixtures/verified/interuption/dia1.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/dia2.lu', './../../fixtures/verified/interuption/dia2.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/dia3.lu', './../../fixtures/verified/interuption/dia3.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/dia4.lu', './../../fixtures/verified/interuption/dia4.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/main.fr-fr.lu', './../../fixtures/verified/interuption/main.fr-fr.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/dia1.fr-fr.lu', './../../fixtures/verified/interuption/dia1.fr-fr.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/dia2.fr-fr.lu', './../../fixtures/verified/interuption/dia2.fr-fr.lu')).to.be.true;
    })

  test
    .stdout()
    .command(['luis:cross-train', '--in', `${path.join(__dirname, './../../fixtures/testcases/interuption2')}`, '--root', `${path.join(__dirname, './../../fixtures/testcases/interuption2/main/main.lu')}`, '--out', 'interuptionGen', '--intentname', '_Interuption', '--recurse'])
    .it('luis:convert interuption intents when empty lu file occurs', async () => {
      expect(await compareLuFiles('./../../../interuptionGen/main.lu', './../../fixtures/verified/interuption2/main.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/dia1.lu', './../../fixtures/verified/interuption2/dia1.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/dia3.lu', './../../fixtures/verified/interuption2/dia3.lu')).to.be.true;
    })

    test
    .stdout()
    .command(['luis:cross-train', '--in', `${path.join(__dirname, './../../fixtures/testcases/interuption3')}`, '--root', `${path.join(__dirname, './../../fixtures/testcases/interuption3/main/main.lu')}`, '--out', 'interuptionGen', '--intentname', '_Interuption', '--recurse'])
    .it('luis:convert interuption intents when nestedIntentSection is enabled', async () => {
      expect(await compareLuFiles('./../../../interuptionGen/main.lu', './../../fixtures/verified/interuption3/main.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/dia1.lu', './../../fixtures/verified/interuption3/dia1.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/dia2.lu', './../../fixtures/verified/interuption3/dia2.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/dia3.lu', './../../fixtures/verified/interuption3/dia3.lu')).to.be.true;
      expect(await compareLuFiles('./../../../interuptionGen/dia4.lu', './../../fixtures/verified/interuption3/dia4.lu')).to.be.true;
    })
})

