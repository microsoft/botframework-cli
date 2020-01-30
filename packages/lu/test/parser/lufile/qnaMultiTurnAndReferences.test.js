/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const chai = require('chai');
const assert = chai.assert;
const luMerger = require('./../../../src/parser/lu/luMerger');
const luObj = require('../../../src/parser/lu/lu');
const parseFile = require('./../../../src/parser/lufile/parseFileContents').parseFile;
describe('QnA document', function() {
    describe('Negative tests', function() {
        it('QnA deep reference cannot pull in patterns.', function(done) {
            let qnaContent = `# ? [test](lu1#intent1)
            \`\`\`
            answer
            \`\`\`
            `;
            luMerger.Build([new luObj(qnaContent, 'stdin')], false, undefined, findLuFiles)
                .then(res => done(res))
                .catch(err => {
                    assert(err.text.includes("References cannot pull in patterns."))
                    done()
                })
        })

        it('Missing deep reference throws', function(done) {
            let qnaContent = `# ? [test](lu2#intent1)
            \`\`\`
            answer
            \`\`\`
            `;
            luMerger.Build([new luObj(qnaContent, 'stdin')], false, undefined, findLuFiles)
                .then(res => done(res))
                .catch(err => {
                    assert(err.text.includes("Cannot find reference."))
                    done()
                })
        })

        it('Invalid QnAId throws', function(done) {
            let qnaContent = `
            <a id="123">
            # ? question
            \`\`\`
            answer
            \`\`\`
            `;
            luMerger.Build([new luObj(qnaContent, 'stdin')], false, undefined, findLuFiles)
                .then(res => done(res))
                .catch(err => {
                    assert(err.text.includes("line 2:12 - line 2:13"))
                    done()
                })
        })

        it('Prompts must be valid links', function(done) {
            let qnaContent = `
            # ? question
            \`\`\`
            answer
            \`\`\`
            **Prompts:**
            [test](#?-test

            # ? test
            \`\`\`
            answer
            \`\`\`
            `;
            luMerger.Build([new luObj(qnaContent, 'stdin')], false, undefined, findLuFiles)
                .then(res => done(res))
                .catch(err => {
                    assert(err.text.includes("line 7:18 - line 7:19"))
                    done()
                })
        })

        it('Filters must be a list', function(done) {
            let qnaContent = `
            # ? question
            \`\`\`
            answer
            \`\`\`
            **Filters:**
            a = b
            `;
            luMerger.Build([new luObj(qnaContent, 'stdin')], false, undefined, findLuFiles)
                .then(res => done(res))
                .catch(err => {
                    assert(err.text.includes("line 7:0 - line 8:12: Invalid QnA filter line"))
                    done()
                })
        })

        it('\'markdown\' is optional for answer', function(done) {
            let qnaContent1 = `
            # ? question
            \`\`\`
            answer
            \`\`\`
            `;

            let qnaContent2 = `
            # ? question
            \`\`\`markdown
            answer
            \`\`\`
            `;
            luMerger.Build([new luObj(qnaContent1, 'stdin')], false, undefined, findLuFiles)
                .then(res => {
                    luMerger.Build([new luObj(qnaContent2, 'stdin')], false, undefined, findLuFiles)
                        .then(res1 => {
                            assert.deepEqual(res1, res)
                            done();
                        })
                        .catch(err => done(err))
                })
                .catch(err => done(err))
        })
    })
    
})

const findLuFiles = async function(srcId, idsToFind){
    let retPayload = [];
    idsToFind.forEach(ask => {
        switch(ask.filePath) {
            case 'lu1': 
                retPayload.push(new luObj(`
# intent1
- this is an {utterance}
`, ask.filePath, false));
                break;
            
        }
    })
    return retPayload;
}