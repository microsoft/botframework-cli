/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const chai = require('chai');
const assert = chai.assert;
const luMerger = require('./../../../src/parser/lu/luMerger');
const luObj = require('../../../src/parser/lu/lu');
const luOptions = require('../../../src/parser/lu/luOptions');
describe('Deep reference tests', function() {
    it('Ability to pull in all answers from a qna', function(done) {
        let luContent = `
> pull in all answers from .qna file. Note: The trailing '?' is required.
> - [all.qna](./all.qna#*answers*?)
# intent1
- [all answers](qna1#*answers*?)
        `;
        luMerger.Build([new luObj(luContent)], false, undefined, findLuFiles)
            .then(res => {
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances.length, 2);
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances[0].text, "answer1");
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances[1].text, "answer2");
                done()
            })
            .catch(err => done(err))
    })

    it('Ability to pull all variations from a specific question in .qna', function(done) {
        let luContent = `
> pull in all variations from a specific question. Note: The trailing '?' is required.
> [all.qna](qna2#?-book-flight?)
# intent1
- [all.qna](qna2#?-book-flight?)
        `;
        luMerger.Build([new luObj(luContent)], false, undefined, findLuFiles)
            .then(res => {
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances.length, 4);
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances[0].text, "book flight");
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances[3].text, "I'm looking to fly");
                done()
            })
            .catch(err => done(err))
    })

    it('Ability to pull all alterations from qna content', function(done) {
        let luContent = `
> pull in all variations from a specific question. Note: The trailing '?' is required.
> [all.qna](qna3.qna#*alterations*?)
# intent1
- [all.qna](qna3#*alterations*?)
        `;
        luMerger.Build([new luObj(luContent)], false, undefined, findLuFiles)
            .then(res => {
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances.length, 3);
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances[0].text, "botframework");
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances[2].text, "Microsoft bot framework");
                done()
            })
            .catch(err => done(err))
    })

    it('Ability to pull in specific named alterations from qna content', function(done) {
        let luContent = `
> pull in speicific named alteration from qna content. Note: Alterations must be $ListName notation. The trailing '?' is required. 
> - [all.qna](./all.qna#$myListName1?)
# intent1
- [all.qna](qna4#$myListName1?)
        `;
        luMerger.Build([new luObj(luContent)], false, undefined, findLuFiles)
            .then(res => {
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances.length, 2);
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances[0].text, "myListName1");
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances[1].text, "test list");
                done()
            })
            .catch(err => done(err))
    })

    it('Ability to pull in all utterances and patterns from given lu content', function(done) {
        let luContent = `
# intent1
- [all.lu](lu1#*utterancesandpatterns*)
        `;
        luMerger.Build([new luObj(luContent)], false, undefined, findLuFiles)
            .then(res => {
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances.length, 4);
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances[0].text, "one");
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances[2].text, "three");
                assert.equal(res.LUISContent[0].LUISJsonStructure.patterns.length, 1);
                assert.equal(res.LUISContent[0].LUISJsonStructure.patterns[0].pattern, "pattern {one}");
                done()
            })
            .catch(err => done(err))
    })

    it('Ability to pull in all utterances only', function(done) {
        let luContent = `
# intent1
- [all.lu](lu1#*utterances*)
        `;
        luMerger.Build([new luObj(luContent)], false, undefined, findLuFiles)
            .then(res => {
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances.length, 4);
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances[0].text, "one");
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances[2].text, "three");
                assert.equal(res.LUISContent[0].LUISJsonStructure.patterns.length, 0);
                done()
            })
            .catch(err => done(err))
    })

    it('Ability to pull in all patterns only', function(done) {
        let luContent = `
# intent1
- [all.lu](lu1#*patterns*)
        `;
        luMerger.Build([new luObj(luContent)], false, undefined, findLuFiles)
            .then(res => {
                assert.equal(res.LUISContent[0].LUISJsonStructure.utterances.length, 0);
                assert.equal(res.LUISContent[0].LUISJsonStructure.patterns.length, 1);
                assert.equal(res.LUISContent[0].LUISJsonStructure.patterns[0].pattern, "pattern {one}");
                assert.equal(res.LUISContent[0].LUISJsonStructure.patterns[0].intent, "intent1");

                done()
            })
            .catch(err => done(err))
    })
})
    
const findLuFiles = async function(srcId, idsToFind){
    let retPayload = [];
    idsToFind.forEach(ask => {
        switch(ask.filePath) {
            case 'qna1': 
                retPayload.push(new luObj(`
# ? q1
\`\`\`
answer1
\`\`\`

# ? q2
\`\`\`
answer2
\`\`\`
`, new luOptions(ask.filePath, false)));
                break;
            case 'qna2':
                retPayload.push(new luObj(`
# ? book flight
- please book a flight
- I need a flight
- I'm looking to fly
\`\`\`
Sure, happpy to help
\`\`\`
`, new luOptions(ask.filePath, false)));
                break;
            case 'qna3':
                retPayload.push(new luObj(`
# ? book flight
- please book a flight
- I need a flight
- I'm looking to fly
\`\`\`
Sure, happpy to help
\`\`\`

$botframework : qna-alterations=
- bot framework
- Microsoft bot framework
`, new luOptions(ask.filePath, false)));
                break;

            case 'qna4':
                retPayload.push(new luObj(`
# ? book flight
- please book a flight
- I need a flight
- I'm looking to fly
\`\`\`
Sure, happpy to help
\`\`\`

$botframework : qna-alterations=
- bot framework
- Microsoft bot framework

$myListName1 : qna-alterations=
- test list
`, new luOptions(ask.filePath, false)));
                break;

            case 'lu1':
                retPayload.push(new luObj(`
# i1
- one
- two

# i2
- three

# i4
- four
- pattern {one}
`, new luOptions(ask.filePath, false)));
                break;
        }
    })
    return retPayload;
}