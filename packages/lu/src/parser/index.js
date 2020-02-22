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
    sectionHandler: {
        luParser: require('./lufile/luParser'),
        sectionOperator: require('./lufile/sectionOperator'),
        luSectionTypes: require('./utils/enums/lusectiontypes')
    },
    Luis: require('./luis/luis'),
    LU: require('./lu/lu'),
    LuisBuilder: require('./luis/luisBuilder'),
    QnAMaker: require('./qna/qnamaker/qnamaker'),
    QnAMakerBuilder: require('./qna/qnamaker/qnaMakerBuilder'),
    QNA: require('./lu/qna'),
    Alterations: require('./qna/alterations/alterations'),
    AlterationsBuilder: require('./qna/alterations/alterationsBuilder'),
    Exception: require('./utils/exception')
};

module.exports = modules;