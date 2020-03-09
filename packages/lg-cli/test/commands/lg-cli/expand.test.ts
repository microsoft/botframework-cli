import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')

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

describe('mslg:expand lg template', async () => {

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

    let fileName = '4.lg'

    // test expand all templates
    test
    .command(['mslg:expand',
    '--in', path.join(__dirname, testcaseFolderPath, fileName),
    '--out', generatedFolder,
    '--all',
    '-r',
    '-f'])
    .it('', async () => {
        await compareLgFiles(path.join(generatedFolderPath, '4.expand.lg'), path.join(verifiedFolderPath, '4.expand.lg'))
    })

    // test expand specific templates
    test
    .command(['mslg:expand',
    '--in', path.join(__dirname, testcaseFolderPath, fileName),
    '--out', generatedFolder,
    '--template','template',
    '-r',
    '-f'])
    .it('', async () => {
        await compareLgFiles(path.join(generatedFolderPath, '4.expand.lg'), path.join(verifiedFolderPath, '4.template.expand.lg'))
    })

    // test expand inline template
    test
    .command(['mslg:expand',
    '--in', path.join(__dirname, testcaseFolderPath, fileName),
    '--out', generatedFolder,
    '--expression','${welcome()}',
    '-r',
    '-f'])
    .it('', async () => {
        await compareLgFiles(path.join(generatedFolderPath, '4.expand.lg'), path.join(verifiedFolderPath, '4.inline.expand.lg'))
    })

    // test testInput
    test
    .command(['mslg:expand',
    '--in', path.join(__dirname, testcaseFolderPath, '5.lg'),
    '--out', generatedFolder,
    '--template','template',
    '--testInput', path.join(__dirname, testcaseFolderPath, 'data.json'),
    '-r',
    '-f'])
    .it('', async () => {
        await compareLgFiles(path.join(generatedFolderPath, '5.expand.lg'), path.join(verifiedFolderPath, '5.testinput.expand.lg'))
    })
})
