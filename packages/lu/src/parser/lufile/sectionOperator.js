const luParser = require('./luParser');
const helpers = require('./../utils/helpers');
const NEWLINE = require('os').EOL;
  
class SectionOperator {
  
  /**
   * @param {LUResource} luresource 
   */
  constructor(luresource) {
    this.Luresource = luresource;
  }

  // After CRUD, section Ids will keep same unless you change section name.
  addSection(sectionContent) {
    sectionContent = helpers.sanitizeNewLines(sectionContent);
    const newContent = this.Luresource.Content !== '' ? `${this.Luresource.Content}${NEWLINE}${NEWLINE}${sectionContent}` : sectionContent;

    const result = luParser.parse(newContent);
    return result;
  }

  updateSection(id, sectionContent) {
    sectionContent = helpers.sanitizeNewLines(sectionContent);
    const section = this.Luresource.Sections.find(u => u.Id === id);
    if (!section) {
      return this.Luresource;
    }

    var startLine = section.ParseTree.start.line - 1;
    var stopLine = section.ParseTree.stop.line - 1;

    var newContent = this.replaceRangeContent(this.Luresource.Content, startLine, stopLine, sectionContent);

    return luParser.parse(newContent);
  }

  deleteSection(id) {
    const section = this.Luresource.Sections.find(u => u.Id === id);
    if (!section) {
      return this;
    }

    var startLine = section.ParseTree.start.line - 1;
    var stopLine = section.ParseTree.stop.line - 1;

    var newContent = this.replaceRangeContent(this.Luresource.Content, startLine, stopLine, undefined);

    return luParser.parse(newContent);
  }

  replaceRangeContent(originString, startLine, stopLine, replaceString) {

    if (!originString) {
      throw new Error('replace content with error parameters.');
    }

    const originList = originString.split(/\r?\n/);
    let destList = [];
    if (isNaN(startLine) || isNaN(stopLine) || startLine < 0 || startLine > stopLine || originList.Length <= stopLine) {
      throw new Error("index out of range.");
    }

    destList.push(...originList.slice(0, startLine));

    if (replaceString) {
      destList.push(replaceString);
    }

    destList.push(...originList.slice(stopLine + 1));

    return destList.join(NEWLINE);
  }
}

module.exports = SectionOperator;
