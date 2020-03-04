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
const translatekey = 'edabe9fb17244f6a92ec617867e6d7cd'

describe('mslg:translate lg file', async () => {

    after(async function(){
        //await fs.remove(generatedFolder)
        })

    before(async function(){
        await fs.remove(generatedFolder)
        await fs.mkdir(generatedFolder)
    })

    // basic translate for fr
    let fileName = 'base.lg'
    const fr = 'fr'

    test
    .command(['mslg:translate',
    '--translatekey', translatekey,
    '--in', path.join(__dirname, testcaseFolderPath, fileName),
    '--tgtlang', fr,
    '--out', generatedFolder])
    .it('', async () => {
        await compareLgFiles(path.join(generatedFolderPath, fr, fileName), path.join(verifiedFolderPath, fr, fileName))
    })

    // basic translate for zh-cn
    const zhcn = 'zh-cn'

    test
    .command(['mslg:translate',
    '--translatekey', translatekey,
    '--in', path.join(__dirname, testcaseFolderPath, fileName),
    '--tgtlang', zhcn,
    '--out', generatedFolder])
    .it('', async () => {
        await compareLgFiles(path.join(generatedFolderPath, zhcn, fileName), path.join(verifiedFolderPath, zhcn, fileName))
    })

    // test translate_comments option
    const commentFileName = 'base.comments.lg'
    test
    .command(['mslg:translate',
    '--translatekey', translatekey,
    '--in', path.join(__dirname, testcaseFolderPath, fileName),
    '--tgtlang', zhcn,
    '--out', generatedFolder,
    '--translate_comments'])
    .it('', async () => {
        await compareLgFiles(path.join(generatedFolderPath, zhcn, commentFileName), path.join(verifiedFolderPath, zhcn, commentFileName))
    })

    // test translate_link_text option
    const linkFileName = 'base.link.lg'
    test
    .command(['mslg:translate',
    '--translatekey', translatekey,
    '--in', path.join(__dirname, testcaseFolderPath, fileName),
    '--tgtlang', zhcn,
    '--out', generatedFolder,
    '--translate_link_text'])
    .it('', async () => {
        await compareLgFiles(path.join(generatedFolderPath, zhcn, commentFileName), path.join(verifiedFolderPath, zhcn, commentFileName))
    })
})
