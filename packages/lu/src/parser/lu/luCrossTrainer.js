const retCode = require('./../utils/enums/CLI-errors')
const helpers = require('./../utils/helpers')
const exception = require('./../utils/exception')
const luParser = require('./../lufile/luParser')
const SectionOperator = require('./../lufile/sectionOperator')
const LUSectionTypes = require('./../utils/enums/lusectiontypes')
const LUResource = require('./../lufile/luResource')
const DiagnosticSeverity = require('./../lufile/diagnostic').DiagnosticSeverity
const fileHelper = require('./../../utils/filehelper')
const NEWLINE = require('os').EOL
const path = require('path')

module.exports = {
  /**
   * Do cross training among lu files
   * @param {luObject[]} luObjectArray the luObject list to be parsed
   * @param {any} crossTrainConfig cross train json config
   * @returns {Map<string, LUResource>} Map of file id and luResource
   * @throws {exception} Throws on errors. exception object includes errCode and text
   */
  luCrossTrain: function (luObjectArray, crossTrainConfig) {
    try {
      const crossTrainConfigObj = JSON.parse(crossTrainConfig)
      const rootObjectIds = crossTrainConfigObj.rootIds
      const triggerRules = crossTrainConfigObj.triggerRules
      const intentName = crossTrainConfigObj.intentName
      const verbose = crossTrainConfigObj.verbose

      // parse lu content to LUResource object
      let fileIdToLuResourceMap = this.parseAndValidateLuContent(luObjectArray, verbose)

      // construct resource tree to build the father-children relationship among lu files
      let resources = this.constructResoureTree(fileIdToLuResourceMap, triggerRules)

      // do cross training from roots. One root one core training
      for (const rootObjectId of rootObjectIds) {
        if (resources.some(r => r.id === rootObjectId)) {
          // do cross training for each root at top level
          const result = this.crossTrain(rootObjectId, resources, intentName)
          for (const res of result) {
            fileIdToLuResourceMap.set(res.id, res.content);
          }
        } else {
          throw (new exception(retCode.errorCode.INVALID_INPUT, `Sorry, root lu file '${rootObjectId}' does not exist`))
        }
      }

      return fileIdToLuResourceMap;
    } catch (err) {
      throw (err)
    }
  },

  qnaCrossTrain: function (qnaObjectArray, luFileIdToLuResourceMap, verbose) {
    try {
      let qnaFileIdToLuResourceMap = this.parseAndValidateLuContent(qnaObjectArray, verbose)
      for (const luObjectId of Array.from(luFileIdToLuResourceMap.keys())) {
        const qnaObjectId = path.join(path.dirname(luObjectId), path.basename(luObjectId, helpers.FileExtTypeEnum.LUFile).concat(helpers.FileExtTypeEnum.QnAFile))
        let fileName = path.basename(luObjectId, path.extname(luObjectId))
        const culture = fileHelper.getCultureFromPath(luObjectId)
        fileName = culture ? fileName.substring(0, fileName.length - culture.length - 1) : fileName

        if (Array.from(qnaFileIdToLuResourceMap.keys()).some(q => q === qnaObjectId)) {
          const { luResource, qnaResource } = this.qnaCrossTrainCore(luFileIdToLuResourceMap.get(luObjectId), qnaFileIdToLuResourceMap.get(qnaObjectId), fileName)
          luFileIdToLuResourceMap.set(luObjectId, luResource)
          qnaFileIdToLuResourceMap.set(qnaObjectId, qnaResource)
        }
      }

      return qnaFileIdToLuResourceMap
    } catch (err) {
      throw (err)
    }
  },

  qnaCrossTrainCore: function (luResource, qnaResource, name) {
    // extract questions
    const qnaSections = qnaResource.Sections.filter(s => s.SectionType === LUSectionTypes.QNASECTION);
    let questions = []
    qnaSections.forEach(q => questions = questions.concat(q.Questions))
    questions = questions.map(q => '- '.concat(q))
    let questionsContent = questions.join(NEWLINE)
    const questionsToUtterances = `# DeferToRecognizer_QnA_${name}${NEWLINE}${questionsContent}`

    // extract utterances
    const intentSections = luResource.Sections.filter(s => s.SectionType === LUSectionTypes.SIMPLEINTENTSECTION)
    let utterances = []
    intentSections.forEach(i => utterances = utterances.concat(i.UtteranceAndEntitiesMap.map(u => u.utterance)))
    let utterancesContent = utterances.join(NEWLINE + '- ')
    const utterancesToQuestion = `> Source:cross training. Please do not edit these directly!${NEWLINE}# ?${utterancesContent}${NEWLINE}${NEWLINE}**Filters:**${NEWLINE}- dialogname=${name}${NEWLINE}${NEWLINE}\`\`\`markdown${NEWLINE}intent=DeferToRecognizer_LUIS_${name}${NEWLINE}\`\`\``

    // add questions from qna file to corresponding lu file with intent named DeferToRecognizer_QnA_${name}
    luResource = new SectionOperator(luResource).addSection(questionsToUtterances)

    // update qna filters
    let qnaSectionContents = []
    for (const qnaSection of qnaSections) {
      qnaSection.FilterPairs.push({key: 'dialogname', value: name})
      const qnaSectionContent = `# ?${qnaSection.Questions.join(NEWLINE + '- ')}${NEWLINE}${NEWLINE}**Filters:**${NEWLINE}- ${qnaSection.FilterPairs.map(f => f.key + '=' + f.value).join(NEWLINE + '- ')}${NEWLINE}${NEWLINE}\`\`\`markdown${qnaSection.Answer}\`\`\``
      qnaSectionContents.push(qnaSectionContent)
    }

    const qnaContents = qnaSectionContents.join(NEWLINE + NEWLINE)
    qnaResource = new SectionOperator(new LUResource([], '', [])).addSection(qnaContents)

    // add utterances from lu file to corresponding qna file with question set to all utterances
    qnaResource = new SectionOperator(qnaResource).addSection(utterancesToQuestion)

    return {luResource, qnaResource}
  },

  /**
   * Parse and validate luObject array to convert to LUResource object dict
   * @param {luObject[]} luObjectArray the luObject list to be parsed
   * @param {boolean} verbose indicate to enable log messages or not
   * @returns {Map<string, LUResource>} Map of file id and luResource
   * @throws {exception} Throws on errors. exception object includes errCode and text
   */
  parseAndValidateLuContent: function (luObjectArray, verbose) {
    let fileIdToLuResourceMap = new Map();
    for (const luObject of luObjectArray) {
      let luContent = luObject.content;
      luContent = helpers.sanitizeNewLines(luContent);
      if (luContent === undefined || luContent === '') continue;

      let luResource = luParser.parse(luContent);
      if (luResource.Errors && luResource.Errors.length > 0) {
        if (verbose) {
          var warns = luResource.Errors.filter(error => (error && error.Severity && error.Severity === DiagnosticSeverity.WARN));
          if (warns.length > 0) {
            process.stdout.write(warns.map(warn => warn.toString()).join(NEWLINE).concat(NEWLINE));
          }
        }

        var errors = luResource.Errors.filter(error => (error && error.Severity && error.Severity === DiagnosticSeverity.ERROR));
        if (errors.length > 0) {
          throw (new exception(retCode.errorCode.INVALID_LINE, errors.map(error => error.toString()).join(NEWLINE)));
        }
      }

      fileIdToLuResourceMap.set(luObject.id, luResource);
    }

    return fileIdToLuResourceMap;
  },

  /**
   * Contruct resource tree to build the father-children relationship among lu files
   * @param {Map<string, LUResource>} fileIdToLuResourceMap Map of file id and luResource
   * @param {any} triggerRules trigger rules object that indicate the triggering rules from root to dest lu files
   * @returns {any[]} Object array of LUResource with id and children properties 
   * @throws {exception} Throws on errors. exception object includes errCode and text
   */
  constructResoureTree: function (fileIdToLuResourceMap, triggerRules) {
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

      if (!(fileId in triggerRules)) {
        resources.push(resource);
        continue;
      }

      let intents = [];
      for (const section of luResource.Sections) {
        if (section.SectionType === LUSectionTypes.SIMPLEINTENTSECTION
          || section.SectionType === LUSectionTypes.NESTEDINTENTSECTION) {
          intents.push(section);
        }
      }

      const destLuFileToIntent = triggerRules[fileId];
      for (const destLuFile of Object.keys(destLuFileToIntent)) {
        if (!fileIdsFromInput.includes(destLuFile)) continue;

        if (visitedChildren.has(destLuFile)) {
          // validate loop in a tree or forest
          throw (new exception(retCode.errorCode.INVALID_INPUT, `Sorry, dialog call loop detected for lu file ${destLuFile} when doing cross training`));
        }

        const triggerIntentName = destLuFileToIntent[destLuFile];
        if (!intents.some(i => i.Name === triggerIntentName)) {
          throw (new exception(retCode.errorCode.INVALID_INPUT, `Sorry, trigger intent '${triggerIntentName}' is not found in lu file: ${fileId}`));
        }

        resource.children.push({
          target: destLuFile,
          intent: triggerIntentName
        });

        visitedChildren.add(destLuFile);
      }

      resources.push(resource);
    }

    return resources;
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
    if (rootResource.children === undefined || rootResource.length <= 0) return;

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
          newFileContent += '- ' + utterance + NEWLINE;
        }
      });

      if (newFileContent === '') return toResource;
      let existingContent = toInteruption.ParseTree.intentDefinition().getText().trim()
      if (existingContent.endsWith('<EOF>')) {
        existingContent = existingContent.slice(0, existingContent.length - 5)
      }
      
      newFileContent = existingContent + NEWLINE + newFileContent
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

      newFileContent = newLines.join(NEWLINE);

      // update section here
      toResource.content = new SectionOperator(toResource.content).updateSection(toInteruption.Id, newFileContent);
    } else {
      // construct new content here
      if (fromUtterances && fromUtterances.length > 0) {
        let newFileContent = `# ${intentName}${NEWLINE}- `
        newFileContent += fromUtterances.join(`${NEWLINE}- `)

        // add section here
        toResource.content = new SectionOperator(toResource.content).addSection(newFileContent);
      }
    }

    return toResource;
  }
}
