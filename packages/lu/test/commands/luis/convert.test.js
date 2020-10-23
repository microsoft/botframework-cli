const fs = require('fs-extra')
const path = require('path')
const NEWLINE = require('os').EOL
var chai = require('chai');
var assert = chai.assert;
const LuisBuilder = require('./../../../src/parser/luis/luisBuilder')

const loadLuFile = async function(filePath) {
    let fileContent = await fs.readFile(path.join(__dirname, filePath))
    return sanitize(fileContent)
}

const sanitize = function(content) {
    return content.toString().replace(/\r\n/g, "\n")
}
  
const loadJsonFile = async function(filePath) {
    let result = await fs.readJson(path.join(__dirname, filePath))
    result = sanitizeExampleJson(JSON.stringify(result))
    return JSON.parse(result)
}

function sanitizeExampleJson(fileContent) {
    let escapedExampleNewLine = JSON.stringify('\r\n').replace(/"/g, '').replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    let escapedNewLine = JSON.stringify(NEWLINE).replace(/"/g, '');
    return fileContent.replace(new RegExp(escapedExampleNewLine, 'g'), escapedNewLine);
}

const assertToLu = async function(srcJSONFile, tgtLUFile) {
    let testInputFile = await loadJsonFile(srcJSONFile)
    let testInputJSON = LuisBuilder.fromJson(testInputFile)
    let testContent = testInputJSON.parseToLuContent();
    let verifiedContent = await loadLuFile(tgtLUFile)
    assert.deepEqual(sanitize(testContent), verifiedContent)
}

const assertToJSON = async function(srcLUFile, tgtJSONFile, name = undefined) {
    let testInputFile = await loadLuFile(srcLUFile)
    let testContent = await LuisBuilder.fromLUAsync(testInputFile)
    if (name !== undefined) testContent.name = name
    let verifiedContent = await loadJsonFile(tgtJSONFile)
    assert.deepEqual(testContent, verifiedContent)
}

describe('luis:convert', () => {
    it('luis:convert successfully reconstructs a markdown file from a LUIS input file with out of order entity references', async () => {
        await assertToLu('./../../fixtures/testcases/test269-d.json', './../../fixtures/verified/test269-d.lu')
    })

    it('luis:convert successfully reconstructs a markdown file from a LUIS input file', async () => {
        await assertToLu('./../../fixtures/verified/all.json', './../../fixtures/verified/allGen.lu')
    })

    it('luis:convert successfully reconstructs a markdown file from a LUIS input file (phrase list as feature)', async () => {
        await assertToLu('./../../fixtures/verified/plFeatures.json', './../../fixtures/verified/plFeatures.lu')
    })

    it('luis:convert successfully reconstructs a markdown file from a LUIS input file (model as features)', async () => {
        await assertToLu('./../../fixtures/verified/modelAsFeatures.json', './../../fixtures/verified/modelAsFeatureGen.lu')
    })
    it('luis:convert successfully reconstructs a markdown file from a LUIS input file (with nDepth entity definitions in utterances)', async () => {
        await assertToLu('./../../fixtures/verified/nDepthEntityInUtterance.json', './../../fixtures/verified/nDepthEntityInUtterance.lu')
    })

    it('luis:convert Simple intent and utterances are parsed correctly', async () => {
        await assertToJSON('./../../fixtures/examples/1.lu', './../../fixtures/verified/1.json', '1')
    })

    it('luis:convert Multiple intent and utterance definition sections are parsed correctly', async () => {
        await assertToJSON('./../../fixtures/examples/3.lu', './../../fixtures/verified/3.json', '3')
    })

    it('luis:convert Uttearnces with labelled values are parsed correctly', async () => {
        await assertToJSON('./../../fixtures/examples/4.lu', './../../fixtures/verified/4.json', '4')
    })

    it('luis:convert Simple entity declaration is parsed correctly', async () => {
        await assertToJSON('./../../fixtures/examples/5.lu', './../../fixtures/verified/5.json', '5')
    })

    it('luis:convert Prebuilt entity types are parsed correctly', async () => {
        await assertToJSON('./../../fixtures/examples/6.lu', './../../fixtures/verified/6.json', '6')
    })
    it('luis:convert Pattern.any entity types are parsed correctly', async () => {
        await assertToJSON('./../../fixtures/examples/7.lu', './../../fixtures/verified/7.json', '7')
    })

    it('luis:convert List entity types are parsed correctly', async () => {
        await assertToJSON('./../../fixtures/examples/9.lu', './../../fixtures/verified/9.json', '9')
    })

    it('luis:convert list entity definitions and intent definitions can be split up and will be parsed correctly', async () => {
        await assertToJSON('./../../fixtures/examples/9a.lu', './../../fixtures/verified/9a.json', '9a')
    })

    it('luis:convert phraselist entity types are parsed correctly', async () => {
        await assertToJSON('./../../fixtures/examples/13.lu', './../../fixtures/verified/13.json', '13')
    })

    it('Parse to LU instance', async () => {
        let luFile = `
        @ ml test
        # test
        - this is a {@test = one}
        `;

        let result = `
> LUIS application information
> !# @app.versionId = 0.1
> !# @app.culture = en-us
> !# @app.luis_schema_version = 3.2.0


> # Intent definitions

# test
- this is a {@test=one}


> # Entity definitions

@ ml test


> # PREBUILT Entity definitions


> # Phrase list definitions


> # List entities

> # RegEx entities


`
        const luisObject = await LuisBuilder.fromLUAsync(luFile)
        const newLU = luisObject.parseToLU()
        assert.equal(sanitize(newLU.content), result); 
    });
})
describe('luis:convert version 7 upgrade test', () => {
    it('luis:convert successfully converts a lu file with depth information preserved in entity and utterances', async () => {
        await assertToJSON('./../../fixtures/examples/v7UpgradeTest.lu', './../../fixtures/verified/v7UpgradeTest.json')
    })

    it('luis:convert successfully converts a JSON file with depth information preserved in entity and utterances', async () => {
        await assertToLu('./../../fixtures/verified/v7UpgradeTest.json', './../../fixtures/verified/v7UpgradeTest.lu')
    })

    it('V7 json from LUIS team converts correctly to lu format', async () => {
        await assertToLu('./../../fixtures/testcases/v7app.json', './../../fixtures/verified/v7app.lu')
    })

    it('V7 LU (from LUIS team) converts correctly to JSON format', async () => {
        await assertToJSON('./../../fixtures/verified/v7app.lu', './../../fixtures/verified/v7app_c.json')
    })

    it('luis:convert successfully reconstructs a markdown file from a LUIS input file with v5 constructs', async () => {
        await assertToJSON('./../../fixtures/verified/v5UpgradeTest.lu', './../../fixtures/verified/v5Upgrade.json')
    })
  
    it('luis:convert successfully converts LU with ndepth entity and features to LUIS JSON model', async () => {
        await assertToJSON('./../../fixtures/examples/newEntityWithFeatures.lu', './../../fixtures/verified/newEntityWithFeatures.json')
    })
  
    it('luis:convert successfully converts LUIS JSON model with nDepth entity and features to LU', async () => {
        await assertToLu('./../../fixtures/verified/newEntityWithFeatures.json', './../../fixtures/verified/newEntityWithFeatures.lu')
    })
  
    it('luis:convert successfully converts LUIS JSON model with empty intent feature descriptors', async () => {
        await assertToLu('./../../fixtures/testcases/emptyIntentDescriptors.json', './../../fixtures/verified/emptyIntentDescriptors.lu')
    })

    it('luis:convert successfully converts LUIS JSON model with no phrase lists (output must have phraselists if any v6 concepts are present in the .lu file)', async () => {
        await assertToJSON('./../../fixtures/testcases/v6WithoutPhraseLists.lu', './../../fixtures/verified/v6WithoutPhraseLists.json')
    })
  
    it('luis:convert successfully converts LUIS JSON model with no phrase lists (output must have phraselists if any v6 concepts are present in the .lu file)', async () => {
        await assertToJSON('./../../fixtures/testcases/plWithFlags.lu', './../../fixtures/verified/plWithFlags.json')
    })

    it('Child entities names with spaces in them parse correctly to .lu format', async () => {
        await assertToLu('./../../fixtures/testcases/Child_Entity_With_Spaces.json', './../../fixtures/verified/Child_Entity_With_Spaces.lu')
    })
  })

describe('luis:convert negative tests', () => {
    it('luis:convert should show ERR message when no utterances are found for an intent', (done) => {
        loadLuFile('./../../fixtures/testcases/bad3.lu')
            .then(res => {
                LuisBuilder.fromLUAsync(res)
                    .then(res => done(res))
                    .catch(err => {
                        assert.isTrue(err.text.includes(`[ERROR] line 4:0 - line 4:16: Invalid intent body line, did you miss \'-\' at line begin`))
                        done()
                    })
            })    
        
    })
  
    it('luis:convert should show ERR message when no labelled value is found for an entity', (done) => {
        loadLuFile('./../../fixtures/testcases/bad3a.lu')    
            .then(res => {
                LuisBuilder.fromLUAsync(res)
                    .then(res => done(res))
                    .catch(err => {
                        assert.isTrue(err.text.includes(`[ERROR] line 4:0 - line 4:19: No labelled value found for entity: "tomato" in utterance: "- i wangt {tomato=}"`))
                        done()
                    })
            })
        
    })
  
    it('luis:convert should show ERR message when no labelled value is found for an entity', (done) => {
        loadLuFile('./../../fixtures/testcases/bad2.lu')    
            .then(res => {
                LuisBuilder.fromLUAsync(res)
                .then(res => done(res))
                .catch(err => {
                    assert.isTrue(err.text.includes(`[ERROR] line 1:0 - line 1:1: syntax error: invalid input 'f' detected.`))
                    done()
                })
            })
        
    })

    it('luis:convert should show ERR message when prebuilt entity in pattern is not explicitly defined', (done) => {
        loadLuFile('./../../fixtures/testcases/bad4.lu')    
            .then(res => {
                LuisBuilder.fromLUAsync(res)
                .then(res => done(res))
                .catch(err => {
                    assert.isTrue(err.text.includes(`[ERROR] line 2:0 - line 2:27: Pattern "- hi {@personName:userName}" has prebuilt entity personName. Please define it explicitly with @ prebuilt personName.`))
                    done()
                })
            })
        
    })

    it('luis:convert should show ERR message when entity name contains invalid char', (done) => {
        loadLuFile('./../../fixtures/testcases/bad5.lu')
            .then(res => {
                LuisBuilder.fromLUAsync(res)
                    .then(res => done(res))
                    .catch(err => {
                        assert.isTrue(err.text.includes('[ERROR] line 2:0 - line 2:26: Invalid utterance line, entity name @addto*Property cannot contain any of the following characters: [<, >, *, %, &, :, \\, $]'))
                        assert.isTrue(err.text.includes('[ERROR] line 4:0 - line 4:20: Invalid entity line, entity name delete$Property cannot contain any of the following characters: [<, >, *, %, &, :, \\, $]'))
                        done()
                    })
            })
    })
  })

describe('luis:convert new entity format', () => {
    it('luis:convert with new entity format correctly produces a LU file', async () => {
        await assertToLu('./../../fixtures/testcases/newEntity1.json', './../../fixtures/verified/newEntity1.lu')
    })
  
    it('luis:convert with new entity format and single roles correctly produces a LU file', async () => {
        await assertToLu('./../../fixtures/testcases/newEntity1.json', './../../fixtures/verified/newEntity1.lu')
     })
})

describe('luis:convert with pattern.any inherits information', () => {
    it('luis:convert with pattern.any inherits information correctly produces a LUIS app', async () => {
        assertToJSON('./../../fixtures/verified/LUISAppWithPAInherits.lu', './../../fixtures/verified/LUISAppWithPAInherits.lu.json')
    })

    it('luis:convert with pattern.any inherits information correctly produces a LUIS app', async () => {
        assertToLu('./../../fixtures/testcases/LUISAppWithPAInherits.json', './../../fixtures/verified/LUISAppWithPAInherits.lu')
    })
})

