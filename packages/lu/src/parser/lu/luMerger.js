/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fs = require('fs');
const path = require('path');
const parseFileContents = require('./../lufile/parseFileContents');
const retCode = require('./../utils/enums/CLI-errors');
const helpers = require('./../utils/helpers');
const hClasses = require('./../lufile/classes/hclasses');
const exception = require('./../utils/exception');
const luObject = require('./lu');
const luOptions = require('./luOptions')
const parserObject = require('./../lufile/classes/parserObject');
const txtfile = require('./../lufile/read-text-file');
const BuildDiagnostic = require('./../lufile/diagnostic').BuildDiagnostic;
const LUISObjNameEnum = require('./../utils/enums/luisobjenum');
const fetch = require('node-fetch');

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
        let refTree = await buildRefTree(allParsedContent, luSearchFn)
        resolveTreeRefs(refTree, luObjArray);
        return allParsedContent
    }
}

const buildRefTree = async function(allParsedContent, luSearchFn) {
    let refs = {};
    await Promise.all(allParsedContent.LUISContent.map(async (parserObj, objIdx) => {
        let luObj = {
            obj : parserObj.LUISJsonStructure,
            srcFile : parserObj.srcFile,
            refs : []
        };
        if (refs[parserObj.srcFile] === undefined) {
             refs[parserObj.srcFile] = {
                'luis': luObj
            };
        } else {
            if (refs[parsedObj.srcFile].luis === undefined) {
                ref[parserObj.srcFile].luis = luObj;
            }
        }
        parserObj.LUISJsonStructure.uttHash = {};
        (parserObj.LUISJsonStructure.utterances || []).forEach(async (utterance, uttIdx) => {
            parserObj.LUISJsonStructure.uttHash[utterance.text] = '';
            if (helpers.isUtteranceLinkRef(utterance.text)) {
                let parsedLinkUri = await helpers.parseLinkURI(utterance.text, parserObj.srcFile, luSearchFn);
                refs[parserObj.srcFile].luis.refs.push({
                    refId: parsedLinkUri.fileName,
                    uttId: uttIdx,
                    parsedLink: parsedLinkUri,
                    uttObj: utterance,
                    text: utterance.text,
                    type: 'luis'
                })
            }
        })
    }))

    await Promise.all(allParsedContent.QnAContent.map(async (parserObj, objIdx) => {
        let qnaObj = {
            obj : parserObj.qnaJsonStructure,
            alt : allParsedContent.QnAAlterations[objIdx].qnaAlterations,
            srcFile : parserObj.srcFile,
            refs : []
        }
        if (refs[parserObj.srcFile] === undefined) {
            refs[parserObj.srcFile] = {'qna': qnaObj};
        } else {
            if (refs[parserObj.srcFile].qna === undefined) {
                refs[parserObj.srcFile].qna = qnaObj;
            }
        }
        (parserObj.qnaJsonStructure.qnaList.forEach(async qnaPair => {
            qnaPair.questions.forEach(async (question, qIdx) => {
                if (helpers.isUtteranceLinkRef(question)) {
                    let parsedLinkUri = await helpers.parseLinkURI(question)
                    refs[parserObj.srcFile].qna.refs.push({
                        refId: parsedLinkUri.fileName,
                        qId: qIdx,
                        text: question,
                        qObj: qnaPair,
                        parsedLink: parsedLinkUri,
                        type: 'qna'
                    })
                }
            })
        }))
    }));

    return refs;
}

const resolveTreeRefs = function(refTree, luObjArray) {
    (luObjArray || []).forEach(luObj => {
        resolveRefs(refTree, luObj.id)
    })
}

const resolveRefs = function(refTree, srcId) {
    if (refTree[srcId] !== undefined && refTree[srcId].luis) {
        // sort by refs
        refTree[srcId].luis.refs.sort((a, b) => a.uttId - b.uttId)

        refTree[srcId].luis.refs.forEach((ref, rIdx) => {

            if (ref.IdsVisited === undefined) {
                ref.IdsVisited = [srcId];
            } else {
                if(ref.IdsVisited.includes(srcId)) {
                    // throw
                    let error = BuildDiagnostic({
                        message: `Loop detected for reference '${ref.text}' as ${ref.IdsVisited} -> ${srcId}`
                    });

                    throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));                
                } else {
                    ref.IdsVisited.push(srcId);
                }
            }

            let result = resolveRefByType(srcId, ref, refTree)

            // process utterances and patterns.
            let luObj = refTree[srcId].luis.obj;

            // remove the reference utterance
            luObj.utterances.splice((ref.uttId - rIdx), 1);

            // add new utterances
            if (result.utterances !== undefined) {
                result.utterances.forEach(utt => {
                    if (luObj.uttHash[utt] === undefined) {
                        luObj.utterances.push(new hClasses.utterances(utt, ref.uttObj.intent));
                        luObj.uttHash[utt] = '';
                    }
                })
            }
            
            if (result.patterns !== undefined) {
                // add new patterns
                result.patterns.forEach(patt => {
                    luObj.patterns.push(new hClasses.pattern(patt, ref.uttObj.intent));
                    if(!patt.includes('{')) return 
                    handlePatternAnyEntity(patt, luObj);
                })
            }
        })

        delete refTree[srcId].luis.obj.uttHash;
    }
    
    if (refTree[srcId] !== undefined && refTree[srcId].qna) {
        // Handle qna refs
        (refTree[srcId].qna.refs || []).forEach((ref, rIdx) => {
            let result = resolveRefByType(srcId, ref, refTree)

            if (result.patterns && result.patterns.length !== 0) {
                // throw
                let error = BuildDiagnostic({
                    message: `Unable to parse ${ref.q} in file: ${srcId}. References cannot pull in patterns. Consider '*utterances*' suffix if you are looking to pull in only utteranes`
                });
        
                throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
            }

            // process utterances
            let qObj = ref.qObj;
            // remove the reference utterance
            qObj.questions.splice((ref.qId - rIdx), 1);
            // add new utterances
            result.utterances.forEach(utt => qObj.questions.push(utt));
        })
    }
    
}

const handlePatternAnyEntity = function(patt, luObj) {
    let entityRegex = new RegExp(/\{(.*?)\}/g);
    let entitiesFound = patt.match(entityRegex);

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
        let patternAnyInMaster = luObj.patternAnyEntities.find((item, idx) => {
            if (item.name === entityName) {
                paIdx = idx;
                return true;
            }
            return false;
        });
        // insert the entity only if it does not already exist
        if (isNewEntity(luObj, entityName)) {
            if (!patternAnyInMaster && roleName !== '') {
                parseFileContents.addItemOrRoleIfNotPresent(luObj, LUISObjNameEnum.PATTERNANYENTITY, entityName, [roleName])
                return
            }

            if (!patternAnyInMaster) {
                parseFileContents.addItemIfNotPresent(luObj, LUISObjNameEnum.PATTERNANYENTITY, entity);
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
            luObj.patternAnyEntities.splice(paIdx, 1);
        }
    })
}

const resolveQuestionRef = function(srcId, ref, refTree) {
    let utterances = [];
    let patterns = [];
    let srcFile = refTree[srcId][ref.type].srcFile;
    let newId = path.resolve(path.dirname(srcFile ? srcFile : ''), ref.parsedLink.fileName);
    let tgtId = (refTree[ref.parsedLink.fileName] && refTree[ref.parsedLink.fileName].qna !== undefined) ? ref.parsedLink.fileName : undefined;
    tgtId = (tgtId === undefined && refTree[newId] !== undefined && refTree[newId].qna !== undefined) ? newId : tgtId;
    let tgtObj = refTree[ref.parsedLink.fileName] || refTree[newId] || undefined;
    if (!tgtObj && !ref.parsedLink.fileName.endsWith('*')) {
        let error = BuildDiagnostic({
            message: `Unable to parse ${ref.text} in file: ${srcFile}. Cannot find reference.`
        });
        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
    }
    // Resolve additional references if any in tgt obj
    if (tgtObj && ((tgtObj.luis && tgtObj.luis.refs.length !== 0) || (tgtObj.qna && tgtObj.qna.refs.length !== 0)))
        resolveRefs(refTree, tgtId);
    let parseLCasePath = ref.parsedLink.path.toLowerCase();
    let qnaObj = tgtObj && tgtObj.qna && tgtObj.qna.obj ? tgtObj.qna.obj : undefined;
    let qnaAlt = tgtObj && tgtObj.qna && tgtObj.qna.alt ? tgtObj.qna.alt : undefined;
    let parsedQnABlobs = qnaObj !== undefined ? [qnaObj] : [];
    let parsedQnAAlterations = qnaAlt !== undefined ? [qnaAlt] : [];
    if (ref.parsedLink.fileName.endsWith('*')) {
        // this notation is only valid with file path. So try as file path.
        let tPath = ref.parsedLink.fileName.replace(/\*/g, '');
        for (let prop in refTree) {
            if (prop.startsWith(path.resolve(path.dirname(srcFile), tPath))) {
                parsedQnABlobs.push(refTree[prop].qna.obj);
                parsedQnAAlterations.push(refTree[prop].qna.alt)
            }
        }
    }
    if (parseLCasePath.startsWith('*answers*')) {
        parsedQnABlobs.forEach(blob => blob.qnaList.forEach(item => utterances.push(item.answer)));
    } else if (ref.parsedLink.path.length > 1 && parseLCasePath.startsWith('?') && parseLCasePath.endsWith('?')) {
        let itemsFound = undefined;
        let testQuestion = ref.parsedLink.path.replace(/\?/g, '').replace(/-/g, ' ').trim();
        // find the specific question
        parsedQnABlobs.forEach(blob => {
            if (itemsFound) return;
            itemsFound = blob.qnaList.find(item => item.questions.includes(testQuestion));
        })
        if (itemsFound) {
            itemsFound.questions.forEach(question => utterances.push(question));
        }
    } else if (parseLCasePath.startsWith('*alterations*')) {
        parsedQnAAlterations.forEach(blob => blob.wordAlterations.forEach(item => item.alterations.forEach(alter => utterances.push(alter))));
    } else if (parseLCasePath.startsWith('$') && parseLCasePath.endsWith('?')) {
        // specific alteration to find 
        let alterToFind = ref.parsedLink.path.replace(/[$\?]/g, '').trim();
        parsedQnAAlterations.forEach(blob => blob.wordAlterations.forEach(item => {
            if (item.alterations.includes(alterToFind)) {
                item.alterations.forEach(alter => utterances.push(alter));
            }
        }));
    } else {
        parsedQnABlobs.forEach(blob => blob.qnaList.forEach(item => item.questions.forEach(question => utterances.push(question))));
    }
    return {utterances, patterns}
}

const resolveUttAndPattRef = function(srcId, ref, refTree) {
    let utterances = [];
    let patterns = [];
    let srcFile = refTree[srcId][ref.type].srcFile;
    let newId = path.resolve(path.dirname(srcFile ? srcFile : ''), ref.parsedLink.fileName)
    let tgtId = (refTree[ref.parsedLink.fileName] && refTree[ref.parsedLink.fileName].luis !== undefined) ? ref.parsedLink.fileName : undefined;
    tgtId = (tgtId === undefined && refTree[newId] !== undefined && refTree[newId].luis !== undefined) ? newId : tgtId;
    let tgtObj = refTree[ref.parsedLink.fileName] || refTree[newId] || undefined;
    if (!tgtObj) {
        let error = BuildDiagnostic({
            message: `Unable to parse ${ref.text} in file: ${srcFile}. Cannot find reference.`
        });

        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
    }
    // Resolve additional references if any in tgt obj
    if ((tgtObj.luis && tgtObj.luis.refs.length !==0) || (tgtObj.qna && tgtObj.qna.refs.length !==0)) resolveRefs(refTree, tgtId)

    let parseLCasePath = ref.parsedLink.path.toLowerCase();
    let luisObj = tgtObj.luis.obj;
    let referenceIntent = undefined;
    if (parseLCasePath.endsWith('*utterancesandpatterns*')) {
        // get utterance list from reference intent and update list
        referenceIntent = parseLCasePath.replace(/-/g, ' ').replace('*utterancesandpatterns*', '').trim();
    } else if (parseLCasePath.endsWith('*utterances*')) {
        // get utterance list from reference intent and update list
        referenceIntent = parseLCasePath.replace(/-/g, ' ').replace('*utterances*', '').trim();
        patterns = undefined;
    } else if (parseLCasePath.endsWith('*patterns*')) {
        // get utterance list from reference intent and update list
        referenceIntent = parseLCasePath.replace(/-/g, ' ').replace('*patterns*', '').trim();
        utterances = undefined;
    } else if (parseLCasePath.endsWith('*')) {
        referenceIntent = undefined;
    } else {
        // get utterance list from reference intent and update list
        referenceIntent = parseLCasePath.replace(/-/g, ' ').trim();
    }
    if (utterances !== undefined) {
        luisObj.utterances.forEach(item => {
            if (referenceIntent !== undefined && referenceIntent !== "") {
                if (item.intent.toLowerCase() === referenceIntent.toLowerCase()) {
                    utterances.push(item.text)
                } 
            } else {
                utterances.push(item.text)
            }
        })
    }
    if (patterns !== undefined) {
        luisObj.patterns.forEach(patt => {
            if (referenceIntent !== undefined && referenceIntent !== "") {
                if (patt.intent.toLowerCase() === referenceIntent.toLowerCase()) {
                    patterns.push(patt.pattern)
                }
            } else {
                patterns.push(patt.pattern)
            }
        })
    }
    return {utterances, patterns};
}

const resolveRefByType = function(srcId, ref, refTree) {
    let filter = ref.parsedLink.path.endsWith('?') ? resolveQuestionRef : resolveUttAndPattRef
    return filter(srcId, ref, refTree);
}

const buildLuJsonObject = async function(luObjArray, log, luis_culture, luSearchFn = resolveLuContent){
    let allParsedLUISContent = []
    let allParsedQnAContent = []
    let allParsedAlterationsContent = []
    let filesToParse = Array.from(luObjArray)
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

        allParsedLUISContent.push(parserObject.create(parsedContent.LUISJsonStructure, undefined, undefined, luOb.id, luOb.includeInCollate))

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
const resolveLuContent = async function(srcId, idsToFind){
    let luObjects = [];
    for(let idx = 0; idx < idsToFind.length; idx++) {
        let toResolve = idsToFind[idx];
        if (isUrl(toResolve.filePath)) {
            await resolveLuUriContent(srcId, toResolve, luObjects);
        } else {
            resolveLuFileContent(toResolve, luObjects, srcId);
        }
    }
    return luObjects;
}
const resolveLuFileContent = function(file, luObjects, srcId) {
    let parentFilePath = srcId === 'stdin' ? process.cwd() : path.parse(path.resolve(srcId)).dir
    // Support wild cards at the end of a relative .LU file path. 
    // './bar/*' should look for all .lu files under the specified folder.
    // './bar/**' should recursively look for .lu files under sub-folders as well.
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
            const opts = new luOptions(luFilesToAdd[f], file.includeInCollate)
            luObjects.push(new luObject(readLuFile(luFilesToAdd[f]), opts))
        } 
        return
    } 

    if(!path.isAbsolute(file.filePath)) {
        file.filePath = path.resolve(parentFilePath, file.filePath)
    } 
    // find matching parsed files and ensure includeInCollate is updated if needed.
    luObjects.push(new luObject(readLuFile(file.filePath), new luOptions(file.filePath, file.includeInCollate)))
}
const resolveLuUriContent = async function(srcId, toResolve, luObjects) {
    let uri = toResolve.filePath || undefined;
    if (uri !== undefined) {
        let response;
        try {
            response = await fetch(uri, { method: 'GET' });
        } catch (err) {
            // throw, invalid URI
            let errorMsg = `URI: "${uri}" appears to be invalid. Please double check the URI or re-try this parse when you are connected to the internet.`;
            let error = BuildDiagnostic({
                message: errorMsg
            })
    
            throw (new exception(retCode.errorCode.INVALID_URI, error.toString(), [error]));
        }
        var res = await response.buffer();
        var encodedRes = helpers.fixBuffer(res);
        luObjects.push(new luObject(encodedRes, new luOptions(toResolve.filePath, toResolve.includeInCollate)));
    }
}
const isUrl = function(path) {
    try {
        new URL(path);
        return true;
    } catch (err) {
        return false;
    }
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

const isNewEntity = function(luisModel, entityName){
    let simpleEntityInMaster = luisModel.entities.find(item => item.name == entityName);
    let compositeInMaster = luisModel.composites.find(item => item.name == entityName);
    let listEntityInMaster = luisModel.closedLists.find(item => item.name == entityName);
    let regexEntityInMaster = luisModel.regex_entities.find(item => item.name == entityName);
    let prebuiltInMaster = luisModel.prebuiltEntities.find(item => item.name == entityName);

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
        err.source = luOb.id;
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
