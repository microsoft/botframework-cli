import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')

const compareSourceFiles = async function (file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, '\n')
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, '\n')
  expect(result).to.be.equal(fixtureFile)
}

describe('luis:generate:cs', () => {
  before(async function () {
    await fs.ensureDir(path.join(__dirname, '../../../fixtures/generate/results'))
  })

  after(async function () {
    await fs.emptyDir(path.join(__dirname, '../../../fixtures/generate/results'))
  })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/Intents.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/Intents.cs')}`])
    .it('Generates intents correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/Intents.cs', '../../../fixtures/generate/results/Intents.cs')
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/SimpleEntities.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/SimpleEntities.cs')}`])
    .it('Generates simple entities correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/SimpleEntities.cs', '../../../fixtures/generate/results/SimpleEntities.cs')
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/CompositeEntities.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/CompositeEntities.cs')}`])
    .it('Generates composites entities correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/CompositeEntities.cs', '../../../fixtures/generate/results/CompositeEntities.cs')
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/ClosedLists.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/ClosedLists.cs')}`])
    .it('Generates closed lists entities correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/ClosedLists.cs', '../../../fixtures/generate/results/ClosedLists.cs')
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/PatternEntities.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/PatternEntities.cs')}`])
    .it('Generates pattern entities correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/PatternEntities.cs', '../../../fixtures/generate/results/PatternEntities.cs')
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/RegexEntities.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/RegexEntities.cs')}`])
    .it('Generates regex entities correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/RegexEntities.cs', '../../../fixtures/generate/results/RegexEntities.cs')
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/PrebuiltEntities.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/PrebuiltEntities.cs')}`])
    .it('Generates prebuilt entities correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/PrebuiltEntities.cs', '../../../fixtures/generate/results/PrebuiltEntities.cs')
    })

  test
    .stderr()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/invalid.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/invalid.cs')}`])
    .it('Throws expected error if invalid JSON', async ctx => {
      expect(ctx.stderr).to.include('Invalid LUIS JSON file content.')
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/FlightBooking.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/FlightBooking.cs')}`])
    .it('FlightBooking sample json generated correct cs class', async () => {
      await compareSourceFiles('../../../fixtures/generate/FlightBooking.cs', '../../../fixtures/generate/results/FlightBooking.cs')
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/Intents.json')}`])
    .it('Prints to console if no --out', async ctx => {
      expect(ctx.stdout).to.include('Generating file at stdout')
      expect(ctx.stdout).to.include('// <auto-generated>')
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/SimpleEntities.json')}`,
      '--className',
      'Test.Namespace.NameOfTheClass',
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/')}`])
    .it('Generates class with namespace correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/NameSpaceClass.cs', '../../../fixtures/generate/results/NameOfTheClass.cs')
    })
})
