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


describe('luis:convert', () => {
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../root.lu'))
    await fs.remove(path.join(__dirname, './../../../root.json'))
  })

  test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/test269-d.json')}`, '--out', 'root.lu'])
    .it('luis:convert successfully reconstructs a markdown file from a LUIS input file with out of order entity references', async () => {
      expect(await compareLuFiles('./../../../root.lu', './../../fixtures/verified/test269-d.lu')).to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/verified/all.json')}`, '--out', 'root.lu'])
    .it('luis:convert successfully reconstructs a markdown file from a LUIS input file', async () => {
      expect(await compareLuFiles('./../../../root.lu', './../../fixtures/verified/allGen.lu')).to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/verified/plFeatures.json')}`, '--out', 'root.lu'])
    .it('luis:convert successfully reconstructs a markdown file from a LUIS input file (phrase list as feature)', async () => {
      expect(await compareLuFiles('./../../../root.lu', './../../fixtures/verified/plFeatures.lu')).to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/verified/modelAsFeatures.json')}`, '--out', 'root.lu'])
    .it('luis:convert successfully reconstructs a markdown file from a LUIS input file (model as features)', async () => {
      expect(await compareLuFiles('./../../../root.lu', './../../fixtures/verified/modelAsFeatureGen.lu')).to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/1.lu')}`, '--out', 'root.json', '--name', '1'])
    .it('luis:convert Simple intent and utterances are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/1.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/3.lu')}`, '--out', `${path.join(__dirname, './../../../root.json')}`, '--name', '3'])
    .it('luis:convert Multiple intent and utterance definition sections are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/3.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/4.lu')}`, '--out', 'root.json', '--name', '4'])
    .it('luis:convert Uttearnces with labelled values are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/4.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/5.lu')}`, '--out', 'root.json', '--name', '5'])
    .it('luis:convert Simple entity declaration is parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/5.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/6.lu')}`, '--out', 'root.json', '--name', '6'])
    .it('luis:convert Prebuilt entity types are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/6.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/7.lu')}`, '--out', 'root.json', '--name', '7'])
    .it('luis:convert Pattern.any entity types are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/7.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/9.lu')}`, '--out', 'root.json', '--name', '9'])
    .it('luis:convert List entity types are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/9.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/9a.lu')}`, '--out', 'root.json', '--name', '9a'])
    .it('luis:convert list entity definitions and intent definitions can be split up and will be parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/9a.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/buyChocolate.lu')}`, '--out', 'root.json', '--name', 'buyChocolate'])
    .it('luis:convert with single file references are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/buyChocolate.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/11.lu')}`, '--out', 'root.json', '--name', '11'])
    .it('luis:convert with multiple file references are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/11.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/12.lu')}`, '--out', 'root.json', '--name', '12'])
    .it('luis:convert with multiple file references are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/12.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/examples/all.lu')}`, '--out', 'root.json', '--name', 'all'])
    .it('luis:convert all concepts of lu file definition are parsed correctly [LUIS]', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/all.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/all-entity-types.lu')}`, '--out', 'root.json', '--name', 'all-entity-types'])
    .it('luis:convert all entity types are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/all-entity-types.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/missing-utterance.lu')}`, '--log'])
    .it('luis:convert writes out a warning when no utterances are found for an intent', async (ctx) => {
      expect(ctx.stdout).to.contain('[WARN] line 1:0 - line 1:10: no utterances found for intent definition: "# Greeting"')
    })

    test
    .stderr()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid-entity-definition.lu')}`])
    .it('luis:convert writes out an error when invalid entity definition is found', async (ctx) => {
      expect(ctx.stderr).to.contain("[ERROR] line 1:9 - line 1:10: syntax error: missing ':' at '='")
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/missing-synonyms.lu')}`, '--log'])
    .it('luis:convert writes out a warning when no synonym definitions are found for a list entity', async (ctx) => {
    expect(ctx.stdout).to.contain('[WARN] line 1:0 - line 1:14: no synonyms list found for list entity definition: "$TestList:one="')
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/collate')}`, '--out', 'root.json', '--name', 'collated-luis'])
    .it('luis:convert Collate can correctly merge LUIS content split across LU files', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/collated-luis.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref1.lu')}`, '--out', 'root.json', '--name', 'ref1'])
    .it('luis:convert Deep references in lu files - intent references are handled correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/ref1.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref4.lu')}`, '--out', 'root.json', '--name', 'ref4'])
    .it('luis:convert Deep references in lu files - QnA question references are handled correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/ref4.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref5.lu')}`, '--out', 'root.json', '--name', 'ref5'])
    .it('luis:convert Deep references in lu files - QnA question references when a wildcard is specified is handled correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/ref5.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref6.lu')}`, '--out', 'root.json', '--name', 'ref6'])
    .it('luis:convert Deep references in lu files - *utterances* wild card is handled corectly ref6', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/ref6.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref7.lu')}`, '--out', 'root.json', '--name', 'ref7'])
    .it('luis:convert Deep references in lu files - *utterances* wild card is handled corectly ref7', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/ref7.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref8.lu')}`, '--out', 'root.json', '--name', 'ref8'])
    .it('luis:convert Deep references in lu files - *utterances* wild card is handled corectly ref8', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/ref8.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref9.lu')}`, '--out', 'root.json'])
    .it('luis:convert parseFile correctly adds pattern entities for referenced patterns', async () => {
      let result = await fs.readJson(path.join(__dirname, './../../../root.json'))
      expect(result.patterns.length === 2).to.be.true
      expect(result.patternAnyEntities.length === 1).to.be.true
      expect(result.patternAnyEntities[0].name === 'alarmTime').to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/ref10.lu')}`, '--out', 'root.json'])
    .it('luis:convert parseFile doesnt add pattern entity for referenced patterns if same entity name exists in original file', async () => {
      let result = await fs.readJson(path.join(__dirname, './../../../root.json'))
      expect(result.patterns.length === 2).to.be.true
      expect(result.patternAnyEntities.length === 0).to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/regexmodel.luis')}`, '--out', 'root.lu'])
    .it('luis:convert Regex entity references in a model file can be refreshed correctly using ludown refresh', async () => {
      expect(await compareLuFiles('./../../../root.lu', './../../fixtures/verified/regexmodel.lu')).to.be.true
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/prebuilt-entity.lu')}`, '--out', 'root.json', '--culture', 'EN-US', '--name', 'prebuilt-entity'])
    .it('luis:convert Pre-built entities are resolved correctly when mixed case culture is specified', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/prebuilt-entity.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/prebuilt-entity.lu')}`, '--out', 'root.json', '--culture', 'EN-US', '--name', 'prebuilt-entity'])
    .it('luis:convert Pre-built entities are resolved correctly when mixed case culture is specified', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/prebuilt-entity.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/verified/prebuilt_mode.lu')}`, '--out', 'root.json'])
    .it('luis:convert Prebuilt models are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/prebuilt_model_parse.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/verified/calendar_all_prebuilt.lu')}`, '--out', 'root.json'])
    .it('luis:convert Multiple Prebuilt models are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/calendar_all_prebuilt_parsed.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/root.lu')}`, '--out', 'root.json', '--name', 'root'])
    .it('luis:convert [LUIS] with references specified via /* are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/root_luis.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/root2.lu')}`, '--out', 'root.json', '--name', 'root2'])
    .it('luis:convert [LUIS] with references specified via /** are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/root2_luis.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/root3.lu')}`, '--out', 'root.lu', '--name', 'root3'])
    .it('luis:convert [LUIS] utterances with () without deep link references are parsed correctly', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.lu', './../../fixtures/verified/root3.lu')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid_prebuilt_2.lu')}`])
    .it('luis:convert Invalid entity inherits information is skipped (prebuilt 2)', async (ctx) => {
      expect(ctx.stdout).to.contain(`Skipping "> !# @entity.inherits = name : Web.WebSearch"`)
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid_prebuilt_1.lu')}`])
    .it('luis:convert Invalid intent inherits information is skipped (prebuilt 1)', async (ctx) => {
      expect(ctx.stdout).to.contain(`Skipping "> !# @intent.inherits = name : Web.WebSearch"`)
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid_prebuilt_3.lu')}`, '--log'])
    .it('luis:convert Invalid entity inherits information is skipped (prebuilt 3)', async (ctx) => {
      expect(ctx.stdout).to.contain(`Skipping "> !# @entity.inherits2 = name : Web.WebSearch"`)
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid_prebuilt_4.lu')}`, '--log'])
    .it('luis:convert Invalid intent inherits information is skipped (prebuilt 4)', async (ctx) => {
      expect(ctx.stdout).to.contain(`Skipping "> !# @intent.inherits2 = name : Web.WebSearch"`)
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid_model.lu')}`, '--log'])
    .it('luis:convert Invalid intent inherits information is skipped (invalid model)', async (ctx) => {
      expect(ctx.stdout).to.contain(`Skipping "> !# @app = test"`)
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/section_enabled.lu')}`, '--out', 'root.json',])
    .it('luis:convert section enabled lu file', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/section_enabled.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/section_enabled2.lu')}`, '--out', 'root.json',])
    .it('luis:convert section enabled lu file with new entity inside and outside section', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/section_enabled2.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })

    test
    .stdout()
    .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/merge_intents_disabled.lu')}`, '--out', 'root.json',])
    .it('luis:convert section enabled lu file', async () => {
      let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/merge_intents_disabled.json')
      expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
    })
})   

describe('luis:convert negative tests', () => {
  test
  .stderr()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/bad3.lu')}`])
  .it('luis:convert should show ERR message when no utterances are found for an intent', async (ctx) => {
    expect(ctx.stderr).to.contain("[ERROR] line 4:0 - line 4:1: syntax error: invalid input 'i' detected.")
  })

  test
  .stderr()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/bad3a.lu')}`])
  .it('luis:convert should show ERR message when no labelled value is found for an entity', async (ctx) => {
    expect(ctx.stderr).to.contain('[ERROR] line 4:0 - line 4:19: No labelled value found for entity: "tomato" in utterance: "-i wangt {tomato=}"')
  })

  test
  .stderr()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/bad2.lu')}`])
  .it('luis:convert should show ERR message when no labelled value is found for an entity', async (ctx) => {
    expect(ctx.stderr).to.contain("[ERROR] line 1:0 - line 1:1: syntax error: invalid input 'f' detected.")
  })
})

describe('luis:convert VA skill lu files', () => {
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../root.json'))
  })

  test
  .stdout()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/Skills/Calendar')}`, '--out', 'root.json', '--name', 'Calendar'])
  .it('luis:convert Calendar skill LU file parses correctly', async (ctx) => {
    let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/Skills/Calendar.json')
    expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
 })

  test
  .stdout()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/Skills/Email')}`, '--out', 'root.json', '--name', 'Email'])
  .it('luis:convert Email skill LU file parses correctly', async (ctx) => {
    let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/Skills/Email.json')
    expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
  })

  test
  .stdout()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/Skills/Todo')}`, '--out', 'root.json', '--name', 'General'])
  .it('luis:convert Todo skill LU file parses correctly', async (ctx) => {
    let parsedObjects = await parseJsonFiles('./../../../root.json', './../../fixtures/verified/Skills/Todo.json')
    expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])})
})

describe('luis:convert sort option enabled', () => {
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../root.lu'))
  })

  test
  .stdout()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/all.json')}`, '--out', 'root.lu', '--sort'])
  .it('luis:convert With -r/ --sort option, correctly sorts a LUIS model', async () => {
    expect(await compareLuFiles('./../../../root.lu', './../../fixtures/verified/luis_sorted.lu')).to.be.true
  })
})

describe('luis:convert new entity format', () => {
  after(async function() {
    await fs.remove(path.join(__dirname, './../../../newEntity.lu'))
  })

  test
  .stdout()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/newEntity1.json')}`, '--out', 'newEntity.lu'])
  .it('luis:convert with new entity format correctly produces a LU file', async () => {
    expect(await compareLuFiles('./../../../newEntity.lu', './../../fixtures/verified/newEntity1.lu')).to.be.true
  })

  test
  .stdout()
  .command(['luis:convert', '--in', `${path.join(__dirname, './../../fixtures/testcases/newEntity2.json')}`, '--out', 'newEntity.lu'])
  .it('luis:convert with new entity format and single roles correctly produces a LU file', async () => {
    expect(await compareLuFiles('./../../../newEntity.lu', './../../fixtures/verified/newEntity2.lu')).to.be.true
  })
})

