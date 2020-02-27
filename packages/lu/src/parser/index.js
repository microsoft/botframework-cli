/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const modules = {
    parser: {
        parseFile: require('./lufile/parseFileContents').parseFile,
        validateLUISBlob: require('./luis/luisValidator')
    },
    refresh: {
        constructMdFromLUIS: require('./luis/luConverter'),
        constructMdFromQnA: require('./qna/qnamaker/qnaConverter'),
        constructMdFromQnAAlteration: require('./qna/alterations/qnaConverter')
    },
    translate: {
        parseAndTranslate: require('./lufile/translate-helpers').parseAndTranslate,
        translateText: require('./lufile/translate-helpers').translateText
    },
    helperEnums: {
        errorCodes: require('./utils/enums/CLI-errors').errorCode,
        parseCommands: require('./utils/enums/parsecommands'),
    },
    helperClasses: {
        Exception: require('./utils/exception'),
        LUIS: require('./luis/luis'),
        QnA: require('./qna/qnamaker/qnamaker'),

        Parser: require('./lufile/classes/parserObject')
    },
    luBuild: {	
        Builder: require('./lubuild/builder').Builder	
    },
    V2 : {
        Luis: require('./luis/luis'),
        LU: require('./lu/lu'),
        LuisBuilder: require('./luis/luisBuilder'),
        QNA: require('./lu/qna'),
        QnAMaker: require('./qna/qnamaker/qnamaker'),
        KB: require('./qna/qnamaker/kb'),
        Alterations: require('./qna/alterations/alterations'),
        QnAMakerBuilder: require('./qna/qnamaker/qnaMakerBuilder'),
        Exception: require('./utils/exception')
    }
};

module.exports = modules;