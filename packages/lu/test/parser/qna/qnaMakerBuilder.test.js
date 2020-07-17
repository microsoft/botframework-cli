const QnAMakerBuilder = require('./../../../src/parser/qna/qnamaker/qnaMakerBuilder')
const QnA = require('./../../../src/parser/lu/qna')
const qnaOptions = require('./../../../src/parser/lu/qnaOptions')
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

    it('Build QnaMaker app from multiple instances that have prompts', async () => {
        let qnaContent1 =
        `> !# @qna.pair.source = crosstrained
        # ? hi
        \`\`\`markdown
        hi from crosstrained
        \`\`\``;

        let qnaContent2 =
        `# ? greeting
        \`\`\`markdown
        how to greeting
        \`\`\`
        
        **Prompts:**
        - [hi greeting](#hi)`;

        let qnaContent3 =
        `# ? hi
        \`\`\`markdown
        say hi
        \`\`\``;
        const qna1 = new QnA(qnaContent1, new qnaOptions())
        const qna2 = new QnA(qnaContent2, new qnaOptions())
        const qna3 = new QnA(qnaContent3, new qnaOptions())
        const qnaMakerObject = await QnAMakerBuilder.fromQna([qna1, qna2, qna3])

        assert.equal(qnaMakerObject.kb.qnaList[0].id, 2);
        assert.equal(qnaMakerObject.kb.qnaList[1].id, 3);
        assert.equal(qnaMakerObject.kb.qnaList[2].id, 1);
        assert.equal(qnaMakerObject.kb.qnaList[1].context.prompts[0].qnaId, 1);
    });

});