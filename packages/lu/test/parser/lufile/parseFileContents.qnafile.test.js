/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const chai = require('chai');
const assert = chai.assert;
const parseFile = require('./../../../src/parser/lufile/parseFileContents').parseFile;
const retCode = require('./../../../src/parser/utils/enums/CLI-errors').errorCode;
const collate = require('./../../../src/parser/qna/qnamaker/kbCollate').collate

describe('With parse file function', function() {
    it('Throws when input lu file has invalid URIs', function(done){
        let fileContent = `[InvalidPDF](https://download.microsoft.com/download/2/9/B/29B20383-302C-4517-A006-B0186F04BE28/surface-pro-4-user-guide-EN2.pdf)`;
        parseFile(fileContent, false, null)
            .then(res => done('Test fail! did not throw when expected'))
            .catch(err => {
                assert.equal(err.errCode, retCode.INVALID_URI);
                done()
            })
    });

    it('correctly parses files available for ingestion in parse toqna', function(done){
        let fileContent = `[Valid PDF](https://download.microsoft.com/download/2/9/B/29B20383-302C-4517-A006-B0186F04BE28/surface-pro-4-user-guide-EN.pdf)`;
        parseFile(fileContent, false, null)
            .then(res => {
                assert.equal(res.qnaJsonStructure.files[0].fileUri, 'https://download.microsoft.com/download/2/9/B/29B20383-302C-4517-A006-B0186F04BE28/surface-pro-4-user-guide-EN.pdf');
                done();
            })
            .catch(err => done(err))
    });

    it('correctly collates multiple file references in parse toqna', async function() {
        let fileContent = `[Valid PDF](https://download.microsoft.com/download/2/9/B/29B20383-302C-4517-A006-B0186F04BE28/surface-pro-4-user-guide-EN.pdf)`;
        let Blob1 = await parseFile(fileContent, false, null);
        let Blob2 = await parseFile(fileContent, false, null);
        let qnaList = [Blob1.qnaJsonStructure, Blob2.qnaJsonStructure]
        let qna = collate(qnaList)
        assert.equal(qna.files[0].fileUri, 'https://download.microsoft.com/download/2/9/B/29B20383-302C-4517-A006-B0186F04BE28/surface-pro-4-user-guide-EN.pdf');
    })

    it('filters can appear before answer', function(done){
        let fileContent = `
# ?hello

**Filters:**
- a=b

\`\`\`markdown
hi there
\`\`\`
`;
        parseFile(fileContent)
            .then(res => {
                assert.equal(res.qnaJsonStructure.qnaList[0].metadata.length, 1);
                assert.equal(res.qnaJsonStructure.qnaList[0].metadata[0].name, "a");
                assert.equal(res.qnaJsonStructure.qnaList[0].metadata[0].value, "b");
                done();
            })
            .catch(err => done(err))
    })

    it('filters can appear after answer', function(done){
        let fileContent = `
# ?hello

\`\`\`markdown
hi there
\`\`\`

**Filters:**
- a=b
`;
        parseFile(fileContent)
            .then(res => {
                assert.equal(res.qnaJsonStructure.qnaList[0].metadata.length, 1);
                assert.equal(res.qnaJsonStructure.qnaList[0].metadata[0].name, "a");
                assert.equal(res.qnaJsonStructure.qnaList[0].metadata[0].value, "b");
                done();
            })
            .catch(err => done(err))
    })

    it('answer can be specified with markdown prefix', function(done){
        let fileContent = `
# ?hello

\`\`\`markdown
hi there
\`\`\`

**Filters:**
- a=b
`;
        parseFile(fileContent)
            .then(res => {
                assert.equal(res.qnaJsonStructure.qnaList[0].answer, "hi there");
                done();
            })
            .catch(err => done(err))
    })

    it('answer can be specified WITHOUT markdown prefix', function(done){
        let fileContent = `
# ?hello

\`\`\`
hi there
\`\`\`

**Filters:**
- a=b
`;
        parseFile(fileContent)
            .then(res => {
                assert.equal(res.qnaJsonStructure.qnaList[0].answer, "hi there");
                done();
            })
            .catch(err => done(err))
    })
    

});