import {expect, test} from '@oclif/test'
const path = require('path')
const fs = require('fs-extra')

describe('luis:transform:tolu', () => {
  after(async function(){
    await fs.remove(path.join(__dirname, '../../../../root.lu'))
  })

  test
    .command(['luis:transform:tolu', '--LUIS_File', `${path.join(__dirname, '../../../fixtures/root.luis.json')}`, '--lu_File', 'root.lu'])
    .it('luis:transform:tolu --LUIS_File ./test/fixtures/root.luis.json --lu_File root.lu', async () => {
      let result = await fs.readFile(path.join(__dirname, '../../../../root.lu')).toString().replace(/\r\n/g, "\n")
      let fixtureFile = await fs.readFile(path.join(__dirname, '../../../fixtures/file.lu')).toString().replace(/\r\n/g, "\n")
      expect(result.includes(fixtureFile)).to.be.true
    })

  test
    .stderr()
    .command(['luis:transform:tolu', '--LUIS_File', 'wrongfile'])
    .it('luis:transform:tolu --LUIS_File wrongfile', ctx => {
      expect(ctx.stderr).to.contain('Stopping further processing')
    })
})
