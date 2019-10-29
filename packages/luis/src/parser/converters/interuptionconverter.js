const path = require('path')
const retCode = require('./../lufile/enums/CLI-errors')
const helpers = require('./../lufile/helpers')
const exception = require('./../lufile/classes/exception')
const luParser = require('./../lufile/luParser');
const LUResource = require('./../lufile/luResource');
const SectionOperator = require('./../lufile/sectionOperator');
const LUSectionTypes = require('./../lufile/enums/lusectiontypes');

module.exports = {
    /**
     * Parses a list of luObject to a LUIS JSON
     * @param {luObject []} luArray luObject list to be parsed
     * @param {boolean} verbose verbose logging
     * @returns {Map<string, LUResource>} Collated LUIS json contents
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    convertInteruption: async function(luArray, intentName, verbose) {
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
                        const intentPath = path.resolve(path.dirname(fileId) + '/' + name + '.lu');
                        if (fileIdToLuResourceMap.has(intentPath)) {
                            resource.children.push({
                                intent: name,
                                target: intentPath
                            })
                        }
                    }
                }

                resources.push(resource);
            }

            const result = this.crossTrain(resources, intentName)

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
    }
    */
    crossTrain: function(resources, intentName = 'interuption') {
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
                    let brotherUtterances = [];
                    if (brothers && brothers.length > 0) {
                        brothers.forEach(x => {
                            let intents = [];
                            if (idToResourceMap.has(x.target)) {
                                let brotherSections = idToResourceMap.get(x.target).content.Sections;
                                for(const section of brotherSections) {
                                    if (section.SectionType === LUSectionTypes.SIMPLEINTENTSECTION) {
                                        intents.push(section);
                                    }
                                }
                            }

                            let utterancesTobeAdded = [];
                            intents.forEach(intent => {
                                if (intent.Name !== intentName) {
                                    utterancesTobeAdded = utterancesTobeAdded.concat(intent.UtteranceAndEntitiesMap.map(y => y.context.getText().trim()));
                                }
                            })

                            brotherUtterances = brotherUtterances.concat(utterancesTobeAdded);
                        });
                    }

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

                            // update section here
                            targetResource.content = new SectionOperator(targetResource.content).updateSection(interuptionIntent.Id, newFileContent);
                        }
                    } else {
                        // construct new content here
                        let newFileContent = `\r\n# ${intentName}\r\n`;
                        brotherUtterances.forEach(utterance => newFileContent += '- ' + utterance.trim().slice(1).trim() + '\r\n');

                        // add section here
                        targetResource.content = new SectionOperator(targetResource.content).addSection(newFileContent);
                    }

                    idToResourceMap.set(targetResource.id, targetResource);
                }
            }
        }

        return Array.from(idToResourceMap.values());
    }
}
