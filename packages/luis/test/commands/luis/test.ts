const fs = require('fs-extra')
const path = require('path')

const includesString = async function (file: string, content: string) {
    const result = await fs.readFile(path.join(__dirname, file))
    return result.includes(content);
  }

includesString('./../../../interruptionGen/main.qna', '# DeferToRecognizer_').then(res => console.log(res));