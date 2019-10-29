import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')

const compareLuFiles = async function(file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, "\n")
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, "\n")
  return result === fixtureFile
}

describe('luis:convert interuption intent among lu files', () => {
  after(async function() {
    await fs.remove(path.join(__dirname, './../../../interuptionGen'))
  })

  test
  .stdout()
  .command(['luis:cross-train', '--in', `${path.join(__dirname, './../../fixtures/testcases/interuption')}`, '--out', 'interuptionGen', '--intentname', 'interuptionGen', '--recurse'])
  .it('luis:convert interuption intents when interuption intents are set', async () => {
    expect(await compareLuFiles('./../../../interuptionGen/restaurant.lu', './../../fixtures/verified/interuption/restaurant.lu')).to.be.true;
    expect(await compareLuFiles('./../../../interuptionGen/hotel.lu', './../../fixtures/verified/interuption/hotel.lu')).to.be.true;
    expect(await compareLuFiles('./../../../interuptionGen/flight.lu', './../../fixtures/verified/interuption/flight.lu')).to.be.true;
  })
})

