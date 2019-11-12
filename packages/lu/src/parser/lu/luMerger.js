const fs = require('fs');
const path = require('path');
const deepEqual = require('deep-equal')
const parseFileContents = require('./../lufile/parseFileContents');
const retCode = require('./../utils/enums/CLI-errors');
const helpers = require('./../utils/helpers');
const hClasses = require('./../lufile/classes/hclasses');
const exception = require('./../utils/exception');
const luObject = require('./../lu/lu');
const parserObject = require('./../lufile/classes/parserObject');
const txtfile = require('./../lufile/read-text-file');
const BuildDiagnostic = require('./../lufile/diagnostic').BuildDiagnostic;
const LUISObjNameEnum = require('./../utils/enums/luisobjenum');

module.exports = {
    /**
     * Merges Lu/QnA files into a parserObject.
     * @param {Array<Lu>} luObjArray Array of LU/QnA files to be merge
     * @param {boolean} verbose indicates if we need verbose logging.
     * @param {string} luis_culture LUIS locale code
     * @param {function} luSearchFn function to retrieve the lu files found in the references
     * @returns {parserObject} Object that contains list of parsed LUIS object, list of parsed QnA object and list of parsed QnA Alteration Content
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    Build: async function(luObjArray, verbose, luis_culture, luSearchFn){
        let allParsedContent = await buildLuJsonObject(luObjArray, verbose, luis_culture, luSearchFn)
        await resolveReferencesInUtterances(allParsedContent)
        return allParsedContent
    }
}

const buildLuJsonObject = async function(luObjArray, log, luis_culture, luSearchFn = findLuFilesInDir){
    let allParsedLUISContent = []
    let allParsedQnAContent = []
    let allParsedAlterationsContent = []
    let filesToParse = luObjArray
    let parsedFiles = []
    while (filesToParse.length > 0) {
        let luOb = filesToParse[0]
        // skip this file if we have parsed it already
        if (parsedFiles.includes(luOb.id)) {
            filesToParse.splice(0,1)
            continue
        }

        let parsedContent = await parseLuFile(luOb, log, luis_culture)
        parsedFiles.push(luOb.id)

        if (haveLUISContent(parsedContent.LUISJsonStructure)
            && parsedContent.LUISJsonStructure.validate()) {
            allParsedLUISContent.push(parserObject.create(parsedContent.LUISJsonStructure, undefined, undefined, luOb.id, luOb.includeInCollate))
        }

        allParsedQnAContent.push(parserObject.create(undefined, parsedContent.qnaJsonStructure, undefined, luOb.id, luOb.includeInCollate))
        allParsedAlterationsContent.push(parserObject.create(undefined, undefined, parsedContent.qnaAlterations, luOb.id, luOb.includeInCollate))
        // remove this file from the list
        filesToParse.splice(0,1)
        
        // add additional files to parse to the list
        if(parsedContent.additionalFilesToParse.length <= 0) {
            continue
        }

        let foundLuFiles = await luSearchFn(luOb.id, parsedContent.additionalFilesToParse)    
        for( let i = 0; i < foundLuFiles.length; i++){ 
            if (parsedFiles.includes(foundLuFiles[i].id)) {
                let duplicated = foundLuFiles.splice(i--, 1)
                updateParsedFiles(allParsedLUISContent, allParsedQnAContent, allParsedAlterationsContent, duplicated)
            }
        }

        filesToParse = filesToParse.concat(foundLuFiles)
    }
    return {
        LUISContent: allParsedLUISContent,
        QnAContent: allParsedQnAContent,
        QnAAlterations: allParsedAlterationsContent
    }
}

const findLuFilesInDir = async function(srcId, idsToFind){
    let luObjects = []
    let parentFilePath = srcId === 'stdin' ? process.cwd() : path.parse(path.resolve(srcId)).dir
    for(let idx = 0; idx < idsToFind.length; idx++ ) {
        // Support wild cards at the end of a relative .LU file path. 
        // './bar/*' should look for all .lu files under the specified folder.
        // './bar/**' should recursively look for .lu files under sub-folders as well.
        let file = idsToFind[idx]
        if(file.filePath.endsWith('*')) {
            const isRecursive = file.filePath.endsWith('**')
            const rootFolder = file.filePath.replace(/\*/g, '')
            let rootPath = rootFolder;
            if(!path.isAbsolute(rootFolder)) {
                rootPath = path.resolve(parentFilePath, rootFolder);
            } 
            // Get LU files in this location
            const luFilesToAdd = helpers.findLUFiles(rootPath, isRecursive);
            // add these to filesToParse
            for(let f = 0; f < luFilesToAdd.length; f++){
                luObjects.push(new luObject(readLuFile(luFilesToAdd[f]), luFilesToAdd[f], file.includeInCollate))
            } 
            continue
        } 

        if(!path.isAbsolute(file.filePath)) {
            file.filePath = path.resolve(parentFilePath, file.filePath)
        } 
        // find matching parsed files and ensure includeInCollate is updated if needed.
        luObjects.push(new luObject(readLuFile(file.filePath), file.filePath, file.includeInCollate))
        
    }
    return luObjects
}

const updateParsedFiles = function(allParsedLUISContent, allParsedQnAContent, allParsedAlterationsContent, luobject) {
    // find the instance and ensure includeInCollate property is set correctly 
    if(luobject.includeInCollate) {
        let matchInLUIS = allParsedLUISContent.find(item => item.srcFile == luobject.id);
        if(matchInLUIS) matchInLUIS.includeInCollate = true;

        let matchInQnA = allParsedQnAContent.find(item => item.srcFile == luobject.id);
        if(matchInQnA) matchInQnA.includeInCollate = true;

        let matchInAlterations = allParsedAlterationsContent.find(item => item.srcFile == luobject.id);
        if(matchInAlterations) matchInAlterations.includeInCollate = true;
    }
} 

const haveLUISContent = function(blob) {
    if(!blob) return false;
    return ((blob[LUISObjNameEnum.INTENT].length > 0) ||
    (blob[LUISObjNameEnum.ENTITIES].length > 0) || 
    (blob[LUISObjNameEnum.CLOSEDLISTS].length > 0) ||
    (blob[LUISObjNameEnum.PATTERNANYENTITY].length > 0) ||
    (blob.patterns.length > 0) ||
    (blob[LUISObjNameEnum.UTTERANCE].length > 0) ||
    (blob.prebuiltEntities.length > 0) ||
    (blob[LUISObjNameEnum.REGEX].length > 0) ||
    (blob.model_features.length > 0) ||
    (blob.composites.length > 0));
}

const resolveReferencesInUtterances = async function(allParsedContent) {
    // find LUIS utterances that have references
    (allParsedContent.LUISContent || []).forEach(luisModel => {
        if (!luisModel.includeInCollate) return;
        let newUtterancesToAdd = [];
        let newPatternsToAdd = [];
        let spliceList = [];
        resolveNewUtterancesAndPatterns(luisModel, allParsedContent, newUtterancesToAdd, newPatternsToAdd, spliceList)
        // remove reference utterances from the list. The spliceList needs to be sorted so splice will actually work.
        spliceList.sort((a,b) => a-b).forEach((item, idx) => luisModel.LUISJsonStructure.utterances.splice((item - idx), 1));
        // add new utterances to the list
        newUtterancesToAdd.forEach(item => luisModel.LUISJsonStructure.utterances.push(item));
        // add new patterns to the list
        newPatternsToAdd.forEach(item => luisModel.LUISJsonStructure.patterns.push(item));

        newPatternsToAdd.forEach(patternObject => {
            if(!patternObject.pattern.includes('{')) return 
            let entityRegex = new RegExp(/\{(.*?)\}/g);
            let entitiesFound = patternObject.pattern.match(entityRegex);

            entitiesFound.forEach(function (entity) {
                entity = entity.replace("{", "").replace("}", "");
                let entityName = entity;
                let roleName = '';
                if (entity.includes(':')) {
                    // this is an entity with role
                    [entityName, roleName] = entity.split(':');
                }
                // insert the entity only if it does not already exist
                let paIdx = -1;
                let patternAnyInMaster = luisModel.LUISJsonStructure.patternAnyEntities.find((item, idx) => {
                    if (item.name === entityName) {
                        paIdx = idx;
                        return true;
                    }
                    return false;
                });
                // insert the entity only if it does not already exist
                if (isNewEntity(luisModel, entityName)) {
                    if (!patternAnyInMaster && roleName !== '') {
                        parseFileContents.addItemOrRoleIfNotPresent(luisModel.LUISJsonStructure, LUISObjNameEnum.PATTERNANYENTITY, entityName, [roleName])
                        return
                    }

                    if (!patternAnyInMaster) {
                        parseFileContents.addItemIfNotPresent(luisModel.LUISJsonStructure, LUISObjNameEnum.PATTERNANYENTITY, entity);
                        return
                    }
                    // add the role if it does not exist already.
                    if (roleName !== '') {
                        !patternAnyInMaster.roles.includes(roleName) ? patternAnyInMaster.roles.push(roleName) : undefined;    
                    }
                    return               
                } 
                // we found this pattern.any entity as another type.
                if (patternAnyInMaster && paIdx !== -1) {
                    // remove the patternAny entity from the list because it has been explicitly defined elsewhere.
                    luisModel.LUISJsonStructure.patternAnyEntities.splice(paIdx, 1);
                }
            })
            
        })
    })
}

const resolveNewUtterancesAndPatterns = function(luisModel, allParsedContent, newUtterancesToAdd, newPatternsToAdd, spliceList){
    (luisModel.LUISJsonStructure.utterances || []).forEach((utterance, idx) => {
        // Fix for BF-CLI #122. 
        // Ensure only links are detected and passed on to be parsed.
        if (!helpers.isUtteranceLinkRef(utterance.text || '')) {
            return
        }

        // we have stuff to parse and resolve
        let parsedUtterance = helpers.parseLinkURI(utterance.text);

        if (!path.isAbsolute(parsedUtterance.luFile)) parsedUtterance.luFile = path.resolve(path.dirname(luisModel.srcFile), parsedUtterance.luFile);
        // see if we are in need to pull LUIS or QnA utterances
        let filter = parsedUtterance.ref.endsWith('?') ? filterQuestionMarkRef : filterLuisContent

        // find the parsed file
        let result = filter(allParsedContent, parsedUtterance, luisModel, utterance)
        
        result.utterances.forEach((utr) => newUtterancesToAdd.push(new hClasses.uttereances(utr, utterance.intent)))
        result.patterns.forEach((it) => newPatternsToAdd.push(new hClasses.pattern(it, utterance.intent)))
        spliceList.push(idx)
    });
}

const filterQuestionMarkRef = function(allParsedContent, parsedUtterance, luisModel, utterance){
    let result = {
        utterances: [],
        patterns: []
    }

    if (!parsedUtterance.ref.endsWith('?')) {
        return result
    }

    let parsedQnABlobs
    if( parsedUtterance.luFile.endsWith('*')) {
        parsedQnABlobs = (allParsedContent.QnAContent || []).filter(item => item.srcFile.includes(parsedUtterance.luFile.replace(/\*/g, '')));
    } else {
        // look for QnA
        parsedQnABlobs = []
        parsedQnABlobs.push((allParsedContent.QnAContent || []).find(item => item.srcFile == parsedUtterance.luFile));
    }

    if(!parsedQnABlobs || !parsedQnABlobs[0]) {
        let error = BuildDiagnostic({
            message: `Unable to parse ${utterance.text} in file: ${luisModel.srcFile}`
        });

        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
    }

    parsedQnABlobs.forEach(blob => blob.qnaJsonStructure.qnaList.forEach(item => item.questions.forEach(question => result.utterances.push(question))));
    return result
}

const filterLuisContent = function(allParsedContent, parsedUtterance, luisModel, utterance){
    let parsedLUISBlob = (allParsedContent.LUISContent || []).find(item => item.srcFile == parsedUtterance.luFile);
    if(!parsedLUISBlob ) {
        let error = BuildDiagnostic({
            message: `Unable to parse ${utterance.text} in file: ${luisModel.srcFile}`
        });

        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
    }

    let utterances = [], patterns = [];
    let result = {
        utterances: [],
        patterns: []
    }
    if (parsedUtterance.ref.toLowerCase().includes('utterancesandpatterns')) {
        // get all utterances and add them
        utterances = parsedLUISBlob.LUISJsonStructure.utterances;
        // Find all patterns and add them
        (parsedLUISBlob.LUISJsonStructure.patterns || []).forEach(item => {
            let newUtterance = new hClasses.uttereances(item.pattern, item.intent);
            if (utterances.find(match => deepEqual(newUtterance, match)) !== undefined) utterances.push(new hClasses.uttereances(item.pattern, item.intent)) 
        });
    } else if (parsedUtterance.ref.toLowerCase().includes('utterances')) {
        // get all utterances and add them
        utterances = parsedLUISBlob.LUISJsonStructure.utterances;
    } else if (parsedUtterance.ref.toLowerCase().includes('patterns')) {
        // Find all patterns and add them
        (parsedLUISBlob.LUISJsonStructure.patterns || []).forEach(item => utterances.push(new hClasses.uttereances(item.pattern, item.intent)));
    } else {
        // get utterance list from reference intent and update list
        let referenceIntent = parsedUtterance.ref.replace(/-/g, ' ').trim();
        utterances = parsedLUISBlob.LUISJsonStructure.utterances.filter(item => item.intent == referenceIntent);
        // find and add any patterns for this intent
        patterns = parsedLUISBlob.LUISJsonStructure.patterns.filter(item => item.intent == referenceIntent);
    }

    (utterances || []).forEach(item => result.utterances.push(item.text));
    (patterns || []).forEach(item => result.patterns.push(item.pattern));
    return result
}

const isNewEntity = function(luisModel, entityName){
    let simpleEntityInMaster = luisModel.LUISJsonStructure.entities.find(item => item.name == entityName);
    let compositeInMaster = luisModel.LUISJsonStructure.composites.find(item => item.name == entityName);
    let listEntityInMaster = luisModel.LUISJsonStructure.closedLists.find(item => item.name == entityName);
    let regexEntityInMaster = luisModel.LUISJsonStructure.regex_entities.find(item => item.name == entityName);
    let prebuiltInMaster = luisModel.LUISJsonStructure.prebuiltEntities.find(item => item.name == entityName);

    return !simpleEntityInMaster && 
    !compositeInMaster &&
    !listEntityInMaster &&
    !regexEntityInMaster &&
    !prebuiltInMaster
}

const readLuFile = function(file) {
    if(!fs.existsSync(path.resolve(file))) {
        let error = BuildDiagnostic({
            message: `Sorry unable to open [${file}]`
        });
        throw(new exception(retCode.errorCode.FILE_OPEN_ERROR, error.toString()));     
    }
    
    let fileContent = txtfile.readSync(file);
    if (!fileContent) {
        let error = BuildDiagnostic({
            message: `Sorry, error reading file: ${file}`
        });
        throw(new exception(retCode.errorCode.FILE_OPEN_ERROR, error.toString()));
    }
    return fileContent
}

const parseLuFile = async function(luOb, log, luis_culture) {
    let parsedContent = ''
    if (!luOb.content) {
        let error = BuildDiagnostic({ message: `Cannot parse empty ${luOb.id}. Please add content to the file or remove it.` })
        throw(new exception(retCode.errorCode.INVALID_INPUT_FILE, error.toString()));
    } 
    try {
        parsedContent = await parseFileContents.parseFile(luOb.content, log, luis_culture);
    } catch (err) {
        throw(err);
    }
    if (!parsedContent) {
        let error = BuildDiagnostic({
            message: `Sorry, file ${luOb.id} had invalid content`
        });
        throw(new exception(retCode.errorCode.INVALID_INPUT_FILE, error.toString()));
    } 
    return parsedContent
}
