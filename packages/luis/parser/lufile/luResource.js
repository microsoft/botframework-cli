const LUResource = require('./luResource');
const LUSection = require('./luSection');
const LUIntent = require('./luIntent');
const LUEntity = require('./luEntity');
const LUImport = require('./luImport');
const LUQna = require('./luQna');
const LUModelInfo = require('./luModelInfo');
const DiagnosticSeverity = require('./diagnostic').DiagnosticSeverity;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const LUParser = require('./luParser');

class LUResource {
  /**
   * 
   * @param {LUSection[]} sections
   * @param {LUIntent[]} intents 
   * @param {LUEntity[]} entities 
   * @param {LUImport[]} imports
   * @param {LUQna[]} qnas
   * @param {LUModelInfo[]} modelInfos
   * @param {string} content
   * @param {any[]} errors
   */
  constructor(sections, intents, entities, imports, qnas, modelInfos, content, errors) {
    this.Sections = sections;
    this.Intents = intents;
    this.Entities = entities;
    this.Imports = imports;
    this.Qnas = qnas;
    this.ModelInfos = modelInfos;
    this.Content = content;
    this.Errors = errors;
  }

  AddSection(sectionName, sectionBody) {
    let sectionsFound = this.Sections.filter(s => s.Name === sectionName);
    if (sectionsFound && sectionsFound.length > 0) {
      let errorMsg = `section ${sectionName} already exists.`
      let error = BuildDiagnostic({
        message: errorMsg,
        context: sectionsFound[0].ParseTree,
        severity: DiagnosticSeverity.ERROR
      });

      this.Errors.push(error);
    }

    let newSectionBody = this.ConvertBody(sectionBody);
    let newContent = `${this.Content}\r\n\r\n# ${sectionName}\r\n${newSectionBody}`;

    return LUParser.parse(newContent);
  }

  UpdateSection(sectionName, sectionBody) {
    let sectionsFound = this.Sections.filter(s => s.Name === sectionName);
    if (sectionsFound && sectionsFound.length > 0) {
      let section = sectionsFound[0];
      let newSectionBody = ConvertBody(sectionBody);
      let content = `# ${sectionName}\r\n${newSectionBody}`;
      let startLine = section.ParseTree.start.line - 1;
      let stopLine = section.ParseTree.stop.line - 1;

      let newContent = this.ReplaceRangeContent(this.Content, startLine, stopLine, content);

      return LUParser.parse(newContent);
    } else {
      return this;
    }
  }

  DeleteSection(sectionName) {
    let sectionsFound = this.Sections.filter(s => s.Name === sectionName);
    if (sectionsFound && sectionsFound.length > 0) {
      let section = sectionsFound[0];
      let startLine = section.ParseTree.start.line - 1;
      let stopLine = section.ParseTree.stop.line - 1;
      let newContent = this.ReplaceRangeContent(this.Content, startLine, stopLine, undefined);

      return LGParser.Parse(newContent);
    } else {
      return this;
    }
  }

  GetIntent(intentName, sectionName) {
    if (sectionName) {
      let sectionsFound = this.Sections.filter(s => s.Name === sectionName);
      if (sectionsFound && sectionsFound.length > 0) {
        let section = sectionsFound[0];
        let intentsFound = section.SubSections.filter(s => s.Intent.Name === intentName);
        if (intentsFound && intentsFound.length > 0) {
          return intentsFound[0];
        }
      }
    } else {
      let intentsFound = this.Intents.filter(s => s.Name === intentName);
      if (intentsFound && intentsFound.length > 0) {
        return intentsFound[0];
      }
    }
  }

  AddIntent(intentName, intentBody, sectionName) {
    if (sectionName) {
      let sectionsFound = this.Sections.filter(s => s.Name === sectionName);
      if (sectionsFound && sectionsFound.length > 0) {
        let section = sectionsFound[0];
        let newIntentBody = this.ConvertBody(intentBody);
        let newSectionBody = `${section.Body}\r\n\r\n${intentName}\r\n${newIntentBody}`;

        return this.UpdateSection(sectionName, newSectionBody);
      } else {
        let newIntentBody = this.ConvertBody(intentBody);
        let newSectionBody = `## ${intentName}\r\n${newIntentBody}`;

        return this.AddSection(sectionName, newSectionBody);
      }
    } else {
      let intentsFound = this.Intents.filter(s => s.Name === intentName);
      if (intentsFound && intentsFound.length > 0) {
        let errorMsg = `section ${intentName} already exists.`
        let error = BuildDiagnostic({
          message: errorMsg,
          context: intentsFound[0].ParseTree,
          severity: DiagnosticSeverity.ERROR
        });

        this.Errors.push(error);
      }

      let newIntentBody = this.ConvertBody(intentBody);
      let newContent = `${this.Content}\r\n\r\n# ${intentName}\r\n${newIntentBody}`;

      return LUParser.parse(newContent);
    }
  }

  UpdateIntent(intentName, intentBody, sectionName) {
    if (sectionName) {
      let sectionsFound = this.Sections.filter(s => s.Name === sectionName);
      if (sectionsFound && sectionsFound.length > 0) {
        let section = sectionsFound[0];
        let intentsFound = section.SubSections.filter(s => s.Intent.Name = intentName);
        if (intentsFound && intentsFound.length > 0) {
          let intent = intentsFound[0];
          let newIntentBody = ConvertBody(intentBody);
          let content = `## ${intentName}\r\n${newIntentBody}`;
          let startLine = intent.ParseTree.start.line - 1;
          let stopLine = intent.ParseTree.stop.line - 1;
          let newContent = this.ReplaceRangeContent(this.Content, startLine, stopLine, content);

          return LUParser.parse(newContent);
        } else {
          return this;
        }
      } else {
        return this;
      }
    } else {
      let intentsFound = this.Intents.filter(s => s.Name === intentName);
      if (intentsFound && intentsFound.length > 0) {
        let intent = intentsFound[0];
        let newIntentBody = ConvertBody(intentBody);
        let content = `# ${intentName}\r\n${newIntentBody}`;
        let startLine = intent.ParseTree.start.line - 1;
        let stopLine = intent.ParseTree.stop.line - 1;

        let newContent = this.ReplaceRangeContent(this.Content, startLine, stopLine, content);

        return LUParser.parse(newContent);
      } else {
        return this;
      }
    }
  }

  DeleteIntent(intentName, sectionName) {
    if (sectionName) {
      let sectionsFound = this.Sections.filter(s => s.Name === sectionName);
      if (sectionsFound && sectionsFound.length > 0) {
        let section = sectionsFound[0];
        let intentsFound = section.SubSections.filter(s => s.Intent.Name = intentName);
        if (intentsFound && intentsFound.length > 0) {
          let intent = intentsFound[0];
          let startLine = intent.ParseTree.start.line - 1;
          let stopLine = intent.ParseTree.stop.line - 1;
          let newContent = this.ReplaceRangeContent(this.Content, startLine, stopLine, undefined);

          return LUParser.parse(newContent);
        } else {
          return this;
        }
      }
    } else {
      let intentsFound = this.Intents.filter(s => s.Name === intentName);
      if (intentsFound && intentsFound.length > 0) {
        let intent = intentsFound[0];
        let startLine = intent.ParseTree.start.line - 1;
        let stopLine = intent.ParseTree.stop.line - 1;
        let newContent = this.ReplaceRangeContent(this.Content, startLine, stopLine, undefined);

        return LGParser.Parse(newContent);
      } else {
        return this;
      }
    }
  }

  ConvertBody(body) {
    if (body) {
      let bodyList = body.split('\n');

      return bodyList.join('\n');
    } else {
      return '';
    }
  }

  ReplaceRangeContent(originStr, startLine, stopLine, replaceStr) {
    let originList = originStr.split('\n');
    let destList = [];

    destList = destList.concat(originList.slice(0, startLine));
    if (replaceStr) {
      destList.push(replaceStr);
    }

    destList = destList.concat(originList.slice(stopLine + 1));

    return destList.join('\n');
  }
}

module.exports = LUResource;