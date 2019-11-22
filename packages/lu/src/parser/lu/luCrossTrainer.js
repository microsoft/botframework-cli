const retCode = require('./../utils/enums/CLI-errors')
const helpers = require('./../utils/helpers')
const exception = require('./../utils/exception')
const luParser = require('./../lufile/luParser');
const SectionOperator = require('./../lufile/sectionOperator');
const LUSectionTypes = require('./../utils/enums/lusectiontypes');
const DiagnosticSeverity = require('./../lufile/diagnostic').DiagnosticSeverity;

module.exports = {
    /**
     * Do cross training among lu files
     * @param {luObject[]} luObjectArray the luObject list to be parsed
     * @param {any} crossTrainConfig cross train json config
     * @returns {Map<string, LUResource>} Map of file id and luResource
     * @throws {exception} Throws on errors. exception object includes errCode and text
     */
    luCrossTrain: async function (luObjectArray, crossTrainConfig) {
        try {
            const crossTrainConfigObj = JSON.parse(crossTrainConfig);
            const rootObjectIds = crossTrainConfigObj.rootIds;
            const triggerRules = crossTrainConfigObj.triggerRules;
            const intentName = crossTrainConfigObj.intentName;
            const verbose = crossTrainConfigObj.verbose;

            let fileIdToLuResourceMap = new Map();
            for (const luObject of luObjectArray) {
                let luContent = luObject.content;
                luContent = helpers.sanitizeNewLines(luContent);
                if (luContent === undefined || luContent === '') {
                    continue;
                }

                let luResource = luParser.parse(luContent);
                if (luResource.Errors && luResource.Errors.length > 0) {
                    if (verbose) {
                        var warns = luResource.Errors.filter(error => (error && error.Severity && error.Severity === DiagnosticSeverity.WARN));
                        if (warns.length > 0) {
                            process.stdout.write(warns.map(warn => warn.toString()).join('\n').concat('\n'));
                        }
                    }

                    var errors = luResource.Errors.filter(error => (error && error.Severity && error.Severity === DiagnosticSeverity.ERROR));
                    if (errors.length > 0) {
                        throw (new exception(retCode.errorCode.INVALID_LINE, errors.map(error => error.toString()).join('\n')));
                    }
                }

                fileIdToLuResourceMap.set(luObject.id, luResource);
            }

            /*
            resources is array of below object
            {
                id: a.lu
                content: LUResource
                children: [ {target: "b.lu", intent: "b"} , {target: "c.lu", intent: "c"}]
            }
            */
            let visitedChildren = new Set();
            let resources = [];
            let fileIdsFromInput = Array.from(fileIdToLuResourceMap.keys());
            for (const fileId of fileIdsFromInput) {
                let luResource = fileIdToLuResourceMap.get(fileId);
                let resource = {
                    id: fileId,
                    content: luResource,
                    children: []
                };

                if (fileId in triggerRules) {
                    let intents = [];
                    for (const section of luResource.Sections) {
                        if (section.SectionType === LUSectionTypes.SIMPLEINTENTSECTION 
                            || section.SectionType === LUSectionTypes.NESTEDINTENTSECTION) {
                            intents.push(section);
                        }
                    }

                    const destLuFileToIntent = triggerRules[fileId];
                    for (const destLuFile of Object.keys(destLuFileToIntent)) {
                        if (fileIdsFromInput.includes(destLuFile)) {
                            const triggerIntentName = destLuFileToIntent[destLuFile];
                            if (intents.some(i => i.Name === triggerIntentName)) {
                                if (visitedChildren.has(destLuFile)) {
                                    // validate loop in a tree or forest
                                    throw (new exception(retCode.errorCode.INVALID_INPUT, `Sorry, dialog call loop detected for lu file ${destLuFile} when doing cross training`));
                                } else {
                                    resource.children.push({
                                        target: destLuFile,
                                        intent: triggerIntentName
                                    });

                                    visitedChildren.add(destLuFile);
                                }
                            } else {
                                throw (new exception(retCode.errorCode.INVALID_INPUT, `Sorry, trigger intent '${triggerIntentName}' is not found in lu file: ${fileId}`));
                            }
                        }
                    }
                }

                resources.push(resource);
            }

            // do cross training from roots. One root one core training
            for (const rootObjectId of rootObjectIds) {
                if (resources.some(r => r.id === rootObjectId)) {
                    // do cross training for each root at top level
                    const result = this.crossTrain(rootObjectId, resources, intentName);
                    for (const res of result) {
                        fileIdToLuResourceMap.set(res.id, res.content);
                    }
                } else {
                    throw (new exception(retCode.errorCode.INVALID_INPUT, `Sorry, root lu file '${rootObjectId}' does not exist`));
                }
            }

            return fileIdToLuResourceMap;
        } catch (err) {
            throw (err)
        }
    },

    /**
     * Cross training core function. Do cross training from a root to its children once.
     * @param {string} rootResourceId the root resource object id
     * @param {any[]} resources all resource object list
     * @param {string} intentName interuption intent name
     * @returns {any[]} updated resource objects
     * @throws {exception} Throws on errors. exception object includes errCode and text
     */
    crossTrain: function (rootResourceId, resources, intentName) {
        const idToResourceMap = new Map();
        for (const resource of resources) {
            idToResourceMap.set(resource.id, resource);
        }

        // Parse resources
        let rootResource = resources.filter(r => r.id === rootResourceId)[0];
        rootResource.visited = true;
        this.mergeRootInteruptionToLeaves(rootResource, idToResourceMap, intentName);

        return Array.from(idToResourceMap.values());
    },

    mergeRootInteruptionToLeaves: function (rootResource, result, intentName) {
        if (rootResource && rootResource.children && rootResource.children.length > 0) {
            this.mergeBrothersInteruption(rootResource, result, intentName)
            for (const child of rootResource.children) {
                let childResource = result.get(child.target);
                if (childResource.visited === undefined) {
                    const newChildResource = this.mergeFatherInteruptionToChild(rootResource, childResource, intentName);
                    result.set(child.target, newChildResource);
                    newChildResource.visited = true;
                    this.mergeRootInteruptionToLeaves(newChildResource, result, intentName);
                }
            }
        }
    },

    mergeBrothersInteruption: function (resource, result, intentName) {
        let children = resource.children;
        for (const child of children) {
            let triggerIntent = child.intent;
            const brotherSections = resource.content.Sections.filter(s => s.Name !== triggerIntent
                && s.Name !== intentName
                && (s.SectionType === LUSectionTypes.SIMPLEINTENTSECTION || s.SectionType === LUSectionTypes.NESTEDINTENTSECTION));

            let brotherUtterances = [];
            brotherSections.forEach(s => {
                if (s.SectionType === LUSectionTypes.SIMPLEINTENTSECTION) {
                    brotherUtterances = brotherUtterances.concat(s.UtteranceAndEntitiesMap.map(u => u.utterance));
                } else {
                    s.SimpleIntentSections.forEach(section => {
                        brotherUtterances = brotherUtterances.concat(section.UtteranceAndEntitiesMap.map(u => u.utterance));
                    })
                }
            });

            let targetResource = result.get(child.target);

            // Merge direct brother's utterances
            targetResource = this.mergeInteruptionIntent(brotherUtterances, targetResource, intentName);
            result.set(targetResource.id, targetResource);
        }
    },

    mergeFatherInteruptionToChild: function (fatherResource, childResource, intentName) {
        const fatherInteruptions = fatherResource.content.Sections.filter(s => s.Name === intentName);
        if (fatherInteruptions && fatherInteruptions.length > 0) {
            const fatherInteruption = fatherInteruptions[0];
            const fatherUtterances = fatherInteruption.UtteranceAndEntitiesMap.map(u => u.utterance);
            childResource = this.mergeInteruptionIntent(fatherUtterances, childResource, intentName);
        }

        return childResource;
    },

    mergeInteruptionIntent: function (fromUtterances, toResource, intentName) {
        const toInteruptions = toResource.content.Sections.filter(section => section.Name === intentName);
        if (toInteruptions && toInteruptions.length > 0) {
            const toInteruption = toInteruptions[0];
            const existingUtterances = toInteruption.UtteranceAndEntitiesMap.map(u => u.utterance);
            // construct new content here
            let newFileContent = '';
            fromUtterances.forEach(utterance => {
                if (!existingUtterances.includes(utterance)) {
                    newFileContent += '- ' + utterance + '\r\n';
                }
            });

            if (newFileContent !== '') {
                newFileContent = toInteruption.ParseTree.intentDefinition().getText().trim() + '\r\n' + newFileContent;
                let lines = newFileContent.split(/\r?\n/);
                let newLines = [];
                lines.forEach(line => {
                    if (line.trim().startsWith('-')) {
                        newLines.push('- ' + line.trim().slice(1).trim());
                    } else if (line.trim().startsWith('##')) {
                        newLines.push('## ' + line.trim().slice(2).trim());
                    } else if (line.trim().startsWith('#')) {
                        newLines.push('# ' + line.trim().slice(1).trim());
                    }
                })

                newFileContent = newLines.join('\r\n');

                // update section here
                toResource.content = new SectionOperator(toResource.content).updateSection(toInteruption.Id, newFileContent);
            }
        } else {
            // construct new content here
            if (fromUtterances && fromUtterances.length > 0) {
                let newFileContent = `\r\n# ${intentName}\r\n`;
                fromUtterances.forEach(utterance => newFileContent += '- ' + utterance + '\r\n');
             
                // add section here
                toResource.content = new SectionOperator(toResource.content).addSection(newFileContent);
            }
        }

        return toResource;
    }
}
