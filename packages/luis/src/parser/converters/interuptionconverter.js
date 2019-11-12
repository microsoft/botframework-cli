const retCode = require('./../lufile/enums/CLI-errors')
const helpers = require('./../lufile/helpers')
const exception = require('./../lufile/classes/exception')
const luParser = require('./../lufile/luParser');
const SectionOperator = require('./../lufile/sectionOperator');
const LUSectionTypes = require('./../lufile/enums/lusectiontypes');

module.exports = {
    /**
     * Parses a list of luObject to a LUIS JSON
     * @param {luObject []} luArray luObject list to be parsed
     * @param {Map<string, Map<string, string>>} luConfig cross train files config 
     * @returns {string} intentName interuption intent name
     * @param {boolean} verbose verbose logging
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    convertInteruption: async function(luArray, luConfig, intentName, verbose) {
        try {
            let fileIdToLuResourceMap = new Map();
            for(const luFile of luArray) {
                let luContent = luFile.content;
                luContent = helpers.sanitizeNewLines(luContent);
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
                            const intentPaths = fileToLuResourcekeys.filter(x => x.endsWith(referenceLuFilePath.slice(2)));
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

            const result = this.crossTrain(resources, intentName);
            for(const res of result) {
                fileIdToLuResourceMap.set(res.id, res.content);
            }

            return fileIdToLuResourceMap;
        } catch (err) {
            throw(err)
        }
    },

    /*
    resources is array of below object
    {
        id: a.lu
        content: LuResource
        children: [ { intent: "b", target: "b.lu"} , {intent:  "c", target: "c.lu"}]
    };
    rootResource is the root resource of the tree structure of resources
    */
    crossTrain: function(rootResource, resources, intentName = 'interuption') {
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
                    let brothers = children.filter(child => child.intent !== intent && child.intent !== intentName);
                    let brotherSections = [];
                    const contentList = resource.content.Content.split(/\r?\n/);
                    if (brothers && brothers.length > 0) {
                        brothers.forEach(x => {
                            const brotherSection = resource.content.Sections.filter(s => s.Name === x.intent)[0];
                            brotherSections.push(brotherSection);
                        });
                    }

                    let entities = [];
                    let brotherUtterances = [];
                    brotherSections.forEach(bs => {
                        brotherUtterances = brotherUtterances.concat(s.UtteranceAndEntitiesMap.map(y => y.context.getText().trim()));
                        let entityContents = [];
                        bs.Entities.forEach(x => {
                            const startLine = x.ParseTree.start.line - 1;
                            const endLine = x.ParseTree.stop.line - 1;
                            entityContents.push(contentList.slice(startLine, endLine + 1).join('\n'));
                        })
                        entities = entities.concat(entityContents);
                    });

                    const interuptionIntents = targetResource.content.Sections.filter(section => section.Name === intentName);
                    if (interuptionIntents && interuptionIntents.length > 0) {
                        let interuptionIntent = interuptionIntents[0];
                        let existingUtterances = interuptionIntent.UtteranceAndEntitiesMap.map(y => y.context.getText().trim().slice(1).trim());
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
                        let newFileContent = `\r\n# ${intentName}\r\n`;
                        brotherUtterances.forEach(utterance => newFileContent += '- ' + utterance.trim().slice(1).trim() + '\r\n');

                        if (entities && entities.length > 0) {
                            newFileContent += '\r\n' + entities.join('\r\n\r\n') + '\r\n';
                        }

                        // add section here
                        targetResource.content = new SectionOperator(targetResource.content).addSection(newFileContent);
                    }

                    idToResourceMap.set(targetResource.id, targetResource);
                }
            }
        }

        // Parse resources
        rootResource.visited = true;
        mergeChildrenInteruptions(rootResource, idToResourceMap)

        return Array.from(idToResourceMap.values());
    },

    mergeChildrenInteruptions: function (rootResource, result, intentName) {
        if (rootResource && rootResource.children && rootResource.children.length > 0) {
            for (const child of rootResource.children) {
                let childResource = result.get(child.target);
                if (childResource.visited !== undefined && childResource.visited === true) {
                    throw (new exception(retCode.errorCode.INVALID_INPUT, `Loop detected for lu file ${childResource.id} when doing cross training.`));
                }

                const newChildResource = mergeInteruption(rootResource, childResource, intentName);
                result.set(child.target, newChildResource);
                newChildResource.visited = true;
                this.mergeChildrenInteruptions(newChildResource, result, intentName);
            }
        }
    },

    mergeInteruption: function (fatherResource, childResource, intentName) {
        const fatherInteruptions = rootResource.content.Sections.filter(x => x.Name = intentName);
        if (fatherInteruptions && fatherInteruptions.length > 0) {
            const fatherInteruption = fatherInteruptions[0];
            const fatherUtterances = fatherInteruption.UtteranceAndEntitiesMap.map(y => y.context.getText());
            const fatherContentList = fatherResource.content.Content.split(/\r?\n/);
            let fatherEntityDict = new Map();
            fatherInteruption.Entities.forEach(x => {
                const startLine = x.ParseTree.start.line - 1;
                const endLine = x.ParseTree.stop.line - 1;
                fatherEntityDict.set(x.Name, fatherContentList.slice(startLine, endLine + 1).join('\n'));
            });

            const childInteruptions = childResource.content.Sections.filter(section => section.Name === intentName);
            if (childInteruptions && childInteruptions.length > 0) {
                const childInteruption = childInteruptions[0];
                const existingUtterances = childInteruption.UtteranceAndEntitiesMap.map(y => y.context.getText().trim().slice(1).trim());
                // construct new content here
                let newFileContent = '';
                fatherUtterances.forEach(utterance => {
                    if (!existingUtterances.includes(utterance.trim().slice(1).trim())) {
                        newFileContent += '- ' + utterance.trim().slice(1).trim() + '\r\n';
                    }
                });

                let fatherEntities = [];
                const existingEntityNames = childInteruption.Entities.map(y => y.Name);
                fatherEntityDict.forEach(nameContentPair => {
                    if (!existingEntityNames.includes(nameContentPair[0])) {
                        fatherEntities.push(nameContentPair[1]);
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
    
                    if (fatherEntities && fatherEntities.length > 0) {
                        newFileContent += '\r\n' + fatherEntities.join('\r\n\r\n') + '\r\n';
                    }
                    // update section here
                    childResource.content = new SectionOperator(childResource.content).updateSection(childInteruption.Id, newFileContent);
                }
            } else {
                // construct new content here
                let newFileContent = `\r\n# ${intentName}\r\n`;
                fatherUtterances.forEach(utterance => newFileContent += '- ' + utterance.trim().slice(1).trim() + '\r\n');
    
                const fatherEntities = Array.from(fatherEntityDict.values());
                if (fatherEntities && fatherEntities.length > 0) {
                    newFileContent += '\r\n' + fatherEntities.join('\r\n\r\n') + '\r\n';
                }
    
                // add section here
                childResource.content = new SectionOperator(childResource.content).addSection(newFileContent);
            }
        }

        return childResource;
    }
}
