import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')
const NEWLINE = require('os').EOL

const compareLuFiles = async function(file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, "\n")
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, "\n")
  expect(fixtureFile).to.deep.equal(result)
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


describe('luis:convert', () => {
  before(async function(){
    await fs.ensureDir(path.join(__dirname, './../../../results/'))
  })

  after(async function(){
    await fs.remove(path.join(__dirname, './../../../results/'))
  })


    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/buyChocolate.lu')}`, '--out', './results/root14.json', '--name', 'buyChocolate'])
    .it('luis:convert with single file references are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root14.json', './../../fixtures/verified/buyChocolate.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/11.lu')}`, '--out', './results/root15.json', '--name', '11'])
    .it('luis:convert with multiple file references are parsed correctly1', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root15.json', './../../fixtures/verified/11.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/12.lu')}`, '--out', './results/root16.json', '--name', '12'])
    .it('luis:convert with multiple file references are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root16.json', './../../fixtures/verified/12.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/all.lu')}`, '--out', './results/root17.json', '--name', 'all'])
    .it('luis:convert all concepts of lu file definition are parsed correctly [LUIS]', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root17.json', './../../fixtures/verified/all.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/all-entity-types.lu')}`, '--out', './results/root18.json', '--name', 'all-entity-types'])
    .it('luis:convert all entity types are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root18.json', './../../fixtures/verified/all-entity-types.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/missing-utterance.lu')}`, '--log'])
    .it('luis:convert writes out a warning when no utterances are found for an intent', async (ctx: any) => {
      expect(ctx.stdout).to.contain('[WARN] line 1:0 - line 1:10: no utterances found for intent definition: "# Greeting"')
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/missing-utterance2.lu')}`, '--log'])
    .it('luis:convert writes out a warning when no utterances are found for an intent from nestedIntentSection name', async (ctx) => {
      expect(ctx.stdout).to.contain('[WARN] line 1:0 - line 1:10: no utterances found for intent definition: "# Greeting"')
    })

    test
    .stderr()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid-entity-definition.lu')}`])
    .it('luis:convert writes out an error when invalid entity definition is found', async (ctx: any) => {
      expect(ctx.stderr).to.contain("syntax error: missing ':'")
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/missing-synonyms.lu')}`, '--log'])
    .it('luis:convert writes out a warning when no synonym definitions are found for a list entity', async (ctx: any) => {
    expect(ctx.stdout).to.contain('[WARN] line 1:0 - line 1:14: no synonyms list found for list entity definition: "$TestList:one="')
    })

    test
    .stderr()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/utterance-without-hyphen.lu')}`])
    .it('luis:convert writes out an error when utterance without hyphen is found', async (ctx: any) => {
      expect(ctx.stderr).to.contain("[ERROR] line 2:0 - line 2:16: Invalid intent body line, did you miss '-' at line begin")
      expect(ctx.stderr).to.contain("[ERROR] line 6:0 - line 6:16: Invalid intent body line, did you miss '-' at line begin")
    })

    test
    .stderr()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/list-entity-body-without-hyphen.lu')}`])
    .it('luis:convert writes out an error when list entity body without hyphen is found', async (ctx: any) => {
      expect(ctx.stderr).to.contain("[ERROR] line 5:0 - line 5:2: Invalid list entity line, did you miss '-' at line begin")
      expect(ctx.stderr).to.contain("[ERROR] line 8:0 - line 8:2: Invalid list entity line, did you miss '-' at line begin")
    })

    test
    .stderr()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/qna-question-line-without-hyphen.lu')}`])
    .it('luis:convert writes out an error when list qna question line without hyphen is found', async (ctx: any) => {
      expect(ctx.stderr).to.contain("[ERROR] line 2:0 - line 2:10: Invalid QnA question line, did you miss '-' at line begin")
    })

    test
    .stderr()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/qna-filter-line-without-hyphen.lu')}`])
    .it('luis:convert writes out an error when list qna filter line without hyphen is found', async (ctx: any) => {
      expect(ctx.stderr).to.contain("[ERROR] line 6:0 - line 6:16: Invalid QnA filter line, did you miss '-' at line begin")
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/collate')}`, '--out', './results/root19.json', '--name', 'collated-luis'])
    .it('luis:convert Collate can correctly merge LUIS content split across LU files', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root19.json', './../../fixtures/verified/collated-luis.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref1.lu')}`, '--out', './results/root20.json', '--name', 'ref1'])
    .it('luis:convert Deep references in lu files - intent references are handled correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root20.json', './../../fixtures/verified/ref1.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref4.lu')}`, '--out', './results/root21.json', '--name', 'ref4'])
    .it('luis:convert Deep references in lu files - QnA question references are handled correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root21.json', './../../fixtures/verified/ref4.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref5.lu')}`, '--out', './results/root22.json', '--name', 'ref5'])
    .it('luis:convert Deep references in lu files - QnA question references when a wildcard is specified is handled correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root22.json', './../../fixtures/verified/ref5.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref6.lu')}`, '--out', './results/root23.json', '--name', 'ref6'])
    .it('luis:convert Deep references in lu files - *utterances* wild card is handled corectly ref6', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root23.json', './../../fixtures/verified/ref6.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref7.lu')}`, '--out', './results/root24.json', '--name', 'ref7'])
    .it('luis:convert Deep references in lu files - *utterances* wild card is handled corectly ref7', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root24.json', './../../fixtures/verified/ref7.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref8.lu')}`, '--out', './results/root25.json', '--name', 'ref8'])
    .it('luis:convert Deep references in lu files - *utterances* wild card is handled corectly ref8', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root25.json', './../../fixtures/verified/ref8.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref9.lu')}`, '--out', './results/root26.json'])
    .it('luis:convert parseFile correctly adds pattern entities for referenced patterns', async () => {
      let result = await fs.readJson(path.join(__dirname, './../../../results/root26.json'))
      expect(result.patterns.length === 2).to.be.true
      expect(result.patternAnyEntities.length === 1).to.be.true
      expect(result.patternAnyEntities[0].name === 'alarmTime').to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref10.lu')}`, '--out', './results/root27.json'])
    .it('luis:convert parseFile doesnt add pattern entity for referenced patterns if same entity name exists in original file', async () => {
      let result = await fs.readJson(path.join(__dirname, './../../../results/root27.json'))
      expect(result.patterns.length === 2).to.be.true
      expect(result.patternAnyEntities.length === 0).to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref11.lu')}`, '--out', './results/root27_a.json'])
    .it('luis:convert deep file reference with *utterances* only pulls in utterances and not patterns from that intent.', async () => {
      let result = await fs.readJson(path.join(__dirname, './../../../results/root27_a.json'))
      expect(result.patterns.length === 0).to.be.true
      expect(result.utterances.length === 1).to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref12.lu')}`, '--out', './results/root27_b.json'])
    .it('luis:convert deep file reference with *pattterns* only pulls in pattterns and not utterances from that intent.', async () => {
      let result = await fs.readJson(path.join(__dirname, './../../../results/root27_b.json'))
      expect(result.patterns.length === 1).to.be.true
      expect(result.utterances.length === 0).to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref13.lu')}`, '--out', './results/root27_c.json'])
    .it('luis:convert deep file reference with #*utterances* pulls in all utterances from the src file.', async () => {
      let result = await fs.readJson(path.join(__dirname, './../../../results/root27_c.json'))
      expect(result.patterns.length === 0).to.be.true
      expect(result.utterances.length === 2).to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/regexmodel.luis')}`, '--out', './results/root28.lu'])
    .it('luis:convert Regex entity references in a model file can be refreshed correctly using ludown refresh', async () => {
      expect(await compareLuFiles('./../../../results/root28.lu', './../../fixtures/verified/regexmodel.lu')).to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/prebuilt-entity.lu')}`, '--out', './results/root29.json', '--culture', 'EN-US', '--name', 'prebuilt-entity'])
    .it('luis:convert Pre-built entities are resolved correctly when mixed case culture is specified', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root29.json', './../../fixtures/verified/prebuilt-entity.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/prebuilt-entity.lu')}`, '--out', './results/root30.json', '--culture', 'EN-US', '--name', 'prebuilt-entity'])
    .it('luis:convert Pre-built entities are resolved correctly when mixed case culture is specified', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root30.json', './../../fixtures/verified/prebuilt-entity.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/verified/prebuilt_mode.lu')}`, '--out', './results/root31.json'])
    .it('luis:convert Prebuilt models are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root31.json', './../../fixtures/verified/prebuilt_model_parse.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/verified/calendar_all_prebuilt.lu')}`, '--out', './results/root32.json'])
    .it('luis:convert Multiple Prebuilt models are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root32.json', './../../fixtures/verified/calendar_all_prebuilt_parsed.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/root.lu')}`, '--out', './results/root33.json', '--name', 'root'])
    .it('luis:convert [LUIS] with references specified via /* are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root33.json', './../../fixtures/verified/root_luis.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/root2.lu')}`, '--out', './results/root34.json', '--name', 'root2'])
    .it('luis:convert [LUIS] with references specified via /** are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root34.json', './../../fixtures/verified/root2_luis.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/root3.lu')}`, '--out', './results/root35.lu', '--name', 'root3'])
    .it('luis:convert [LUIS] utterances with () without deep link references are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root35.lu', './../../fixtures/verified/root3.lu')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .stderr()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid_prebuilt_2.lu')}`])
    .it('luis:convert Invalid entity inherits information is skipped (prebuilt 2)', async (ctx: any) => {
      expect(ctx.stdout).to.contain(`Skipping "> !# @entity.inherits = name : Web.WebSearch"`)
      expect(ctx.stderr).to.contain('No LU or Luis content parsed!')
    })

    test
    .stdout()
    .stderr()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid_prebuilt_1.lu')}`])
    .it('luis:convert Invalid intent inherits information is skipped (prebuilt 1)', async (ctx: any) => {
      expect(ctx.stdout).to.contain(`Skipping "> !# @intent.inherits = name : Web.WebSearch"`)
      expect(ctx.stderr).to.contain('No LU or Luis content parsed!')
    })

    test
    .stdout()
    .stderr()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid_prebuilt_3.lu')}`, '--log'])
    .it('luis:convert Invalid entity inherits information is skipped (prebuilt 3)', async (ctx: any) => {
      expect(ctx.stdout).to.contain(`Skipping "> !# @entity.inherits2 = name : Web.WebSearch"`)
      expect(ctx.stderr).to.contain('No LU or Luis content parsed!')
    })

    test
    .stdout()
    .stderr()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid_prebuilt_4.lu')}`, '--log'])
    .it('luis:convert Invalid intent inherits information is skipped (prebuilt 4)', async (ctx: any) => {
      expect(ctx.stdout).to.contain(`Skipping "> !# @intent.inherits2 = name : Web.WebSearch"`)
      expect(ctx.stderr).to.contain('No LU or Luis content parsed!')
    })

    test
    .stdout()
    .stderr()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid_model.lu')}`, '--log'])
    .it('luis:convert Invalid intent inherits information is skipped (invalid model)', async (ctx: any) => {
      expect(ctx.stdout).to.contain(`Skipping "> !# @app = test"`)
      expect(ctx.stderr).to.contain('No LU or Luis content parsed!')
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/special-char-in-entity-type.lu')}`, '--out', './results/root36.json', '--log'])
    .it('luis:convert entities with special chars in entity type line', async (ctx) => {
      let parsedObjects = await parseJsonFiles('./../../../results/root36.json', './../../fixtures/verified/special-char-in-entity-type.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/section_enabled.lu')}`, '--out', './results/root37.json',])
    .it('luis:convert section enabled lu file', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root37.json', './../../fixtures/verified/section_enabled.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/section_enabled2.lu')}`, '--out', './results/root38.json',])
    .it('luis:convert section enabled lu file with new entity inside and outside section', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root38.json', './../../fixtures/verified/section_enabled2.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/section_disabled.lu')}`, '--out', './results/root39.json',])
    .it('luis:convert section disabled lu file that contains section definition', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root39.json', './../../fixtures/verified/section_disabled.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/section_disabled2.lu')}`, '--out', './results/root40.json',])
    .it('luis:convert section disabled lu file with enableSections set to false', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root40.json', './../../fixtures/verified/section_disabled2.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/merge_intents_disabled.lu')}`, '--out', './results/root41.json',])
    .it('luis:convert section enabled lu file', async () => {
      let parsedObjects = await parseJsonFiles('./../../../results/root41.json', './../../fixtures/verified/merge_intents_disabled.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })
})   


describe('luis:convert VA skill lu files', function() {
  this.timeout(60000);
  before(async function(){
    await fs.mkdirp(path.join(__dirname, './../../../results/'))
  })

  after(async function(){
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
  .stdout()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/Skills/Calendar')}`, '--out', './results/root47.json', '--name', 'Calendar'])
  .it('luis:convert Calendar skill LU file parses correctly', async (ctx) => {
    let parsedObjects = await parseJsonFiles('./../../../results/root47.json', './../../fixtures/verified/Skills/Calendar.json')
    expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
 })

  test
  .stdout()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/Skills/Email')}`, '--out', './results/root48.json', '--name', 'Email'])
  .it('luis:convert Email skill LU file parses correctly', async (ctx) => {
    let parsedObjects = await parseJsonFiles('./../../../results/root48.json', './../../fixtures/verified/Skills/Email.json')
    expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
  })

  test
  .stdout()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/Skills/Todo')}`, '--out', './results/root49.json', '--name', 'General'])
  .it('luis:convert Todo skill LU file parses correctly', async (ctx) => {
    let parsedObjects = await parseJsonFiles('./../../../results/root49.json', './../../fixtures/verified/Skills/Todo.json')
    expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])})
})

describe('luis:convert sort option enabled', () => {
  before(async function(){
    await fs.mkdirp(path.join(__dirname, './../../../results/'))
  })

  after(async function(){
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
  .stdout()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/all.json')}`, '--out', './results/root50.lu', '--sort'])
  .it('luis:convert With -r/ --sort option, correctly sorts a LUIS model', async () => {
    expect(await compareLuFiles('./../../../results/root50.lu', './../../fixtures/verified/luis_sorted.lu')).to.be.true
  })
})

describe('luis:convert file creation', () => {
  test
  .stderr()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/newEntity1.json')}`, '--out', './newfolder/newEntity.lu'])
  .it('luis:convert throws error if path to write doesnt exist', async (ctx: any) => {
    expect(ctx.stderr).to.contain('Path not found:')
  })
})

describe('luis:convert empty file handling', () => {
  test
  .stderr()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/empty.lu')}`])
  .it('luis:convert errors out on empty lu file', async (ctx: any) => {
    expect(ctx.stderr).to.contain('[ERROR] Cannot parse empty')
  })

  test
  .stderr()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/empty.json')}`])
  .it('luis:convert errors out on empty json file', async (ctx: any) => {
    expect(ctx.stderr).to.contain('Sorry, error parsing content as Luis JSON\n')
  })
})