/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const modules = {
    parser: {
        parseLuList: require('./converters/lutoluisconverter').parseLuToLuis,
        parseFile: require('./lufile/parseFileContents').parseFile,
        validateLUISBlob: require('./luisfile/parseLuisFile').validateLUISBlob
    },
    refresh: {
        constructMdFromLUIS: require('./converters/luistoluconverter').constructMdFromLUISJSON,
        constructMdFromQnA: require('./converters/qnajsontoqnaconverter').constructMdFromQnAJSON,
        constructMdFromQnAAlteration: require('./converters/qnajsontoqnaconverter').constructMdFromQnAAlterationJSON
    },
    translate: {
        parseAndTranslate: require('./lufile/translate-helpers').parseAndTranslate,
        translateText: require('./lufile/translate-helpers').translateText
    },
    helperEnums: {
        errorCodes: require('./lufile/enums/CLI-errors').errorCode,
        parseCommands: require('./lufile/enums/parsecommands'),
    },
    helperClasses: {
        Exception: require('./lufile/classes/exception'),
        LUIS: require('./lufile/classes/LUIS'),
        QnA: require('./lufile/classes/qna'),
        Parser: require('./lufile/classes/parserObject')
    }
};
module.exports = modules;