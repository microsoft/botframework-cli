const retCode = require('./../utils/enums/CLI-errors')
const helpers = require('./../utils/helpers')
const exception = require('./../utils/exception')
const luParser = require('./../lufile/luParser');
const SectionOperator = require('./../lufile/sectionOperator');
const LUSectionTypes = require('./../utils/enums/lusectiontypes');

module.exports = {
    /**
     * Do cross training among lu files
     * @param {luObject[]} luArray the luObject list to be parsed
     * @param {luObject[]} rootArray root luObject list
     * @param {Map<string, Map<string, string>>} luConfig cross train config 
     * @param {string} intentName interuption intent name
     * @param {boolean} verbose verbose logging
     * @returns {Map<string, LUResource>} Map of file id and luResource
     * @throws {exception} Throws on errors. exception object includes errCode and text
     */
    luCrossTrain: async function(luArray, rootArray, luConfig, intentName, verbose) {
        try {
            let fileIdToLuResourceMap = new Map();
            for(const luFile of luArray) {
                let luContent = luFile.content;
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

                fileIdToLuResourceMap.set(luFile.id, luResource);
            }

            /*
            resources is array of below object
            {
                id: a.lu
                content: LUResource
                children: [ { intent: "b", target: "b.lu"} , {intent:  "c", target: "c.lu"}]
            }
            */
            let resources = [];
            let fileToLuResourcekeys = Array.from(fileIdToLuResourceMap.keys());
            let luFileToIntentKeys = Array.from(luConfig.keys());
            for (const fileId of fileIdToLuResourceMap.keys()) {
                let luResource = fileIdToLuResourceMap.get(fileId);
                let resource = {
                    id: fileId,
                    content: luResource,
                    children: []
                };

                let intents = [];
                for(const section of luResource.Sections) {
                    if (section.SectionType === LUSectionTypes.SIMPLEINTENTSECTION) {
                        intents.push(section);
                    }
                }

                for (const intent of intents) {
                    const name = intent.Name;
                    if (name !== intentName) {
                        let luFilePaths = luFileToIntentKeys.filter(x => fileId.endsWith(x.slice(2)));
                        if (luFilePaths && luFilePaths.length == 1) {
                            let luFilePath = luFilePaths[0];
                            let referenceLuFilePath = luConfig.get(luFilePath).get(name);
                            const intentPaths = fileToLuResourcekeys.filter(x => referenceLuFilePath && x.endsWith(referenceLuFilePath.slice(2)));
                            if (intentPaths && intentPaths.length === 1) {
                                resource.children.push({
                                    intent: name,
                                    target: intentPaths[0]
                                })
                            } else if (intentPaths && intentPaths.length > 1) {
                                throw (new exception(retCode.errorCode.INVALID_INPUT, `Multiple files found for ${referenceLuFilePath}`));
                            }
                        } else if (luFilePaths && luFilePaths.length > 1) {
                            // TODO: throw exception
                        }
                    }
                }

                resources.push(resource);
            }

            const rootResources = resources.filter(r => rootArray.some(root => root.id === r.id))
            const result = this.crossTrain(rootResources, resources, intentName);
            for(const res of result) {
                fileIdToLuResourceMap.set(res.id, res.content);
            }

            return fileIdToLuResourceMap;
        } catch (err) {
            throw(err)
        }
    },

    /**
     * Cross training core function
     * @param {any[]} rootResources the root resource object list
     * @param {any[]} resources all resource object list
     * @param {string} intentName interuption intent name
     * @returns {any[]} updated resource objects
     * @throws {exception} Throws on errors. exception object includes errCode and text
     */
    crossTrain: function(rootResources, resources, intentName) {
        const idToResourceMap = new Map();
        for (const resource of resources) {
            idToResourceMap.set(resource.id, resource);
        }

        for (const id of idToResourceMap.keys()) {
            let resource = idToResourceMap.get(id);
            let children = resource.children;
            for (const child of children) {
                let intent = child.intent;
                if (idToResourceMap.has(child.target)) {
                    let targetResource = idToResourceMap.get(child.target);
                    const contentList = resource.content.Content.split(/\r?\n/);
                    const brotherSections = resource.content.Sections.filter(s => s.Name !== intent && s.Name !== intentName && s.SectionType === LUSectionTypes.SIMPLEINTENTSECTION);
                    let entities = [];
                    let brotherUtterances = [];
                    brotherSections.forEach(s => {
                        brotherUtterances = brotherUtterances.concat(s.UtteranceAndEntitiesMap.map(u => u.context.getText().trim()));
                        let entityContents = [];
                        s.Entities.forEach(e => {
                            const startLine = e.ParseTree.start.line - 1;
                            const endLine = e.ParseTree.stop.line - 1;
                            entityContents.push(contentList.slice(startLine, endLine + 1).join('\n'));
                        })
                        entities = entities.concat(entityContents);
                    });

                    const interuptionIntents = targetResource.content.Sections.filter(section => section.Name === intentName);
                    if (interuptionIntents && interuptionIntents.length > 0) {
                        let interuptionIntent = interuptionIntents[0];
                        let existingUtterances = interuptionIntent.UtteranceAndEntitiesMap.map(u => u.context.getText().trim().slice(1).trim());
                        // construct new content here
                        let newFileContent = '';
                        brotherUtterances.forEach(utterance => {
                            if (!existingUtterances.includes(utterance.trim().slice(1).trim())) {
                                newFileContent += '- ' + utterance.trim().slice(1).trim() + '\r\n';
                            }
                        });

                        if (newFileContent !== '') {
                            newFileContent = interuptionIntent.ParseTree.intentDefinition().getText().trim() + '\r\n' + newFileContent;
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

                            if (entities && entities.length > 0) {
                                newFileContent += '\r\n' + entities.join('\r\n\r\n') + '\r\n';
                            }
                            // update section here
                            targetResource.content = new SectionOperator(targetResource.content).updateSection(interuptionIntent.Id, newFileContent);
                        }
                    } else {
                        // construct new content here
                        if (brotherUtterances && brotherUtterances.length > 0) {
                            let newFileContent = `\r\n# ${intentName}\r\n`;
                            brotherUtterances.forEach(utterance => newFileContent += '- ' + utterance.trim().slice(1).trim() + '\r\n');

                            if (entities && entities.length > 0) {
                                newFileContent += '\r\n' + entities.join('\r\n\r\n') + '\r\n';
                            }

                            // add section here
                            targetResource.content = new SectionOperator(targetResource.content).addSection(newFileContent);
                        }
                    }

                    idToResourceMap.set(targetResource.id, targetResource);
                }
            }
        }

        // Parse resources
        for (const rootResource of rootResources) {
            rootResource.visited = true;
            this.mergeChildrenInteruptions(rootResource, idToResourceMap, intentName)
        }
        
        return Array.from(idToResourceMap.values());
    },

    mergeChildrenInteruptions: function (rootResource, result, intentName) {
        if (rootResource && rootResource.children && rootResource.children.length > 0) {
            for (const child of rootResource.children) {
                let childResource = result.get(child.target);
                if (childResource.visited !== undefined && childResource.visited === true) {
                    throw (new exception(retCode.errorCode.INVALID_INPUT, `Loop detected for lu file ${childResource.id} when doing cross training.`));
                }

                const newChildResource = this.mergeInteruption(rootResource, childResource, intentName);
                result.set(child.target, newChildResource);
                newChildResource.visited = true;
                this.mergeChildrenInteruptions(newChildResource, result, intentName);
            }
        }
    },

    mergeInteruption: function (fatherResource, childResource, intentName) {
        const fatherInteruptions = fatherResource.content.Sections.filter(s => s.Name === intentName);
        if (fatherInteruptions && fatherInteruptions.length > 0) {
            const fatherInteruption = fatherInteruptions[0];
            const fatherUtterances = fatherInteruption.UtteranceAndEntitiesMap.map(u => u.context.getText());
            const fatherContentList = fatherResource.content.Content.split(/\r?\n/);
            let fatherEntityDict = new Map();
            fatherInteruption.Entities.forEach(x => {
                const startLine = x.ParseTree.start.line - 1;
                const endLine = x.ParseTree.stop.line - 1;
                fatherEntityDict.set(x.Name, fatherContentList.slice(startLine, endLine + 1).join('\n'));
            });

            const childInteruptions = childResource.content.Sections.filter(section => section.Name === intentName);
            const childContentList = childResource.content.Content.split(/\r?\n/);
            let interuptionEntities = [];
            if (childInteruptions && childInteruptions.length > 0) {
                const childInteruption = childInteruptions[0];
                const existingUtterances = childInteruption.UtteranceAndEntitiesMap.map(u => u.context.getText().trim().slice(1).trim());
                // construct new content here
                let newFileContent = '';
                fatherUtterances.forEach(utterance => {
                    if (!existingUtterances.includes(utterance.trim().slice(1).trim())) {
                        newFileContent += '- ' + utterance.trim().slice(1).trim() + '\r\n';
                    }
                });

                childInteruption.Entities.forEach(e => {
                    const startLine = e.ParseTree.start.line - 1;
                    const endLine = e.ParseTree.stop.line - 1;
                    interuptionEntities.push(childContentList.slice(startLine, endLine + 1).join('\n'));
                });

                const existingEntityNames = childInteruption.Entities.map(e => e.Name);
                fatherEntityDict.forEach(nameContentPair => {
                    if (!existingEntityNames.includes(nameContentPair[0])) {
                        interuptionEntities.push(nameContentPair[1]);
                    }
                })
    
                if (newFileContent !== '') {
                    newFileContent = childInteruption.ParseTree.intentDefinition().getText().trim() + '\r\n' + newFileContent;
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
    
                    if (interuptionEntities && interuptionEntities.length > 0) {
                        newFileContent += '\r\n\r\n' + interuptionEntities.join('\r\n\r\n');
                    }

                    // update section here
                    childResource.content = new SectionOperator(childResource.content).updateSection(childInteruption.Id, newFileContent);
                }
            } else {
                // construct new content here
                if (fatherUtterances && fatherUtterances.length > 0) {
                    let newFileContent = `\r\n# ${intentName}\r\n`;
                    fatherUtterances.forEach(utterance => newFileContent += '- ' + utterance.trim().slice(1).trim() + '\r\n');
                    interuptionEntities = Array.from(fatherEntityDict.values());
                    if (interuptionEntities && interuptionEntities.length > 0) {
                        newFileContent += '\r\n' + interuptionEntities.join('\r\n\r\n');
                    }

                    // add section here
                    childResource.content = new SectionOperator(childResource.content).addSection(newFileContent);
                }
            }
        }

        return childResource;
    }
}
