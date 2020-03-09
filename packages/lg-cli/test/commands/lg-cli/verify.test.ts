import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')
const nock = require('nock')

const compareLgFiles = async function (file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, '\n')
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, '\n')
  expect(result).to.deep.equal(fixtureFile)
}

const  testcaseFolderPath = './../../fixtures/testcase'
const  generatedFolderPath = './../../fixtures/generated'
const  verifiedFolderPath = './../../fixtures/verified'
const  generatedFolder = path.join(__dirname, generatedFolderPath)

describe('mslg:verify lg file', async () => {

    after(async function(){
        //await fs.remove(generatedFolder)
        })

    before(async function(){
        //await fs.remove(generatedFolder)
        //await fs.mkdir(generatedFolder)
        if (!await fs.exists(generatedFolder)) {
            await fs.mkdir(generatedFolder)
        }
    })

    let fileName = '3.error.lg'

    test
    .command(['mslg:verify',
    '--in', path.join(__dirname, testcaseFolderPath, fileName),
    '--out', generatedFolder,
    '-r',
    '-f'])
    .it('', async () => {
        await compareLgFiles(path.join(generatedFolderPath, '3.error.diagnostic.txt'), path.join(verifiedFolderPath, '3.error.diagnostic.txt'))
    })
})
