/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Command, flags } from '@microsoft/bf-cli-command';
import { LGParser, SwitchCaseBodyContext } from 'botbuilder-lg';
import * as fs from 'fs-extra';
import * as ppath from 'path';
import * as LuParser from '../../../../lu/src/parser/lufile/LuParser';
import * as sectionOperator from '../../../../lu/src/parser/lufile/sectionOperator';
import * as LUSectionTypes from '../../../../lu/src/parser/utils/enums/lusectiontypes';

export default class DialogIntegrate extends Command {

    static flags: flags.Input<any> = {
        help: flags.help({ char: 'h' }),
        schemaName: flags.string({ char: 's', description: 'schema name ', required: true }),
        oldPath: flags.string({ char: 'o', description: 'path of old assets ', required: true }),
        newPath: flags.string({ char: 'n', description: 'path of new assets ', required: true }),
        mergedPath: flags.string({ char: 'm', description: 'path of merged assets ', required: true }),
        locale: flags.string({ char: 'l', description: 'locale', required: true }),
        verbose: flags.boolean({ description: 'output verbose logging of files as they are processed', default: false }),
    }

    static examples = [
        '$ bf dialog:integrete -s aaa -o /bbb -n /ccc -m /ddd -l : en-us'
    ]

    private schemaName = ''
    private oldPath = ''
    private newPath = ''
    private mergedPath = ''
    private locale = ''
    private verbose?= false

    async run() {
        const { argv, flags } = this.parse(DialogIntegrate)
        await this.integrateAssets(flags.schemaName, flags.oldPath, flags.newPath, flags.mergedPath, flags.locale, flags.verbose)
    }

    async integrateAssets(schemaName: string, oldPath: string, newPath: string, mergedPath: string, locale: string, verbose: boolean): Promise<boolean> {

        this.schemaName = schemaName
        this.oldPath = oldPath
        this.newPath = newPath
        this.mergedPath = mergedPath
        this.locale = locale
        this.verbose = verbose

        fs.ensureDir(this.mergedPath)
        fs.ensureDir(ppath.join(this.mergedPath, this.locale))
        fs.ensureDir(ppath.join(this.mergedPath, 'luis'))

        const { oldPropertySet, newPropertySet } = await this.parseSchemas()
        await this.mergeDialogs(oldPropertySet, newPropertySet)
        await this.mergeLUFiles(oldPropertySet, newPropertySet)
        await this.mergeLGFiles(oldPropertySet, newPropertySet)

        return true
    }

    async mergeLUFiles(oldPropertySet: Set<string>, newPropertySet: Set<string>): Promise<void> {
        if (this.verbose) {
            this.log(`merge lu files`)
        }

        let oldText = await fs.readFile(ppath.join(this.oldPath, 'luis', this.schemaName + "." + this.locale + ".lu")
            , 'utf8')
        let oldLUResource = LuParser.parse(oldText)
        let oldImportSections = oldLUResource.Sections.filter(s => s.SectionType === LUSectionTypes.IMPORTSECTION)

        let newText = await fs.readFile(ppath.join(this.newPath, 'luis', this.schemaName + "." + this.locale + ".lu")
            , 'utf8')
        let newLUResource = LuParser.parse(newText)
        let newImportSections = newLUResource.Sections.filter(s => s.SectionType === LUSectionTypes.IMPORTSECTION)

        let resultRefs: string[] = []
        let oldRefSet = new Set<string>()

        for (let oldImportSection of oldImportSections) {
            let oldRef = oldImportSection.Description
            oldRefSet.add(oldRef)
            let extractedProperty = await this.equalPatternLU(oldRef, oldPropertySet, this.schemaName)
            if (extractedProperty != "") {
                if (newPropertySet.has(extractedProperty)) {
                    resultRefs.push(oldRef + "(" + oldImportSection.Path + ")")
                    let refStr = oldRef.split("]")
                    let luFile = refStr[0].replace("[", "")
                    // handle with lu file has enums 
                    if (luFile.match(extractedProperty + "Entity")) {
                        this.changeEntityEnumLU(this.oldPath, this.newPath, this.mergedPath, luFile, this.locale)
                    } else {
                        fs.copyFileSync(ppath.join(this.oldPath, this.locale, luFile), ppath.join(this.mergedPath, this.locale, luFile));
                    }
                }
            } else {
                resultRefs.push(oldRef + "(" + oldImportSection.Path + ")")
                let refStr = oldRef.split("]")
                let luFile = refStr[0].replace("[", "")
                fs.copyFileSync(ppath.join(this.oldPath, this.locale, luFile), ppath.join(this.mergedPath, this.locale, luFile));
            }
        }

        // integrate new lu files which do not exist in old lu assets
        for (let newImportSection of newImportSections) {
            let newRef = newImportSection.Description
            if (!oldRefSet.has(newRef)) {
                resultRefs.push(newRef + "(" + newImportSection.Path + ")")
                let refStr = newRef.split("]")
                let luFile = refStr[0].replace("[", "")
                fs.copyFileSync(ppath.join(this.newPath, this.locale, luFile), ppath.join(this.mergedPath, this.locale, luFile));
            }
        }

        let library = resultRefs.join("\r\n")
        library = ">>> Library\r\n" + library

        // write merged root lu file
        await fs.writeFile(ppath.join(this.mergedPath, "luis", this.schemaName + "." + this.locale + ".lu"), library)

        // copy .lu.dialog file
        fs.copyFileSync(ppath.join(this.newPath, 'luis', this.schemaName + "." + this.locale + ".lu.dialog"), ppath.join(this.mergedPath, 'luis', this.schemaName + "." + this.locale + ".lu.dialog"));
    }

    async changeEntityEnumLU(oldPath: string, newPath: string, mergedPath: string, filename: string, locale: string): Promise<void> {
        let text = await fs.readFile(ppath.join(newPath, locale, filename)
            , 'utf8')
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
                    if (newEntitySection.ListBody[i].match(":")) {
                        let enumEntity = newEntitySection.ListBody[i].replace("-", "").replace(":", "").trim()
                        // add all statements following current enum entity
                        let temp: string[] = []
                        let j = i + 1
                        while (j < newEntitySection.ListBody.length) {
                            if (!newEntitySection.ListBody[j].match(":")) {
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
                    if (oldListEntitySection.ListBody[i].match(":")) {
                        let enumEntity = oldListEntitySection.ListBody[i].replace("-", "").replace(":", "").trim()
                        enumSet.add(enumEntity)
                        if (!enumValueMap.has(enumEntity)) {
                            continue
                        }
                        resultStatements.push(oldListEntitySection.ListBody[i])
                        let j = i + 1
                        while (j < oldListEntitySection.ListBody.length) {
                            if (!oldListEntitySection.ListBody[j].match(":")) {
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
                        resultStatements.push("\t- " + key + " :")
                        for (let newStatement of values) {
                            resultStatements.push(newStatement)
                        }
                    }
                }
                // update content 
                let entityLUContent = resultStatements.join("\r\n")
                let entityLUName = "@ " + oldListEntitySection.Type + " " + oldListEntitySection.Name + " ="
                let sectionBody = entityLUName + "\r\n" + entityLUContent
                updatedLUResource = odlSectionOp.updateSection(oldListEntitySection.Id, sectionBody)
            }
        }
        if (updatedLUResource == null) {
            await fs.writeFile(ppath.join(mergedPath, locale, filename), oldLUResource.Content)
        }
        else {
            await fs.writeFile(ppath.join(mergedPath, locale, filename), updatedLUResource.Content)
        }
    }

    async mergeLGFiles(oldPropertySet: Set<string>, newPropertySet: Set<string>): Promise<void> {
        if (this.verbose) {
            this.log(`merge lg files`)
        }

        let refs = await (await fs.readFile(ppath.join(this.oldPath, this.locale, this.schemaName + "." + this.locale + ".lg"), 'utf8')).split("\n")

        let resultRefs: string[] = []
        let oldRefSet = new Set<string>()
        for (let ref of refs) {
            if (ref == ">>> Library") {
                continue
            }
            oldRefSet.add(ref)
            let extractedProperty = await this.equalPatternLG(ref, oldPropertySet, this.schemaName)
            if (extractedProperty != "") {
                if (newPropertySet.has(extractedProperty)) {
                    resultRefs.push(ref)
                    let refStr = ref.split(".lg")
                    let lgFile = refStr[0].replace("[", "") + "." + this.locale + ".lg"
                    if (lgFile.match(extractedProperty + "Entity")) {
                        this.changeEntityEnumLG(this.oldPath, this.newPath, this.mergedPath, lgFile, this.locale)
                    } else {
                        fs.copyFileSync(ppath.join(this.oldPath, this.locale, lgFile)
                            , ppath.join(this.mergedPath, this.locale, lgFile)
                        );
                    }
                }
            } else {
                resultRefs.push(ref)
                let refStr = ref.split(".lg")
                let lgFile = refStr[0].replace("[", "") + "." + this.locale + ".lg"
                fs.copyFileSync(ppath.join(this.oldPath, this.locale, lgFile)
                    , ppath.join(this.mergedPath, this.locale, lgFile)
                );
            }
        }

        refs = await (await fs.readFile(ppath.join(this.newPath, this.locale, this.schemaName + "." + this.locale + ".lg"), 'utf8')).split("\n")

        for (let ref of refs) {
            if (ref == ">>> Library") {
                continue
            }
            if (!oldRefSet.has(ref)) {
                resultRefs.push(ref)
                let refStr = ref.split(".lg")
                let lgFile = refStr[0].replace("[", "") + "." + this.locale + ".lg"
                fs.copyFileSync(ppath.join(this.newPath, this.locale, lgFile)
                    , ppath.join(this.mergedPath, this.locale, lgFile)
                );
            }
        }

        let library = resultRefs.join("\r\n")
        library = ">>> Library\r\n" + library

        await fs.writeFile(ppath.join(this.mergedPath, this.locale, this.schemaName + "." + this.locale + ".lg"), library)
    }

    async changeEntityEnumLG(oldPath: string, newPath: string, mergedPath: string, filename: string, locale: string): Promise<void> {
        let oldText = await (await fs.readFile(ppath.join(oldPath, locale, filename)
            , 'utf8'))
        let oldStatements = oldText.split("\n")
        let oldLGFile = LGParser.parseText(oldText)

        let newText = await (await fs.readFile(ppath.join(newPath, locale, filename)
            , 'utf8'))
        let newStatements = newText.split("\n")
        let newLGFile = LGParser.parseText(newText)

        let mergedStatements: string[] = []

        for (let oldTemplate of oldLGFile.templates) {
            let oldBody = oldTemplate.parseTree.templateBody()
            if (oldBody == undefined) {
                continue
            }
            if (oldBody instanceof SwitchCaseBodyContext) {
                for (let newTemplate of newLGFile.templates) {
                    let newBody = newTemplate.parseTree.templateBody()
                    if (newBody instanceof SwitchCaseBodyContext) {
                        let newSwitchStatements: string[] = []
                        let newEnumValueMap = new Map<string, number>()
                        let oldEnumEntitySet = new Set<string>()
                        let newRules = newBody.switchCaseTemplateBody().switchCaseRule()
                        for (let rule of newRules) {
                            let state = rule.switchCaseStat()
                            // get enumEntity and its following statements
                            if (state.text.startsWith("-CASE:")) {
                                let enumEntity = state.text.replace("-CASE:@{'", "").replace("}'", "")
                                let start = state.start.line
                                newEnumValueMap.set(enumEntity, start)
                            }
                        }

                        //parse old lg template and delete the enum entity which does not exist in new lg file and add new enum entity
                        const { startIndex, endIndex } = await this.parseLGTemplate(oldBody, oldStatements, newStatements, newEnumValueMap, oldEnumEntitySet, newSwitchStatements)

                        let arr1 = oldStatements.slice(0, startIndex)
                        let arr2 = oldStatements.slice(endIndex)
                        mergedStatements = arr1.concat(newSwitchStatements).concat(arr2)
                    }
                }
            }
        }

        if (mergedStatements.length != 0) {
            await fs.writeFile(ppath.join(mergedPath, locale, filename), mergedStatements.join("\r\n"))
        } else {
            await fs.writeFile(ppath.join(mergedPath, locale, filename), oldText)
        }
    }

    async parseLGTemplate(oldBody: any, oldStatements: string[], newStatements: string[], newEnumValueMap: Map<string, number>, oldEnumEntitySet: Set<string>, newSwitchStatements: string[]): Promise<{ startIndex: number, endIndex: number }> {
        let startIndex = 0
        let endIndex = 0
        let oldRules = oldBody.switchCaseTemplateBody().switchCaseRule()
        for (let rule of oldRules) {
            let state = rule.switchCaseStat()
            if (state.text.startsWith("-SWITCH")) {
                startIndex = state.start.line - 1;
                newSwitchStatements.push(oldStatements[startIndex])
                let i = startIndex + 1
                while (!oldStatements[i].match("CASE") && !oldStatements[i].match("DEFAULT")) {
                    newSwitchStatements.push(oldStatements[i])
                    i++
                }
            } else if (state.text.startsWith("-CASE")) {
                let enumEntity = state.text.replace("-CASE:@{'", "").replace("}'", "")
                oldEnumEntitySet.add(enumEntity)
                if (newEnumValueMap.has(enumEntity)) {
                    let k = state.start.line - 1
                    newSwitchStatements.push(oldStatements[k])
                    k++
                    while (!oldStatements[k].match("CASE") && !oldStatements[k].match("DEFAULT")) {
                        newSwitchStatements.push(oldStatements[k])
                        k++
                    }
                }
            } else if (state.text.startsWith("-DEFAULT")) {
                for (var [key, value] of newEnumValueMap) {
                    if (!oldEnumEntitySet.has(key)) {
                        let k = value - 1
                        newSwitchStatements.push(newStatements[k])
                        k++
                        while (!newStatements[k].match("CASE") && !newStatements[k].match("DEFAULT")) {
                            newSwitchStatements.push(newStatements[k])
                            k++
                        }

                    }
                }
                let m = state.start.line - 1
                newSwitchStatements.push(oldStatements[m])
                m++
                while (!oldStatements[m].match("#")) {
                    newSwitchStatements.push(oldStatements[m])
                    m++
                }
                endIndex = m
            }
        }

        return { startIndex, endIndex }
    }

    async mergeDialogs(oldPropertySet: Set<string>, newPropertySet: Set<string>): Promise<void> {
        if (this.verbose) {
            this.log(`Read old and new main.dialog files`)
        }
        let template = await fs.readFile(ppath.join(this.oldPath, this.schemaName + '.main.dialog')
            , 'utf8')
        let oldObj = JSON.parse(template)
        template = await fs.readFile(ppath.join(this.newPath, this.schemaName + '.main.dialog')
            , 'utf8')
        let newObj = JSON.parse(template)

        let newTriggers: string[] = []
        let newTriggerSet = new Set<string>()

        // remove triggers whose property does not exist in new property set
        let reducedOldTriggers: string[] = []
        let reducedOldTriggerSet = new Set<string>()

        let mergedTriggers: string[] = []

        for (let trigger of newObj["triggers"]) {
            newTriggers.push(trigger)
            newTriggerSet.add(trigger)
        }

        for (let trigger of oldObj["triggers"]) {
            let extractedProperty = await this.equalPatternDialog(trigger, oldPropertySet, this.schemaName)
            if (extractedProperty != "") {
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
            fs.copyFileSync(ppath.join(this.newPath, newTriggers[i] + ".dialog"), ppath.join(this.mergedPath, newTriggers[i] + ".dialog"))
            i++
        }

        let j = 0

        while (j < reducedOldTriggers.length) {
            mergedTriggers.push(reducedOldTriggers[j])
            fs.copyFileSync(ppath.join(this.oldPath, reducedOldTriggers[j] + ".dialog"), ppath.join(this.mergedPath, reducedOldTriggers[j] + ".dialog"))
            let index = newTriggers.indexOf(reducedOldTriggers[j])
            if (index != -1) {
                index++
                while (index < newTriggers.length && !reducedOldTriggerSet.has(newTriggers[index])) {
                    mergedTriggers.push(newTriggers[index])
                    fs.copyFileSync(ppath.join(this.newPath, newTriggers[index] + ".dialog")
                        , ppath.join(this.mergedPath, newTriggers[index] + ".dialog")
                    )
                    index++
                }
            }
            j++
        }

        oldObj["triggers"] = mergedTriggers
        await fs.writeFile(ppath.join(this.mergedPath, this.schemaName + ".main.dialog"), JSON.stringify(oldObj))
    }

    async equalPatternDialog(filename: string, propertySet: Set<string>, schemaName: string): Promise<string> {
        for (let property of propertySet) {
            let pattern1 = schemaName + "-" + property + "-"
            let pattern2 = schemaName + "-" + property + "Entity"
            if (filename.match(pattern1) || filename.match(pattern2)) {
                return property
            }
        }
        return ""
    }

    async equalPatternLU(filename: string, propertySet: Set<string>, schemaName: string): Promise<string> {
        for (let property of propertySet) {
            let pattern1 = schemaName + "-" + property + "-"
            let pattern2 = schemaName + "-" + property + "Entity"
            if (filename.match(pattern1) || filename.match(pattern2)) {
                return property
            }
        }
        return ""
    }

    async equalPatternLG(filename: string, propertySet: Set<string>, schemaName: string): Promise<string> {
        for (let property of propertySet) {
            let pattern1 = schemaName + "-" + property + "."
            let pattern2 = schemaName + "-" + property + "Entity"
            if (filename.match(pattern1) || filename.match(pattern2)) {
                return property
            }
        }
        return ""
    }

    async parseSchemas(): Promise<{ oldPropertySet: Set<string>, newPropertySet: Set<string> }> {
        if (this.verbose) {
            this.log(`Read old and new schemas`)
        }

        let oldPropertySet = new Set<string>()
        let newPropertySet = new Set<string>()

        let template = await fs.readFile(ppath.join(this.oldPath, this.schemaName + ".schema.dialog"), 'utf8')
        let oldObj = JSON.parse(template)

        template = await fs.readFile(ppath.join(this.newPath, this.schemaName + ".schema.dialog"), 'utf8')
        let newObj = JSON.parse(template)

        for (let property in oldObj["properties"]) {
            oldPropertySet.add(property)
        }
        for (let property in newObj["properties"]) {
            newPropertySet.add(property)
        }

        await fs.writeFile(ppath.join(this.mergedPath, this.schemaName + ".schema.dialog"), JSON.stringify(newObj))

        return { oldPropertySet, newPropertySet }
    }
}
