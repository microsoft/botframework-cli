/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Templates, SwitchCaseBodyContext } from 'botbuilder-lg';
import * as fs from 'fs-extra';
import * as ppath from 'path';
import * as os from 'os';
import * as LuParser from '../../../lu/src/parser/lufile/LuParser';
import * as sectionOperator from '../../../lu/src/parser/lufile/sectionOperator';
import * as LUSectionTypes from '../../../lu/src/parser/utils/enums/lusectiontypes';

export enum FeedbackType {
    message,
    info,
    warning,
    error
}

export type Feedback = (type: FeedbackType, message: string) => void

/**
 * @description: Integrate two bot assets to generate one merged bot asset
 * @param schemaName 
 * @param oldPath
 * @param newPath
 * @param mergedPath
 * @param locale
 * @param feedback
 */
export async function integrateAssets(schemaName: string, oldPath: string, newPath: string, mergedPath: string, locale: string, feedback?: Feedback): Promise<boolean> {

    if (!feedback) {
        feedback = (_info, _message) => true
    }

    fs.ensureDir(ppath.join(mergedPath, locale))
    fs.ensureDir(ppath.join(mergedPath, 'luis'))
    feedback(FeedbackType.message, `Locales: ${JSON.stringify(locale)} `)

    try {
        const { oldPropertySet, newPropertySet } = await parseSchemas(schemaName, oldPath, newPath, mergedPath, feedback)

        await mergeDialogs(schemaName, oldPath, newPath, mergedPath, oldPropertySet, newPropertySet, feedback)
        await mergeLUFiles(schemaName, oldPath, newPath, mergedPath, locale, oldPropertySet, newPropertySet, feedback)
        await mergeLGFiles(schemaName, oldPath, newPath, mergedPath, locale, oldPropertySet, newPropertySet, feedback)
        await mergeOtherFiles(oldPath, newPath, mergedPath, locale, feedback)
    } catch (e) {
        feedback(FeedbackType.error, e.message)
    }

    return true
}

/**
 * @description: merge other types of files, e.g qna files
 * @param oldPath
 * @param newPath
 * @param mergedPath
 * @param locale
 * @param feedback
 */
async function mergeOtherFiles(oldPath: string, newPath: string, mergedPath: string, locale: string, feedback: Feedback): Promise<void> {
    let dirList = [oldPath, oldPath + '/luis', oldPath + '/' + locale]
    let fileSet = new Set<string>()

    for (let dir of dirList) {
        let tempDir = mergedPath
        if (dir.endsWith('luis')) {
            tempDir = mergedPath + '/luis'
        } else if (dir.endsWith(locale)) {
            tempDir = mergedPath + '/' + locale
        }
        let files = await fs.readdir(dir)
        for (let file of files) {
            let stat = fs.lstatSync(ppath.join(dir, file))
            if (stat.isFile()) {
                if (!file.endsWith('.dialog') && !file.endsWith('.lu') && !file.endsWith('.lg')) {
                    fs.copyFileSync(ppath.join(dir, file), ppath.join(tempDir, file))
                    feedback(FeedbackType.info, `copy ${file}`)
                    fileSet.add(file)
                }
            }
        }
    }

    let newDirList = [newPath, newPath + '/luis', newPath + '/' + locale]
    for (let dir of newDirList) {
        let tempDir = mergedPath
        if (dir.endsWith('luis')) {
            tempDir = mergedPath + '/luis'
        } else if (dir.endsWith(locale)) {
            tempDir = mergedPath + '/' + locale
        }
        let files = await fs.readdir(dir)
        for (let file of files) {
            let stat = fs.lstatSync(ppath.join(dir, file))
            if (stat.isFile()) {
                if (!file.endsWith('.dialog') && !file.endsWith('.lu') && !file.endsWith('.lg') && !fileSet.has(file)) {
                    fs.copyFileSync(ppath.join(dir, file), ppath.join(tempDir, file))
                    feedback(FeedbackType.info, `copy ${file}`)
                }
            }
        }
    }
}

/**
 * @description: Merge lu files from two assets based on the new and old root lu files
 * @param schemaName 
 * @param oldPath
 * @param newPath
 * @param mergedPath
 * @param locale
 * @param oldPropertySet
 * @param newPropertySet
 * @param feedback
 */
async function mergeLUFiles(schemaName: string, oldPath: string, newPath: string, mergedPath: string, locale: string, oldPropertySet: Set<string>, newPropertySet: Set<string>, feedback: Feedback): Promise<void> {

    let oldText = await fs.readFile(ppath.join(oldPath, 'luis', schemaName + '.' + locale + '.lu'), 'utf8')
    let oldLUResource = LuParser.parse(oldText)
    let oldImportSections = oldLUResource.Sections.filter(s => s.SectionType === LUSectionTypes.IMPORTSECTION)

    let newText = await fs.readFile(ppath.join(newPath, 'luis', schemaName + '.' + locale + '.lu'), 'utf8')
    let newLUResource = LuParser.parse(newText)
    let newImportSections = newLUResource.Sections.filter(s => s.SectionType === LUSectionTypes.IMPORTSECTION)

    let resultRefs: string[] = []
    let oldRefSet = new Set<string>()

    for (let oldImportSection of oldImportSections) {
        let oldRef = oldImportSection.Description
        oldRefSet.add(oldRef)
        let extractedProperty = await equalPattern(oldRef, oldPropertySet, schemaName)
        if (extractedProperty != undefined) {
            if (newPropertySet.has(extractedProperty)) {
                resultRefs.push(oldRef + '(' + oldImportSection.Path + ')')
                let refStr = oldRef.split(']')
                let luFile = refStr[0].replace('[', '')
                // handle with lu file has enums 
                if (luFile.match(extractedProperty + 'Entity')) {
                    changeEntityEnumLU(oldPath, newPath, mergedPath, luFile, locale, feedback)
                } else {
                    fs.copyFileSync(ppath.join(oldPath, locale, luFile), ppath.join(mergedPath, locale, luFile))
                    feedback(FeedbackType.info, `copy ${luFile}`)
                }
            }
        } else {
            resultRefs.push(oldRef + '(' + oldImportSection.Path + ')')
            let refStr = oldRef.split(']')
            let luFile = refStr[0].replace('[', '')
            fs.copyFileSync(ppath.join(oldPath, locale, luFile), ppath.join(mergedPath, locale, luFile))
            feedback(FeedbackType.info, `copy ${luFile}`)
        }
    }

    // integrate new lu files which do not exist in old lu assets
    for (let newImportSection of newImportSections) {
        let newRef = newImportSection.Description
        if (!oldRefSet.has(newRef)) {
            resultRefs.push(newRef + '(' + newImportSection.Path + ')')
            let refStr = newRef.split(']')
            let luFile = refStr[0].replace('[', '')
            fs.copyFileSync(ppath.join(newPath, locale, luFile), ppath.join(mergedPath, locale, luFile))
            feedback(FeedbackType.info, `copy ${luFile}`)
        }
    }

    let library = resultRefs.join(os.EOL)
    if (oldText.match('>>>')) {
        library = '>>> Library' + os.EOL + library
    }

    // write merged root lu file
    await fs.writeFile(ppath.join(mergedPath, 'luis', schemaName + '.' + locale + '.lu'), library)
    feedback(FeedbackType.info, `generate ${schemaName}. ${locale}.lu`)

    // copy .lu.dialog file
    fs.copyFileSync(ppath.join(newPath, 'luis', schemaName + '.' + locale + '.lu.dialog'), ppath.join(mergedPath, 'luis', schemaName + '.' + locale + '.lu.dialog'))
    feedback(FeedbackType.info, `copy ${schemaName}.${locale}.lu.dialog`)
}

/**
 * @description: Merge individual lu files which have List Entity Section 
 * @param oldPath
 * @param newPath
 * @param mergedPath
 * @param filename
 * @param locale
 * @param feedback 
 */
async function changeEntityEnumLU(oldPath: string, newPath: string, mergedPath: string, filename: string, locale: string, feedback: Feedback): Promise<void> {
    let text = await fs.readFile(ppath.join(newPath, locale, filename), 'utf8')
    let newLUResource = LuParser.parse(text)
    let newEntitySections = newLUResource.Sections.filter(s => s.SectionType === LUSectionTypes.NEWENTITYSECTION)

    text = await fs.readFile(ppath.join(oldPath, locale, filename), 'utf8')
    let oldLUResource = LuParser.parse(text)
    let oldEntitySections = oldLUResource.Sections.filter(s => s.SectionType === LUSectionTypes.NEWENTITYSECTION)
    let odlSectionOp = new sectionOperator(oldLUResource)
    let updatedLUResource: any = null

    let oldListEntitySections = oldEntitySections.filter(s => s.Type === 'list')
    for (let oldListEntitySection of oldListEntitySections) {
        for (let newEntitySection of newEntitySections) {
            if (newEntitySection.Name != oldListEntitySection.Name) {
                continue
            }
            let enumValueMap = new Map<string, string[]>()
            let enumSet = new Set<string>()
            let resultStatements: string[] = []

            //get new enum value set
            for (let i = 0; i < newEntitySection.ListBody.length; i++) {
                // if the string has : (e.g., - multiGrainWheat :), parse it as an enum entity
                if (newEntitySection.ListBody[i].match(':')) {
                    let enumEntity = newEntitySection.ListBody[i].replace('-', '').replace(':', '').trim()
                    // add all statements following current enum entity
                    let temp: string[] = []
                    let j = i + 1
                    while (j < newEntitySection.ListBody.length) {
                        if (!newEntitySection.ListBody[j].match(':')) {
                            temp.push(newEntitySection.ListBody[j])
                            j++
                            if (j == newEntitySection.ListBody.length) {
                                enumValueMap.set(enumEntity, temp)
                            }
                        } else {
                            enumValueMap.set(enumEntity, temp)
                            i = j - 1
                            break
                        }
                    }
                }
            }

            //parse old lu entity list and delete the enum entity which does not exist in new lu file
            for (let i = 0; i < oldListEntitySection.ListBody.length; i++) {
                // if the string has : (e.g., - multiGrainWheat :), parse it as an enum entity
                if (oldListEntitySection.ListBody[i].match(':')) {
                    let enumEntity = oldListEntitySection.ListBody[i].replace('-', '').replace(':', '').trim()
                    enumSet.add(enumEntity)
                    if (!enumValueMap.has(enumEntity)) {
                        continue
                    }
                    resultStatements.push(oldListEntitySection.ListBody[i])
                    let j = i + 1
                    while (j < oldListEntitySection.ListBody.length) {
                        if (!oldListEntitySection.ListBody[j].match(':')) {
                            resultStatements.push(oldListEntitySection.ListBody[j])
                            j++
                        } else {
                            i = j - 1
                            break
                        }
                    }
                }
            }

            // add  new enum entity in the new  lu file 
            for (var [key, values] of enumValueMap) {
                if (!enumSet.has(key)) {
                    resultStatements.push('\t- ' + key + ' :')
                    for (let newStatement of values) {
                        resultStatements.push(newStatement)
                    }
                }
            }
            // update content 
            let entityLUContent = resultStatements.join(os.EOL)
            let entityLUName = '@ ' + oldListEntitySection.Type + ' ' + oldListEntitySection.Name + ' ='
            let sectionBody = entityLUName + os.EOL + entityLUContent
            updatedLUResource = odlSectionOp.updateSection(oldListEntitySection.Id, sectionBody)
        }
    }
    if (updatedLUResource == null) {
        await fs.writeFile(ppath.join(mergedPath, locale, filename), oldLUResource.Content)
        feedback(FeedbackType.info, `generate ${filename}`)
    } else {
        await fs.writeFile(ppath.join(mergedPath, locale, filename), updatedLUResource.Content)
        feedback(FeedbackType.info, `generate ${filename}`)
    }
}




/**
 * @description: Merge lg files of two assets based on the new and old root lg files
 * @param schemaName
 * @param oldPath
 * @param newPath
 * @param mergedPath
 * @param locale
 * @param oldPropertySet
 * @param newPropertySet
 * @param feedback
 */
async function mergeLGFiles(schemaName: string, oldPath: string, newPath: string, mergedPath: string, locale: string, oldPropertySet: Set<string>, newPropertySet: Set<string>, feedback: Feedback): Promise<void> {

    let refs = await (await fs.readFile(ppath.join(oldPath, locale, schemaName + '.' + locale + '.lg'), 'utf8')).split('\n')

    let resultRefs: string[] = []
    let oldRefSet = new Set<string>()
    for (let ref of refs) {
        if (ref.match('>>>')) {
            resultRefs.push(ref)
            continue
        }
        oldRefSet.add(ref)
        let extractedProperty = await equalPattern(ref, oldPropertySet, schemaName)
        if (extractedProperty != undefined) {
            if (newPropertySet.has(extractedProperty)) {
                resultRefs.push(ref)
                let refStr = ref.split('.lg')
                let lgFile = refStr[0].replace('[', '') + '.' + locale + '.lg'
                if (lgFile.match(extractedProperty + 'Entity')) {
                    changeEntityEnumLG(oldPath, newPath, mergedPath, lgFile, locale, feedback)
                } else {
                    fs.copyFileSync(ppath.join(oldPath, locale, lgFile), ppath.join(mergedPath, locale, lgFile))
                    feedback(FeedbackType.info, `copy ${lgFile}`)
                }
            }
        } else {
            resultRefs.push(ref)
            let refStr = ref.split('.lg')
            let lgFile = refStr[0].replace('[', '') + '.' + locale + '.lg'
            fs.copyFileSync(ppath.join(oldPath, locale, lgFile), ppath.join(mergedPath, locale, lgFile))
            feedback(FeedbackType.info, `copy ${lgFile}`)
        }
    }

    refs = await (await fs.readFile(ppath.join(newPath, locale, schemaName + '.' + locale + '.lg'), 'utf8')).split('\n')

    for (let ref of refs) {
        if (ref.match('>>>')) {
            continue
        }
        if (!oldRefSet.has(ref)) {
            resultRefs.push(ref)
            let refStr = ref.split('.lg')
            let lgFile = refStr[0].replace('[', '') + '.' + locale + '.lg'
            fs.copyFileSync(ppath.join(newPath, locale, lgFile), ppath.join(mergedPath, locale, lgFile))
            feedback(FeedbackType.info, `copy ${lgFile}`)
        }
    }

    //let library = resultRefs.join(os.EOL)
    //library = '>>> Library\r\n' + library

    await fs.writeFile(ppath.join(mergedPath, locale, schemaName + '.' + locale + '.lg'), resultRefs.join(os.EOL))
    feedback(FeedbackType.info, `generate ${schemaName}. ${locale}.lg`)
}

/**
 * @description: Merge individual lg files which have the template with SWITCH ENUM
 * @param oldPath
 * @param newPath
 * @param mergedPath
 * @param filename
 * @param locale
 * @param feedback
 */
async function changeEntityEnumLG(oldPath: string, newPath: string, mergedPath: string, filename: string, locale: string, feedback: Feedback): Promise<void> {
    let oldText = await (await fs.readFile(ppath.join(oldPath, locale, filename), 'utf8'))
    let oldStatements = oldText.split('\n')
    let oldTemplates = Templates.parseText(oldText)

    let newText = await (await fs.readFile(ppath.join(newPath, locale, filename), 'utf8'))
    let newStatements = newText.split('\n')
    let newTemplates = Templates.parseText(newText)

    let mergedStatements: string[] = []

    let recordPart: object[] = []

    for (let oldTemplate of oldTemplates) {
        let oldBody = oldTemplate.parseTree.templateBody()
        if (oldBody == undefined) {
            continue
        }
        if (oldBody instanceof SwitchCaseBodyContext) {
            for (let newTemplate of newTemplates) {
                if (newTemplate.name != oldTemplate.name) {
                    continue
                }
                let newBody = newTemplate.parseTree.templateBody()
                if (newBody instanceof SwitchCaseBodyContext) {
                    let newSwitchStatements: string[] = []
                    let newEnumValueMap = new Map<string, number>()
                    let oldEnumEntitySet = new Set<string>()
                    let newRules = newBody.switchCaseTemplateBody().switchCaseRule()
                    for (let rule of newRules) {
                        let state = rule.switchCaseStat()
                        // get enumEntity and its following statements
                        if (state.text.match('\s*-\s*CASE:')) {
                            let enumEntity = state.text.replace('-CASE:${', '').replace('}', '')
                            let start = state.start.line
                            newEnumValueMap.set(enumEntity, start)
                        }
                    }

                    //parse old lg template and delete the enum entity which does not exist in new lg file and add new enum entity
                    const { startIndex, endIndex } = await parseLGTemplate(oldBody, oldStatements, newStatements, newEnumValueMap, oldEnumEntitySet, newSwitchStatements)

                    // let arr1 = oldStatements.slice(0, startIndex)
                    // let arr2 = oldStatements.slice(endIndex)
                    // mergedStatements = arr1.concat(newSwitchStatements).concat(arr2)

                    recordPart.push({ 'startIndex': startIndex, 'endIndex': endIndex, 'newSwitchStatements': newSwitchStatements })
                }
            }
        }
    }

    if (recordPart.length != 0) {
        let startSplit = 0
        let arrList: [string[]] = [[]]
        for (let obj of recordPart) {
            let arr = oldStatements.slice(startSplit, obj['startIndex'])
            arrList.push(arr)
            arrList.push(obj['newSwitchStatements'])
            startSplit = obj['endIndex']
        }

        if (startSplit != oldStatements.length) {
            let arr = oldStatements.slice(startSplit)
            arrList.push(arr)
        }

        for (let arr of arrList) {
            mergedStatements = mergedStatements.concat(arr)
        }
        await fs.writeFile(ppath.join(mergedPath, locale, filename), mergedStatements.join(os.EOL))
        feedback(FeedbackType.info, `generate ${filename}`)
    } else {
        feedback(FeedbackType.info, `generate ${filename}`)
    }
}

/**
 * @description: Update old LG Templte which has SWITCH ENUM
 * @param oldBody 
 * @param oldStatements
 * @param newStatements
 * @param newEnumValueMap
 * @param oldEnumEntitySet
 * @param newSwitchStatements
 */
async function parseLGTemplate(oldBody: any, oldStatements: string[], newStatements: string[], newEnumValueMap: Map<string, number>, oldEnumEntitySet: Set<string>, newSwitchStatements: string[]): Promise<{ startIndex: number, endIndex: number }> {
    let startIndex = 0
    let endIndex = 0
    let oldRules = oldBody.switchCaseTemplateBody().switchCaseRule()
    for (let rule of oldRules) {
        let state = rule.switchCaseStat()
        if (state.text.match('\s*-\s*SWITCH')) {
            startIndex = state.start.line - 1;
            newSwitchStatements.push(oldStatements[startIndex])
            let i = startIndex + 1
            while (!oldStatements[i].toLowerCase().match('case') && !oldStatements[i].toLowerCase().match('default')) {
                newSwitchStatements.push(oldStatements[i])
                i++
            }
        } else if (state.text.match('\s*-\s*CASE')) {
            let enumEntity = state.text.replace('-CASE:${', '').replace('}', '')
            oldEnumEntitySet.add(enumEntity)
            if (newEnumValueMap.has(enumEntity)) {
                let k = state.start.line - 1
                newSwitchStatements.push(oldStatements[k])
                k++
                while (!oldStatements[k].toLowerCase().match('case') && !oldStatements[k].toLowerCase().match('default')) {
                    newSwitchStatements.push(oldStatements[k])
                    k++
                }
            }
        } else if (state.text.match('\s*-\s*DEFAULT')) {
            for (var [key, value] of newEnumValueMap) {
                if (!oldEnumEntitySet.has(key)) {
                    let k = value - 1
                    newSwitchStatements.push(newStatements[k])
                    k++
                    while (!newStatements[k].toLowerCase().match('case') && !newStatements[k].toLowerCase().match('default')) {
                        newSwitchStatements.push(newStatements[k])
                        k++
                    }

                }
            }
            let m = state.start.line - 1
            newSwitchStatements.push(oldStatements[m])
            m++
            while (!oldStatements[m].match('#') && !oldStatements[m].startsWith('[')) {
                newSwitchStatements.push(oldStatements[m])
                m++
            }
            endIndex = m
        }
    }

    return { startIndex, endIndex }
}

/**
 * @description: Merge two .main.dialog files following the trigger ordering rule
 * @param schemaName
 * @param oldPath
 * @param newPath
 * @param mergedPath
 * @param oldPropertySet
 * @param newPropertySet
 * @param feedback
 */
async function mergeDialogs(schemaName: string, oldPath: string, newPath: string, mergedPath: string, oldPropertySet: Set<string>, newPropertySet: Set<string>, feedback: Feedback): Promise<void> {
    let template = await fs.readFile(ppath.join(oldPath, schemaName + '.main.dialog')
        , 'utf8')
    let oldObj = JSON.parse(template)
    template = await fs.readFile(ppath.join(newPath, schemaName + '.main.dialog')
        , 'utf8')
    let newObj = JSON.parse(template)

    let newTriggers: string[] = []
    let newTriggerSet = new Set<string>()

    // remove triggers whose property does not exist in new property set
    let reducedOldTriggers: string[] = []
    let reducedOldTriggerSet = new Set<string>()

    let mergedTriggers: string[] = []

    for (let trigger of newObj['triggers']) {
        if (typeof trigger != 'string') {
            // todo inline object
            continue
        }
        newTriggers.push(trigger)
        newTriggerSet.add(trigger)
    }

    for (let trigger of oldObj['triggers']) {
        if (typeof trigger != 'string') {
            // todo inline object
            continue
        }
        let extractedProperty = await equalPattern(trigger, oldPropertySet, schemaName)
        if (extractedProperty != undefined) {
            if (newPropertySet.has(extractedProperty)) {
                reducedOldTriggers.push(trigger)
                reducedOldTriggerSet.add(trigger)
            }
        } else {
            reducedOldTriggers.push(trigger)
            reducedOldTriggerSet.add(trigger)
        }
    }

    let i = 0
    while (!reducedOldTriggerSet.has(newTriggers[i]) && i < newTriggers.length) {
        mergedTriggers.push(newTriggers[i])
        fs.copyFileSync(ppath.join(newPath, newTriggers[i] + '.dialog'), ppath.join(mergedPath, newTriggers[i] + '.dialog'))
        feedback(FeedbackType.info, `copy ${newTriggers[i]}.dialog`)
        i++
    }

    let j = 0

    while (j < reducedOldTriggers.length) {
        mergedTriggers.push(reducedOldTriggers[j])
        fs.copyFileSync(ppath.join(oldPath, reducedOldTriggers[j] + '.dialog'), ppath.join(mergedPath, reducedOldTriggers[j] + '.dialog'))
        feedback(FeedbackType.info, `copy ${reducedOldTriggers[j]}.dialog`)
        let index = newTriggers.indexOf(reducedOldTriggers[j])
        if (index != -1) {
            index++
            while (index < newTriggers.length && !reducedOldTriggerSet.has(newTriggers[index])) {
                mergedTriggers.push(newTriggers[index])
                fs.copyFileSync(ppath.join(newPath, newTriggers[index] + '.dialog'), ppath.join(mergedPath, newTriggers[index] + '.dialog'))
                feedback(FeedbackType.info, `copy ${newTriggers[index]}.dialog`)
                index++
            }
        }
        j++
    }

    oldObj['triggers'] = mergedTriggers
    await fs.writeFile(ppath.join(mergedPath, schemaName + '.main.dialog'), JSON.stringify(oldObj))
    feedback(FeedbackType.info, `generate ${schemaName}.main.dialog`)
}

/**
 * @description: Compare the filename pattern for .lu file
 * @param filename
 * @param propertySet
 * @param schemaName 
 */
async function equalPattern(filename: string, propertySet: Set<string>, schemaName: string): Promise<string | undefined> {
    for (let property of propertySet) {
        let pattern1 = schemaName + '-' + property + '-'
        let pattern2 = schemaName + '-' + property + 'Entity'
        let pattern3 = schemaName + '-' + property + '.'
        if (filename.match(pattern1) || filename.match(pattern2) || filename.match(pattern3)) {
            return property
        }
    }

    return undefined
}

/**
 * @description: Get the old property set and new property set from schema files
 * @param schemaName
 * @param oldPath
 * @param newPath
 * @param mergedPath
 * @param feedback
 */
async function parseSchemas(schemaName: string, oldPath: string, newPath: string, mergedPath: string, feedback: Feedback): Promise<{ oldPropertySet: Set<string>, newPropertySet: Set<string> }> {

    let oldPropertySet = new Set<string>()
    let newPropertySet = new Set<string>()

    let template = await fs.readFile(ppath.join(oldPath, schemaName + '.schema.dialog'), 'utf8')
    let oldObj = JSON.parse(template)

    template = await fs.readFile(ppath.join(newPath, schemaName + '.schema.dialog'), 'utf8')
    let newObj = JSON.parse(template)

    for (let property in oldObj['properties']) {
        oldPropertySet.add(property)
    }
    for (let property in newObj['properties']) {
        newPropertySet.add(property)
    }

    await fs.copyFileSync(ppath.join(newPath, schemaName + '.schema.dialog'), ppath.join(mergedPath, schemaName + '.schema.dialog'))
    feedback(FeedbackType.info, `copy ${schemaName}.schema.dialog`)
    return { oldPropertySet, newPropertySet }
}
