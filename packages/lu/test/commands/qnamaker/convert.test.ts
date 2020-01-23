import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path') 
const NEWLINE = require('os').EOL

const compareLuFiles = async function(file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, "\n")
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, "\n")
  return result === fixtureFile
}

const parseJsonFiles = async function(file1: string, file2: string) {
  let result = await fs.readJson(path.join(__dirname, file1))
  let fixtureFile = await fs.readJson(path.join(__dirname, file2))
  result = sanitizeExampleJson(JSON.stringify(result))
  fixtureFile = sanitizeExampleJson(JSON.stringify(fixtureFile))
  return [JSON.parse(result), JSON.parse(fixtureFile)]
}

function sanitizeExampleJson(fileContent: string) {
  let escapedExampleNewLine = JSON.stringify('\r\n').replace(/"/g, '').replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  let escapedNewLine = JSON.stringify(NEWLINE).replace(/"/g, '');
  return fileContent.replace(new RegExp(escapedExampleNewLine, 'g'), escapedNewLine);
}

describe('qnamaker:convert', () => {
  before(async function(){
    await fs.mkdirp(path.join(__dirname, './../../../results/'))
  })

  after(async function(){
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
  .stdout()
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/qnaDocuments.json')}`])
  .it('qnamaker:convert refresh command successfully reconstructs a markdown file from a QnA input file with qnaDocuments section', async (ctx) => {
    expect(ctx.stdout).to.contain('> !# @qna.pair.source = custom editorial')
  })

  test
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/verified/all-qna.json')}`, '--out', './results/qna.lu'])
  .it('qnamaker:convert refresh command successfully reconstructs a markdown file from QnA input file', async () => {
    expect(await compareLuFiles('./../../../results/qna.lu', './../../fixtures/verified/allGenQnA.lu')).to.be.true
  })

  test
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/all.qna')}`, '--out', './results/qna2.json', '--name', 'all-qna'])
  .it('qnamaker:convert all concepts of lu file definition is parsed correctly  [QnA]', async () => {
    let parsedObjects = await parseJsonFiles('./../../../results/qna2.json', './../../fixtures/verified/all-qna.json')
    expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
  })

  test
  .stdout()
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/qna-alterations.lu')}`])
  .it('qnamaker:convert Successfully spits out qnamaker alterations list when specified in .lu files', async (ctx) => {
    expect(ctx.stdout).to.contain('"wordAlterations": [')
  })

  test
  .stderr()
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid-alterations.lu')}`])
  .it('qnamaker:convert Throws when an invalid QnA Maker alteration is specified in the input .lu file', async (ctx) => {
    expect(ctx.stderr).to.contain("[ERROR] line 2:0 - line 2:13: Invalid list entity line, did you miss '-' at line begin")
  })

  test
  .stderr()
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/collate')}`, '--out', './results/qna3.json', '--name', 'collate-qna'])
  .it('qnamaker:convert Collate can correctly merge QnA content split across LU files', async () => {
    let parsedObjects = await parseJsonFiles('./../../../results/qna3.json', './../../fixtures/verified/collate-qna.json')
    expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
  })

  test
  .stderr()
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/collate')}`, '--out', './results/qna4.json', '--name', 'collate-qna'])
  .it('qnamaker:convert Collate can correctly merge QnA word alteration content split across LU files', async () => {
    let parsedObjects = await parseJsonFiles('./../../../results/alterations_qna4.json', './../../fixtures/verified/alterations_qna4.json')
    expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
  })

  test
  .stderr()
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/qnaref.qna')}`, '--out', './results/qna5.json'])
  .it('qnamaker:convert Deep file references are pulled in correctly', async () => {
    let parsedObjects = await parseJsonFiles('./../../../results/qna5.json', './../../fixtures/verified/qna5.json')
    expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
  })
})

describe('qnamaker:convert with --sort option', () => {
  before(async function(){
    await fs.mkdirp(path.join(__dirname, './../../../results/'))
  })

  after(async function(){
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
  .stderr()
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/all_qna.json')}`, '--out', './results/qna5.lu', '--sort'])
  .it('qnamaker:convert With -r/ --sort option, correctly sorts a QnA model', async () => {
    expect(await compareLuFiles('./../../../results/qna5.lu', './../../fixtures/verified/qna_sorted.lu')).to.be.true
  })

  test
  .stderr()
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/qna-alterations_Alterations.json')}`, '--out', './results/qna6.lu', '--sort', '--alterations'])
  .it('qnamaker:convert With -r/ --sort option, correctly sorts a QnA Alteration model', async () => {
    expect(await compareLuFiles('./../../../results/qna6.lu', './../../fixtures/verified/qna_a_sorted.lu')).to.be.true
  })
})

describe('qnamaker:convert file creation', () => {
  test
  .stderr()
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/verified/all-qna.json')}`, '--out', '/testfolder/qna.lu'])
  .it('qnamaker:convert refresh command successfully reconstructs a markdown file from QnA input file', async (ctx) => {
    expect(ctx.stderr).to.contain('Path not found:')
  })
})

describe('qnamaker:convert empty file handling', () => {
  test
  .stderr()
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/empty.lu')}`])
  .it('qnamaker:convert errors out on empty lu file', async (ctx) => {
    expect(ctx.stderr).to.contain('[ERROR] Cannot parse empty')
  })

  test
  .stderr()
  .command(['qnamaker:convert', '--in', `${path.join(__dirname, './../../fixtures/empty.json')}`])
  .it('qnamaker:convert errors out on empty json file', async (ctx) => {
    expect(ctx.stderr).to.contain('Sorry, error parsing content as QnA JSON\n')
  })
})
