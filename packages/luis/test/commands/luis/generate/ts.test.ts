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
  after(async function () {
    await fs.emptyDir(path.join(__dirname, 'test_data/result'))
  })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, 'test_data/Intents.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/intents.ts')}`])
    .it('Generates intents correctly', async () => {
      await compareSourceFiles('test_data/intents.ts', 'test_data/result/intents.ts')
    })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, 'test_data/SimpleEntities.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/simple-entities.ts')}`])
    .it('Generates simple entities correctly', async () => {
      await compareSourceFiles('test_data/simple-entities.ts', 'test_data/result/simple-entities.ts')
    })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, 'test_data/CompositeEntities.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/composite-entities.ts')}`])
    .it('Generates composites entities correctly', async () => {
      await compareSourceFiles('test_data/composite-entities.ts', 'test_data/result/composite-entities.ts')
    })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, 'test_data/ClosedLists.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/closed-lists.ts')}`])
    .it('Generates closed lists entities correctly', async () => {
      await compareSourceFiles('test_data/closed-lists.ts', 'test_data/result/closed-lists.ts')
    })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, 'test_data/PatternEntities.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/pattern-entities.ts')}`])
    .it('Generates pattern entities correctly', async () => {
      await compareSourceFiles('test_data/pattern-entities.ts', 'test_data/result/pattern-entities.ts')
    })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, 'test_data/RegexEntities.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/regex-entities.ts')}`])
    .it('Generates regex entities correctly', async () => {
      await compareSourceFiles('test_data/regex-entities.ts', 'test_data/result/regex-entities.ts')
    })

  test
    .stdout()
    .command(['luis:generate:ts',
      '--in',
      `${path.join(__dirname, 'test_data/PrebuiltEntities.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/prebuilt-entities.ts')}`])
    .it('Generates prebuilt entities correctly', async () => {
      await compareSourceFiles('test_data/prebuilt-entities.ts', 'test_data/result/prebuilt-entities.ts')
    })

})
