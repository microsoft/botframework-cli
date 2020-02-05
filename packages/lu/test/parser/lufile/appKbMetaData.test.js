/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const parseFile = require('./../../../src/parser/lufile/parseFileContents');
const luis = require('./../../../src/parser/luis/luis');
var chai = require('chai');
var assert = chai.assert;
describe('App/ Kb meta data information', function () {
    it ('application meta data information in lu file is parsed correctly', function(done) {
        let testLU = `> !# @app.name = all345
        > !# @app.desc = this is a test
        > !#  @app.culture = en-us
        > !# @app.versionId = 0.4
        > !# @app.luis_schema_version = 3.2.0
        
        # test 
        - greeting`;

        parseFile.parseFile(testLU)
                .then(res => {
                        assert.equal(res.LUISJsonStructure.name, 'all345');
                        assert.equal(res.LUISJsonStructure.desc, 'this is a test');
                        assert.equal(res.LUISJsonStructure.culture, 'en-us');
                        assert.equal(res.LUISJsonStructure.versionId, '0.4');
                        assert.equal(res.LUISJsonStructure.luis_schema_version, '3.2.0')
                        done();
                })
                .catch(err => done(err))
    });

    it ('kb meta data information in lu file is parsed correctly', function(done) {
            let testLU = `> !# @kb.name = my test kb
            # ? hi
            \`\`\`markdown
            hello
            \`\`\``;

            parseFile.parseFile(testLU)
                    .then(res => {
                            assert.equal(res.qnaJsonStructure.name, 'my test kb');
                            done();
                    })
                    .catch(err => done(err))
    })

    it ('LUIS and QnA meta data information in lu file is parsed correctly', function(done){
            let testLU = `> !# @kb.name = my test kb
            # ? hi
            \`\`\`markdown
            hello
            \`\`\`
            
            > !# @app.versionId = 0.6
            > !# @app.name = orange tomato
            
            # test
            - greeting`;
            
            parseFile.parseFile(testLU) 
                    .then(res => {
                            assert.equal(res.qnaJsonStructure.name, 'my test kb');
                            assert.equal(res.LUISJsonStructure.name, 'orange tomato');
                            assert.equal(res.LUISJsonStructure.versionId, '0.6');
                            done();
                    })
                    .catch(err => done(err))
    })

    it ('Multi line app meta data definition throws correctly', function(done){
            let testLU = `> !# @kb.name = foo bar
            test
            
            # ? test q`;

            parseFile.parseFile(testLU)
                    .then(res => done(`Did not throw when expected`))
                    .catch(err => done())
    })

    it ('Settings information is parsed correctly', function(done){
        let testLU = `
> !# @app.settings.NormalizeDiacritics = true
> !# @app.settings.NormalizePunctuation = false
> !# @app.settings.UseAllTrainingData = true

# test
- one`;

        parseFile.parseFile(testLU)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.settings.length, 3);
                    assert.equal(res.LUISJsonStructure.settings[1].name, "NormalizePunctuation")
                    assert.equal(res.LUISJsonStructure.settings[1].value, false)
                    done();
                })
                .catch(err => done(err))
    })

    it ('Settings information is correctly converted back to LU', function(done){
        let testLU = `
> !# @app.settings.NormalizeDiacritics = true
> !# @app.settings.NormalizePunctuation = false
> !# @app.settings.UseAllTrainingData = true

# test
- one`;

        parseFile.parseFile(testLU)
            .then(res => {
                let parsedLuis = new luis(res.LUISJsonStructure);
                assert(parsedLuis.parseToLuContent().includes("!# @app.settings.NormalizeDiacritics = true"));
                done();
            })
            .catch(err => done(err))
    })


});