const QnAMakerBuilder = require('./../../../src/parser/qna/qnamaker/qnaMakerBuilder')
const QnA = require('./../../../src/parser/lu/qna')
var chai = require('chai');
var assert = chai.assert;

describe('QnAMakerBuilder', function() {
    it('Build QnaMaker app from qna content', async () => {
        let qnaContent = `> !# @kb.name = my test kb
        # ? hi
        \`\`\`markdown
        hello
        \`\`\``;
        const qnaMakerObject = await QnAMakerBuilder.fromContent(qnaContent)
        assert.equal(qnaMakerObject.kb.name, 'my test kb');
    });

    it('Build QnaMaker app from qna instance', async () => {
        let qnaContent = `> !# @kb.name = my test kb
        # ? hi
        \`\`\`markdown
        hello
        \`\`\``;
        const qna = new QnA(qnaContent, '')
        const qnaMakerObject = await QnAMakerBuilder.fromQna([qna])
        assert.equal(qnaMakerObject.kb.name, 'my test kb');
    });

});