import {expect, test} from '@oclif/test'
const path = require('path')
const fs = require('fs-extra')

describe('luis:transform:tomodel', () => {
  after(async function(){
    await fs.remove(path.join(__dirname, '../../../../root.luis.json'))
  })

  test
    .command(['luis:transform:tomodel', '--in', `${path.join(__dirname, '../../../fixtures/file.lu')}`, '--out', 'root.luis.json'])
    .it('luis:transform:tomodel --in ./test/fixtures/file.lu --out root.luis.json', async () => {
      let result = await fs.readFile(path.join(__dirname, '../../../../root.luis.json')).toString().replace(/\r\n/g, "\n")
      let fixtureFile = await fs.readFile(path.join(__dirname, '../../../fixtures/root.luis.json')).toString().replace(/\r\n/g, "\n")
      expect(result === fixtureFile).to.be.true
    })

    test
    .stderr()
    .command(['luis:transform:tomodel', '--luis_culture', 'xxx'])
    .it('luis:transform:tomodel --luis_culture xxx', ctx => {
      expect(ctx.stderr).to.have.string('Unrecognized LUIS locale. Supported locales are')
    })

    test
    .stderr()
    .command(['luis:transform:tomodel'])
    .it('luis:transform:tomodel', ctx => {
      expect(ctx.stderr).to.have.string('No .lu file or folder specified.')
    })

    test
    .stderr()
    .command(['luis:transform:tomodel', '--in', 'wrongfile', '--out', 'root.luis.json'])
    .it('luis:transform:tomodel --in wrongfile --out root.luis.json', ctx => {
      expect(ctx.stderr).to.have.string('Sorry unable to open [wrongfile]')
    })
})
