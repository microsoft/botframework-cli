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
    convertInteruption: async function(luArray, verbose) {
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

            for (const fileId of fileIdToLuResourceMap.keys()) {
                let luResource = fileIdToLuResourceMap.get(fileId);
                let intents = [];
                for(const section of luResource.Sections) {
                    if (section.SectionType === LUSectionTypes.SIMPLEINTENTSECTION) {
                        intents.push(section);
                    }
                }

                for (const intent of intents) {
                    const intentName = intent.Name;
                    const fullPath = path.resolve(path.dirname(fileId) + '/' + intentName + '.lu');
                    if (fileIdToLuResourceMap.has(fullPath)) {
                        let targetLuResouce= fileIdToLuResourceMap.get(fullPath);
                        const brotherIntents = intents.filter(intent => intent.Name !== intentName && intent.Name !== 'interuption');
                        if (brotherIntents && brotherIntents.length > 0) {
                            let utterancesTobeAdded = [];
                            brotherIntents.forEach(x => {
                                utterancesTobeAdded = utterancesTobeAdded.concat(x.UtteranceAndEntitiesMap.map(y => y.context.getText().trim()));
                            });

                            const interuptionIntents = targetLuResouce.Sections.filter(section => section.Name === 'interuption');
                            if (interuptionIntents && interuptionIntents.length > 0) {
                                let interuptionIntent = interuptionIntents[0];
                                let existingUtterances = interuptionIntent.UtteranceAndEntitiesMap.map(y => y.context.getText().trim().slice(1).trim());
                                // construct new content here
                                let newFileContent = '';
                                utterancesTobeAdded.forEach(utterance => {
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
                                    targetLuResouce = new SectionOperator(targetLuResouce).updateSection(interuptionIntent.Id, newFileContent);
                                }
                            } else {
                                // construct new content here
                                let newFileContent = '\r\n# interuption\r\n';
                                utterancesTobeAdded.forEach(utterance => newFileContent += '- ' + utterance.trim().slice(1).trim() + '\r\n');

                                // add section here
                                targetLuResouce = new SectionOperator(targetLuResouce).addSection(newFileContent);
                            }

                            // update fileIdToIntentsMap
                            fileIdToLuResourceMap.set(fullPath, targetLuResouce);
                        }
                    }
                }
            }

            return fileIdToLuResourceMap;
        } catch (err) {
            throw(err)
        }
    }
}
