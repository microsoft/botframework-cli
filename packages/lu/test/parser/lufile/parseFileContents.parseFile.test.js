/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const parseFile = require('./../../../src/parser/lufile/parseFileContents');
const validateLUISBlob = require('./../../../src/parser/luis/luisValidator')
var chai = require('chai');
var assert = chai.assert;
describe('parseFile', function () {
        it('Parsefile do not treat two distinct utterancess as the same even though they might share the same hash code', function(done) {
                let luFile = `
# testIntent
- video for digital MDT
- How do i sell tele-coaching`;
                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 2)
                                done()
                        })
                        // .catch(err => done(err))
        })

        it('Parsefile correctly handles non nDepth entity references in patterns', function(done) {
                let luFile = `@ list foo=
                @ ml operation=
                    - @foo foo
                
                # Test
                - Pattern {foo}`;
                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.patterns.length, 1)
                                assert.equal(res.LUISJsonStructure.patterns[0].pattern, "Pattern {foo}");
                                done()
                        })
        })

        it('parseFile includes defaults for LUIS app', function(done) {
                let luFile = `@ simple entity1`;
                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.luis_schema_version, "3.2.0")
                                assert.equal(res.LUISJsonStructure.versionId, "0.1")
                                assert.equal(res.LUISJsonStructure.name, "")
                                assert.equal(res.LUISJsonStructure.desc, "")
                                assert.equal(res.LUISJsonStructure.culture, "en-us")
                                done()
                        })
                        .catch(err => done(err))
        })

        it('tokenizerVersion can be specified in LU file', function(done) {
                let luFile = `> !# @app.tokenizerVersion = 1.0.2

# testIntent
- one
- two`;
                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.tokenizerVersion, "1.0.2")
                                done()
                        })
                        .catch(err => done(err))
        })

        it('validateLUISBlob throw when duplicate entity definitions are found', function (done) {
                let luFile = `# Greeting
- hi {commPreference=test call}

$commPreference:simple
$commPreference:call=
- phone call`;
                parseFile.parseFile(luFile, false, 'en-us')
                        .then(function (parsedContent) {
                                validateLUISBlob(parsedContent.LUISJsonStructure)
                                        .then(() => done('Test fail. validateLUISBlob did not throw when expected!'))
                                        .catch(() => done())
                        })
                        .catch(() => done())
        });

        it('validateLUISBlob does not throw when phrase list names collide with other entity names', function (done) {
                let luFile = `# Greeting
- hi {commPreference}
$commPreference:simple
$commPreference:phraseList
- m&m,mars,mints,spearmings,payday,jelly,kit kat,kitkat,twix`;
                parseFile.parseFile(luFile, false, 'en-us')
                        .then(function (parsedContent) {
                                try {
                                        validateLUISBlob(parsedContent.LUISJsonStructure)
                                        done()         
                                } catch (error) {
                                        done('Test fail. validateLUISBlob did not throw when expected!' + error)
                                }
                        })
                        .catch((err) => done('Test fail. validateLUISBlob did not throw when expected!' + err))
        });

        it('parseFile throws on invalid file refs', function (done) {
                let luFile = `[test]()`;
                parseFile.parseFile(luFile, false, 'en-us')
                        .then(() => done('Test fail. validateLUISBlob did not throw when expected!'))
                        .catch(() => done())
        });

        it('parseFile throws if a QnA maker question does not have a list decoration', function (done) {
                let luFile = `# ? q1
question 2
`;
                parseFile.parseFile(luFile, false, 'en-us')
                        .then(() => done('Test fail. validateLUISBlob did not throw when expected!'))
                        .catch(() => done())
        });

        it('parseFile throws if a QnA maker filter section does not have list decoration', function (done) {
                let luFile = `# ? q1
**Filters:**
location = seattle
`;
                parseFile.parseFile(luFile, false, 'en-us')
                        .then(() => done('Test fail. validateLUISBlob did not throw when expected!'))
                        .catch(() => done())
        });

        it('parseFile throws if a QnA maker filter section does not have valid key = value pair', function (done) {
                let luFile = `# ? q1
**Filters:**
- location
`;
                parseFile.parseFile(luFile, false, 'en-us')
                        .then(() => done('Test fail. validateLUISBlob did not throw when expected!'))
                        .catch(() => done())
        });

        it('parseFile parses multi-line answer correctly', function (done) {
                let luFile = `# ? q1
\`\`\`markdown
test
123
\`\`\`
`;
                parseFile.parseFile(luFile, false, 'en-us')
                        .then(() => done())
                        .catch(() => done('Test fail. validateLUISBlob did not throw when expected!'))
        });

        it('parseFile throws on conflicting phraseList definitions', function (done) {
                let luFile = `$p1:phraseList
        - m&m,mars,mints,spearmings,payday,jelly,kit kat,kitkat,twix

        $p1:phraseList interchangeable
        - m&m,mars,mints,spearmings,payday,jelly,kit kat,kitkat,twix

`;
                parseFile.parseFile(luFile, false, 'en-us')
                        .then(() => done('Test fail. validateLUISBlob did not throw when expected!'))
                        .catch(() => done())
        });

        it('parseFile throws if phraseList value does not have list decoration', function (done) {
                let luFile = `$p1:phraseList
m&m,mars,mints,spearmings,payday,jelly,kit kat,kitkat,twix
`;
                parseFile.parseFile(luFile, false, 'en-us')
                        .then(() => done('Test fail. validateLUISBlob did not throw when expected!'))
                        .catch(() => done())
        });

        it('parseFile throws if List synonyms do not have list decoration', function (done) {
                let luFile = `$p1:t1=
m&m,mars,mints,spearmings,payday,jelly,kit kat,kitkat,twix
`;
                parseFile.parseFile(luFile, false, 'en-us')
                        .then(() => done('Test fail. validateLUISBlob did not throw when expected!'))
                        .catch(() => done())
        });

        it('parseFile correctly de-dupes patterns', function (done) {
                let luFile = `# test
        - this is {one}
        - this is {one}
`;
                parseFile.parseFile(luFile, false, 'en-us')
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.patterns.length, 1);
                                done();
                        })
                        .catch(() => done('Test fail. parseFile threw when it was not expected!'))
        });
        it('parseFile correctly parses normalized list entity values with : in them', function (done) {
                let luFile = `$three : test :: a =
        - foo
        - bar
    `;

                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                                assert.equal(res.LUISJsonStructure.closedLists[0].subLists[0].canonicalForm, 'test :: a');
                                done();
                        })
                        .catch((err) => done(err))
        });

        it('parseFile correctly parses normalized list entity values with = in them', function (done) {
                let luFile = `$three : test = a =
    - foo
    - bar
`;

                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                                assert.equal(res.LUISJsonStructure.closedLists[0].subLists[0].canonicalForm, 'test = a');
                                done();
                        })
                        .catch((err) => done(err))

        });

        it('parseFile correctly parses normalized list entity values with : in them and inline role definition', function (done) {
                let luFile = `$three : test :: a = Roles=[from,to]
            - foo
            - bar
        `;

                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                                assert.equal(res.LUISJsonStructure.closedLists[0].subLists[0].canonicalForm, 'test :: a');
                                assert.equal(res.LUISJsonStructure.closedLists[0].roles.length, 2);
                                done();
                        })
                        .catch((err) => done(err))

        });

        it('phraseList entity does not overrite simple entity definition. Both can have same name', function (done) {
                let luFile = `$product : simple

            $product : phraseList
                - one
                - two
        `;

                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                                done();
                        })
                        .catch((err) => done(err))

        });

        it('phraseList entity does not overrite simple entity definition. Both can have same name', function (done) {
                let luFile = `

            $product : phraseList
                - one
                - two

                $product : simple
        `;

                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                                done();
                        })
                        .catch((err) => done(err))

        });

        it('Labelled simple entity in an utterance that conflicts with a phrase list name is valid', function (done) {
                let luFile = `

            $product : phraseList
                - one
                - two

                # test
                - this is {product = one}
        `;

                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                assert.equal(res.LUISJsonStructure.entities[0].name, 'product');
                                assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                                done();
                        })
                        .catch((err) => done(err))

        });

        it('Labelled composite entity in an utterance that conflicts with a phrase list name is valid', function (done) {
                let luFile = `

            $product : phraseList
                - one
                - two

                # test
                - this is {product = {type=sandwich}}

                $product : [type]
        `;

                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                assert.equal(res.LUISJsonStructure.entities[0].name, 'type');
                                assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                                assert.equal(res.LUISJsonStructure.composites.length, 1);
                                assert.equal(res.LUISJsonStructure.composites[0].name, 'product');
                                done();
                        })
                        .catch((err) => done(err))

        });

        it('Labelled prebuilt entity in an utterance that conflicts with a phrase list name is valid', function(done) {
                let luFile = `

                $number : phraseList
                    - one
                    - two

                    # test
                    - this is {number:first = one}

                    $PREBUILT : number
            `;
    
            parseFile.parseFile(luFile) 
                    .then(res => {
                            
                            assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                            assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                            assert.equal(res.LUISJsonStructure.prebuiltEntities[0].roles.length, 1);
                            done();
                    })
                    .catch((err) => done(err))

        });

        it('Labelled closed list entity in an utterance that conflicts with a phrase list name is valid', function(done) {
                let luFile = `

                $number : phraseList
                    - one
                    - two

                    # test
                    - this is {number:first = one}

                    $number : test=
                    - one
                    - two
            `;
    
            parseFile.parseFile(luFile) 
                    .then(res => {
                            
                            assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                            assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                            assert.equal(res.LUISJsonStructure.closedLists[0].roles.length, 1);
                            done();
                    })
                    .catch((err) => done(err))

        });

        it('Labelled regex entity in an utterance that conflicts with a phrase list name is valid', function(done) {
                let luFile = `

                $number : phraseList
                    - one
                    - two

                    # test
                    - this is {number:first = one}

                    $number : /one/
            `;
    
            parseFile.parseFile(luFile) 
                    .then(res => {
                            
                            assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                            assert.equal(res.LUISJsonStructure.regex_entities.length, 1);
                            assert.equal(res.LUISJsonStructure.regex_entities[0].roles.length, 1);
                            done();
                    })
                    .catch((err) => done(err))

        });


        it('Test for #1137', function(done) {
                let luFile = `

            $product : simple
            
            $PREBUILT : number

            $drinks:phraseList
                    - tea, latte, milk
            
            $product:phraseList
                    - a, b, c
            $EspressoType:Blonde ::201=
                    - blonde
                    - blond
        `;

                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                assert.equal(res.LUISJsonStructure.entities[0].name, 'product');
                                assert.equal(res.LUISJsonStructure.phraselists.length, 2);
                                assert.equal(res.LUISJsonStructure.phraselists[0].name, 'drinks');
                                done();
                        })
                        .catch((err) => done(err))

        });

        it('Test for #1151', function (done) {
                let luFile = `

            $project : simple
            
            $project:phraseList
                    - a, b, c

            # Test
            - this is a test {project=foo} utterance
        `;

                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                assert.equal(res.LUISJsonStructure.entities[0].name, 'project');
                                assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                                assert.equal(res.LUISJsonStructure.phraselists[0].name, 'project');
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                done();
                        })
                        .catch((err) => done(err))

        });

        it('Test for #1164', function (done) {
                let luFile = `# Test
        - one {product:from=something}
        
        $product:test=
        - test`;

                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                                assert.equal(res.LUISJsonStructure.closedLists[0].roles.length, 1);
                                done();
                        })
                        .catch((err) => done(err))

        });

        it('Test for #1164 (with roles)', function (done) {
                let luFile = `## None
                - here's an utterance {aListEntity:ThisIsARole=avalue} with a role in it
                
                $aListEntity:some value= Roles=ThisIsARole
                - avalue
                `;

                parseFile.parseFile(luFile)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                                assert.equal(res.LUISJsonStructure.closedLists[0].roles.length, 1);
                                done();
                        })
                        .catch((err) => done(err))

        });

        it('Test for #1165 (with roles)', function(done) {
                let luFile = `## None
                - here's an utterance avalue with a role in it
                
                $aListEntity:some value= Roles=ThisIsARole
                - avalue
                
                $MyComposite:[aListEntity:ThisIsARole]
                `;
    
            parseFile.parseFile(luFile) 
                    .then(res => {
                            assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                            assert.equal(res.LUISJsonStructure.closedLists[0].roles.length, 1);
                            assert.equal(res.LUISJsonStructure.composites.length, 1);
                            done();
                    })
                    .catch((err) => done(err))

        });

        it('Test for #1166 ', function(done) {
                let luFile = `$Country|Office:Argentina|ar::chc=
                - Chaco
                - chaco
                `;
    
            parseFile.parseFile(luFile) 
                    .then(res => {
                            assert.equal(res.LUISJsonStructure.closedLists.length, 1);
                            assert.equal(res.LUISJsonStructure.closedLists[0].name, 'Country|Office');
                            assert.equal(res.LUISJsonStructure.closedLists[0].subLists[0].canonicalForm, 'Argentina|ar::chc');
                            done();
                    })
                    .catch((err) => done(err))

        });
});


describe('parseFile correctly parses utterances', function () {
        it('correctly parses an utterance with no entities', function (done) {
                let testLUFile = `# test
                - hello`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "hello");
                                done();
                        })
                        .catch(err => done(err))
        });

        it('correctly parses an utterance with one labelled entity', function (done) {
                let testLUFile = `# test
                - I want a {foodType = tomato}`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "I want a tomato");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].startPos, 9);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].endPos, 14);
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses an utterance with one labelled entity', function (done) {
                let testLUFile = `# test
                - I want a {foodType=tomato}`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "I want a tomato");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].startPos, 9);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].endPos, 14);
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses a pattern with pattern.any entity', function (done) {
                let testLUFile = `# test
                - I want {foodType}`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.patterns.length, 1);
                                assert.equal(res.LUISJsonStructure.patterns[0].pattern, "I want {foodType}");
                                assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 1);
                                assert.equal(res.LUISJsonStructure.patternAnyEntities[0].name, "foodType");
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses an utterance with multiple labelled entities', function (done) {
                let testLUFile = `# test
                - I want a {foodType = tomato} and {foodType = orange}`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "I want a tomato and orange");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 2);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].startPos, 20);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].endPos, 25);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].startPos, 9);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].endPos, 14);
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses an utterance with multiple labelled entities', function (done) {
                let testLUFile = `# test
                - I want a {foodType =tomato} and {foodType =orange}`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "I want a tomato and orange");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 2);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].startPos, 20);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].endPos, 25);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].startPos, 9);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].endPos, 14);
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses a pattern with multiple pattern.any entities', function (done) {
                let testLUFile = `# test
                - I want {foodType} and {foodType}`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.patterns.length, 1);
                                assert.equal(res.LUISJsonStructure.patterns[0].pattern, "I want {foodType} and {foodType}");
                                assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 1);
                                assert.equal(res.LUISJsonStructure.patternAnyEntities[0].name, "foodType");
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses an utterance with only labelled entity', function (done) {
                let testLUFile = `# test
                - {userName=vishwac}`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "vishwac");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].startPos, 0);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].endPos, 6);
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses an utterance with only labelled entity', function (done) {
                let testLUFile = `# test
                - {userName= vishwac}`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "vishwac");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].startPos, 0);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].endPos, 6);
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses an utterance with single curly bracket', function (done) {
                let testLUFile = `# test
                - {userName= vishwac
                - userName= vishwac}`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 2);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "{userName= vishwac");
                                assert.equal(res.LUISJsonStructure.utterances[1].text, "userName= vishwac}");
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses pattern with only pattern.any entity in it.', function (done) {
                let testLUFile = `# test
                - {userName}`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.patterns.length, 1);
                                assert.equal(res.LUISJsonStructure.patterns[0].pattern, "{userName}");
                                assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 1);
                                assert.equal(res.LUISJsonStructure.patternAnyEntities[0].name, "userName");
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses utterance with composite entities', function (done) {
                let testLUFile = `# test
                - {p = x {q = y}}
                
                $ p : [q]`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "x y");
                                assert.equal(res.LUISJsonStructure.composites.length, 1);
                                assert.equal(res.LUISJsonStructure.composites[0].name, 'p');
                                assert.deepEqual(res.LUISJsonStructure.composites[0].children, ["q"]);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 2);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].startPos, 2);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].endPos, 2);
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses utterance with composite entities with one child label', function (done) {
                let testLUFile = `# test
                - I want to {productOrder = buy a {product = shirt}} please
                
                $ productOrder : [product]`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "I want to buy a shirt please");
                                assert.equal(res.LUISJsonStructure.composites.length, 1);
                                assert.equal(res.LUISJsonStructure.composites[0].name, 'productOrder');
                                assert.deepEqual(res.LUISJsonStructure.composites[0].children, ["product"]);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 2);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].startPos, 16);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].endPos, 20);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].startPos, 10);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].endPos, 20);
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses utterance with composite entities with multiple children', function (done) {
                let testLUFile = `# test
                - I want {productOrder = another {product = shirt} and {product = pant} please}
                
                $ productOrder : [product]`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "I want another shirt and pant please");
                                assert.equal(res.LUISJsonStructure.composites.length, 1);
                                assert.equal(res.LUISJsonStructure.composites[0].name, 'productOrder');
                                assert.deepEqual(res.LUISJsonStructure.composites[0].children, ["product"]);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 3);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].startPos, 25);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].endPos, 28);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].startPos, 15);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].endPos, 19);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[2].startPos, 7);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[2].endPos, 35);
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses utterance with composite entities', function (done) {
                let testLUFile = `# test
                - I want {p = x {q = y} and {r = a} with} {foodType=tomato} and {foodType=orange}
                
                $ p : [q, r]`;
                parseFile.parseFile(testLUFile, false)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "I want x y and a with tomato and orange");
                                assert.equal(res.LUISJsonStructure.composites.length, 1);
                                assert.equal(res.LUISJsonStructure.composites[0].name, 'p');
                                assert.deepEqual(res.LUISJsonStructure.composites[0].children, ["q", "r"]);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 5);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].startPos, 9);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].endPos, 9);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].startPos, 15);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].endPos, 15);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[2].startPos, 7);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[2].endPos, 20);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[3].startPos, 22);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[3].endPos, 27);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[4].startPos, 33);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[4].endPos, 38);
                                done();
                        })
                        .catch(err => done(err))
        })

        it('correctly parses nested simple entities', function(done) {
                let testLU = `# test
                - 1 {a = {b = {c = 2}}}`;

                parseFile.parseFile(testLU)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.entities.length, 3);
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, '1 2');
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 3);
                                assert.deepEqual(res.LUISJsonStructure.utterances[0].entities[0], {
                                        "entity": "c",
                                        "startPos": 2,
                                        "endPos": 2
                                      });
                                assert.deepEqual(res.LUISJsonStructure.utterances[0].entities[1], {
                                        "entity": "b",
                                        "startPos": 2,
                                        "endPos": 2
                                      })
                                assert.deepEqual(res.LUISJsonStructure.utterances[0].entities[2], {
                                        "entity": "a",
                                        "startPos": 2,
                                        "endPos": 2
                                      })
                                done();
                        })
                        .catch(err => done(err));
        })

        it('correctly parses composites with nested simple entities', function(done) {
                let testLU = `# test
                - 1 {a = {b = {c = 2}}}
                $a:[b]`;

                parseFile.parseFile(testLU)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.entities.length, 2);
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, '1 2');
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 3);
                                assert.deepEqual(res.LUISJsonStructure.utterances[0].entities[0], {
                                        "entity": "c",
                                        "startPos": 2,
                                        "endPos": 2
                                      });
                                assert.deepEqual(res.LUISJsonStructure.utterances[0].entities[1], {
                                        "entity": "b",
                                        "startPos": 2,
                                        "endPos": 2
                                      })
                                assert.deepEqual(res.LUISJsonStructure.utterances[0].entities[2], {
                                        "entity": "a",
                                        "startPos": 2,
                                        "endPos": 2
                                      })
                                assert.equal(res.LUISJsonStructure.composites.length, 1);
                                assert.deepEqual(res.LUISJsonStructure.composites[0].children, ["b"]);
                                done();
                        })
                        .catch(err => done(err));
        });

        it ('Roles specified in composite nested simple child entities are parsed correcly', function(done){
                let testLU = `## None
                - {MyComposite:c1=here's an {Entity2:t1=utterance {Entity1:t2=avalue}}} with a composite in it
                > here's an utterance avalue with a composite in it
                > MyComposite:0,25; Entity2:10,25, Entity1:20,25
                $Entity1:simple
                
                $Entity2:simple
               
                $MyComposite:[Entity1, Entity2]`;

                parseFile.parseFile(testLU)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.entities.length, 2);
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "here's an utterance avalue with a composite in it");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 3);
                                assert.deepEqual(res.LUISJsonStructure.utterances[0].entities[0], {
                                        "entity": "Entity1",
                                        "startPos": 20,
                                        "endPos": 25,
                                        "role": "t2"
                                      });
                                assert.deepEqual(res.LUISJsonStructure.utterances[0].entities[1], {
                                        "entity": "Entity2",
                                        "startPos": 10,
                                        "endPos": 25,
                                        "role": "t1"
                                      })
                                assert.deepEqual(res.LUISJsonStructure.utterances[0].entities[2], {
                                        "entity": "MyComposite",
                                        "startPos": 0,
                                        "endPos": 25,
                                        "role": "c1"
                                      })
                                assert.equal(res.LUISJsonStructure.composites.length, 1);
                                assert.deepEqual(res.LUISJsonStructure.composites[0].children, [
                                        "Entity1",
                                        "Entity2"
                                      ]);
                                assert.equal(res.LUISJsonStructure.composites[0].name, "MyComposite")
                                done();
                        })
                        .catch(err => done(err))

        });

        it ('test for #1167', function(done){
                let testLU = `## None
                - {MyComposite=here's an {Entity2=utterance {Entity1=avalue}}} with a composite in it
                > here's an utterance avalue with a composite in it
                > MyComposite:0,25; Entity2:10,25, Entity1:20,25
                $Entity1:simple
                
                $Entity2:simple
               
                $MyComposite:[Entity1, Entity2]`;

                parseFile.parseFile(testLU)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.entities.length, 2);
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "here's an utterance avalue with a composite in it");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 3);
                                assert.deepEqual(res.LUISJsonStructure.utterances[0].entities[0], {
                                        "entity": "Entity1",
                                        "startPos": 20,
                                        "endPos": 25
                                      });
                                assert.deepEqual(res.LUISJsonStructure.utterances[0].entities[1], {
                                        "entity": "Entity2",
                                        "startPos": 10,
                                        "endPos": 25
                                      })
                                assert.deepEqual(res.LUISJsonStructure.utterances[0].entities[2], {
                                        "entity": "MyComposite",
                                        "startPos": 0,
                                        "endPos": 25
                                      })
                                assert.equal(res.LUISJsonStructure.composites.length, 1);
                                assert.deepEqual(res.LUISJsonStructure.composites[0].children, [
                                        "Entity1",
                                        "Entity2"
                                      ]);
                                assert.equal(res.LUISJsonStructure.composites[0].name, "MyComposite")
                                done();
                        })
                        .catch(err => done(err))

        })

        it ('Test for 1151, phrase list can have same name as labelled simple entity', function(done){
                let testLu = `## RequestItem
                - i need more {Item=water}
                
                $Item:simple
                
                $Item:phraseList interchangeable
                - water,coffee`;
                parseFile.parseFile(testLu)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.entities.length, 1);
                                assert.equal(res.LUISJsonStructure.entities[0].name, 'Item');
                                assert.equal(res.LUISJsonStructure.phraselists.length, 1);
                                assert.equal(res.LUISJsonStructure.phraselists[0].name, 'Item');
                                done();
                        })
                        .catch(err => done(err))

        });


        it ('Test for BF CLI #122', function(done){
                let testLU = `# intent1
                - [[this]is] a new form (a | b)`;

                parseFile.parseFile(testLU)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.patterns.length, 1);
                                assert.equal(res.LUISJsonStructure.patterns[0].pattern, '[[this]is] a new form (a | b)');
                                done();
                        })
                        .catch(err => done('Fail!'))
        });

        it ('Multiple utterance sections with individual label definitions are handled correctly', function(done) {
                let testLU = `# test
                - one {protein = cheese} sandwich
                    - one cheese sandwich
                - tomato orange 
                - one cheese {foodType = sandwich}
                `;

                parseFile.parseFile(testLU)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 2);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 2);
                                done();
                        })
                        .catch(err => done('Fail!'))
        })

        it ('patterns are handled correctly', function(done){
                let testLU = `# intent1
                - this is a {number}
                
                $ prebuilt : number`;

                parseFile.parseFile(testLU)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 0);
                                assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                                done();
                        })
                        .catch(err => done('Fail!'))
        })

        it ('patterns are handled correctly (with roles)', function(done){
                let testLU = `# intent1
                - this is a {number:one}
                
                $ prebuilt : number`;

                parseFile.parseFile(testLU)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 0);
                                assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                                assert.equal(res.LUISJsonStructure.prebuiltEntities[0].roles.length, 1);
                                done();
                        })
                        .catch(err => done('Fail!'))

        })

        it ('excape characters are handled correctly', function(done){
                let testLU = `# intent1
                - this is a \\{test\\}
                - this ia a test \\n`;

                parseFile.parseFile(testLU)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.patternAnyEntities.length, 0);
                                assert.equal(res.LUISJsonStructure.entities.length, 0);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, 'this is a {test}');
                                assert.equal(res.LUISJsonStructure.utterances[1].text, 'this ia a test \\n');
                                done();
                        })
                        .catch(err => done('Fail!'))

        })

        it ('duplicate utterances with entity labels are handled correctly', function(done){
                let testLU = `
# test
- no, i already have meeting {FromTime=3pm} {FromDate=tomorrow} afternoon
- no, i already have meeting {FromTime=3pm} {FromDate=tomorrow} afternoon
`;
                parseFile.parseFile(testLU)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "no, i already have meeting 3pm tomorrow afternoon");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 2);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].entity, "FromTime");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].startPos, 27);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].endPos, 29);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].entity, "FromDate");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].startPos, 31);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].endPos, 38);
                                done();
                        })
                        .catch(err => done(err))
        })

        it ('duplicate utterances with entity labels are handled correctly (partial)', function(done){
                let testLU = `
# test
- no, i already have meeting {FromTime=3pm} tomorrow afternoon
- no, i already have meeting {FromTime=3pm} {FromDate=tomorrow} afternoon
`;
                parseFile.parseFile(testLU)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.utterances.length, 1);
                                assert.equal(res.LUISJsonStructure.utterances[0].text, "no, i already have meeting 3pm tomorrow afternoon");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities.length, 2);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].entity, "FromTime");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].startPos, 27);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[0].endPos, 29);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].entity, "FromDate");
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].startPos, 31);
                                assert.equal(res.LUISJsonStructure.utterances[0].entities[1].endPos, 38);
                                done();
                        })
                        .catch(err => done(err))
        })

        it ('Correctly parses intent name with special chars', function(done){
                let testLU = `
# test'á
- Hello world
`;
                parseFile.parseFile(testLU)
                        .then(res => {
                                assert.equal(res.LUISJsonStructure.intents.length, 1);
                                assert.equal(res.LUISJsonStructure.intents[0].name, "test'á");
                                done();
                        })
                        .catch(err => done(err))
        })

        it ('Correctly parses entity type that is case insensitive', function(done){
            let testLU = `
                @ ML test
                @ PREbuilt personName
                @ phraseList abc(interchangeable) disabledforallmodels = 
                    - a, b, c`;
            parseFile.parseFile(testLU)
                .then(res => {
                    assert.equal(res.LUISJsonStructure.entities.length, 1);
                    assert.equal(res.LUISJsonStructure.entities[0].name, "test");
                    assert.equal(res.LUISJsonStructure.prebuiltEntities.length, 1);
                    assert.equal(res.LUISJsonStructure.prebuiltEntities[0].name, "personName");
                    assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                    assert.equal(res.LUISJsonStructure.model_features.length, 1);
                    assert.equal(res.LUISJsonStructure.model_features[0].name, "abc");
                    assert.equal(res.LUISJsonStructure.model_features[0].words, "a,b,c");
                    assert.equal(res.LUISJsonStructure.model_features[0].enabledForAllModels, false);
                    done();
                })
                .catch(err => done(err))
        })

        it("Correctly parses utterance with escape char \\ to escape entity definition", function (done) {
          let testLU = `
                      # test
                      - this is another \\{@from = one} from \\{@to = tokyo} \\in japan`;
          parseFile
            .parseFile(testLU)
            .then((res) => {
              assert.equal(
                res.LUISJsonStructure.utterances[0].text,
                "this is another {@from = one} from {@to = tokyo} \\in japan"
              );
              done();
            })
            .catch((err) => done(err));
        });

        it("Correctly parses utterance that keeps @ at the the beginning of entity name", function (done) {
          let testLU = `
                      # test
                      - this is another \\\\{@@from = one} from {@@to = tokyo}`;
          parseFile
            .parseFile(testLU)
            .then((res) => {
              assert.equal(
                res.LUISJsonStructure.utterances[0].text,
                "this is another \\one from tokyo"
              );
              assert.equal(res.LUISJsonStructure.entities.length, 2);
              assert.equal(res.LUISJsonStructure.entities[0].name, "@from");
              assert.equal(res.LUISJsonStructure.entities[1].name, "@to");
              done();
            })
            .catch((err) => done(err));
        });

        it("Correctly parses utterance that escape char \\ in nested entity definition", function (done) {
          let testLU = `
                # test
                - {@Command={@Action={@BoldAction=bold}} \\{{@ActionTargetPhrase=directions from seattle to portland}\\}}`;
          parseFile
            .parseFile(testLU)
            .then((res) => {
              assert.equal(
                res.LUISJsonStructure.utterances[0].text,
                "bold {directions from seattle to portland}"
              );
              assert.equal(res.LUISJsonStructure.entities.length, 4);
              assert.equal(res.LUISJsonStructure.entities[0].name, "BoldAction");
              assert.equal(res.LUISJsonStructure.entities[1].name, "Action");
              assert.equal(res.LUISJsonStructure.entities[2].name, "ActionTargetPhrase");
              assert.equal(res.LUISJsonStructure.entities[3].name, "Command");
              done();
            })
            .catch((err) => done(err));
        });

        it("Correctly parses utterance that with equal sign as entity value", function (done) {
          let testLU = `
                # test
                - {@Command={@Action={@BoldAction=emphasise from}} {@ActionTargetRange={@ActionTargetStart=@username} {@ActionTargetSeparator=through} {@ActionTargetEnd==}}}`;
          parseFile
            .parseFile(testLU)
            .then((res) => {
                assert.equal(res.LUISJsonStructure.utterances[0].text, "emphasise from @username through =");
                assert.equal(res.LUISJsonStructure.entities.length, 7);
                assert.equal(res.LUISJsonStructure.entities[0].name, "BoldAction");
                assert.equal(res.LUISJsonStructure.entities[1].name, "Action");
                assert.equal(res.LUISJsonStructure.entities[2].name, "ActionTargetStart");
                assert.equal(res.LUISJsonStructure.entities[3].name, "ActionTargetSeparator");
                assert.equal(res.LUISJsonStructure.entities[4].name, "ActionTargetEnd");
                assert.equal(res.LUISJsonStructure.entities[5].name, "ActionTargetRange");
                assert.equal(res.LUISJsonStructure.entities[6].name, "Command");
                done();
            })
            .catch((err) => done(err));
        });

        it("Correctly parses utterance that with colon sign in entity role", function (done) {
          let testLU = `
                      # test
                      - {@city::startCity=Seattle}`;
          parseFile
            .parseFile(testLU)
            .then((res) => {
                assert.equal(res.LUISJsonStructure.utterances[0].text, "Seattle");
                assert.equal(res.LUISJsonStructure.entities.length, 1);
                assert.equal(res.LUISJsonStructure.entities[0].name, "city");
                assert.equal(res.LUISJsonStructure.entities[0].roles[0], ":startCity");
                done();
            })
            .catch((err) => done(err));
        });
})
