import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')

const compareSourceFiles = async function (file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, '\n')
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, '\n')
  return result === fixtureFile
}

describe('luis:generate:cs', () => {
  after(async function () {
    await fs.emptyDir(path.join(__dirname, 'test_data/result'))
  })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, 'test_data/Intents.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/Intents.cs')}`])
    .it('Generates intents correctly', async () => {
      expect(await compareSourceFiles('test_data/Intents.cs', 'test_data/result/Intents.cs')).to.be.true
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, 'test_data/SimpleEntities.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/SimpleEntities.cs')}`])
    .it('Generates simple entities correctly', async () => {
      expect(await compareSourceFiles('test_data/SimpleEntities.cs', 'test_data/result/SimpleEntities.cs')).to.be.true
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, 'test_data/CompositeEntities.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/CompositeEntities.cs')}`])
    .it('Generates composites entities correctly', async () => {
      expect(await compareSourceFiles('test_data/CompositeEntities.cs', 'test_data/result/CompositeEntities.cs')).to.be.true
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, 'test_data/ClosedLists.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/ClosedLists.cs')}`])
    .it('Generates closed lists entities correctly', async () => {
      expect(await compareSourceFiles('test_data/ClosedLists.cs', 'test_data/result/ClosedLists.cs')).to.be.true
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, 'test_data/PatternEntities.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/PatternEntities.cs')}`])
    .it('Generates pattern entities correctly', async () => {
      expect(await compareSourceFiles('test_data/PatternEntities.cs', 'test_data/result/PatternEntities.cs')).to.be.true
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, 'test_data/RegexEntities.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/RegexEntities.cs')}`])
    .it('Generates regex entities correctly', async () => {
      expect(await compareSourceFiles('test_data/RegexEntities.cs', 'test_data/result/RegexEntities.cs')).to.be.true
    })

  test
    .stdout()
    .command(['luis:generate:cs',
      '--in',
      `${path.join(__dirname, 'test_data/PrebuiltEntities.json')}`,
      '--out',
      `${path.join(__dirname, 'test_data/result/PrebuiltEntities.cs')}`])
    .it('Generates prebuilt entities correctly', async () => {
      expect(await compareSourceFiles('test_data/PrebuiltEntities.cs', 'test_data/result/PrebuiltEntities.cs')).to.be.true
    })
})
