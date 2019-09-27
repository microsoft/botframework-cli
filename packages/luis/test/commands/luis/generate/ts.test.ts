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

describe('luis:generate:ts', () => {
  before(async function () {
    await fs.ensureDir(path.join(__dirname, '../../../fixtures/generate/results'))
  })

  after(async function () {
    await fs.emptyDir(path.join(__dirname, '../../../fixtures/generate/results'))
  })


  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/Intents.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/intents.ts')}`])
    .it('Generates intents correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/intents.ts', '../../../fixtures/generate/results/intents.ts')
    })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/SimpleEntities.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/simple-entities.ts')}`])
    .it('Generates simple entities correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/simple-entities.ts', '../../../fixtures/generate/results/simple-entities.ts')
    })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/CompositeEntities.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/composite-entities.ts')}`])
    .it('Generates composites entities correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/composite-entities.ts', '../../../fixtures/generate/results/composite-entities.ts')
    })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/ClosedLists.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/closed-lists.ts')}`])
    .it('Generates closed lists entities correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/closed-lists.ts', '../../../fixtures/generate/results/closed-lists.ts')
    })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/PatternEntities.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/pattern-entities.ts')}`])
    .it('Generates pattern entities correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/pattern-entities.ts', '../../../fixtures/generate/results/pattern-entities.ts')
    })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/RegexEntities.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/regex-entities.ts')}`])
    .it('Generates regex entities correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/regex-entities.ts', '../../../fixtures/generate/results/regex-entities.ts')
    })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, '../../../fixtures/generate/PrebuiltEntities.json')}`,
      '--out',
      `${path.join(__dirname, '../../../fixtures/generate/results/prebuilt-entities.ts')}`])
    .it('Generates prebuilt entities correctly', async () => {
      await compareSourceFiles('../../../fixtures/generate/prebuilt-entities.ts', '../../../fixtures/generate/results/prebuilt-entities.ts')
    })

})
