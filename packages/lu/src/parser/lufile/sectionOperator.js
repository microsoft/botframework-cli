const luParser = require('./luParser');
const helpers = require('./../utils/helpers');
const { exists } = require('fs');
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

    const newResource = luParser.parseWithRef(sectionContent, this.Luresourcehis);
    if (!newResource) {
      return this.Luresource;
    }

    if (this.Luresource.Sections.some(u => u.Id === newResource.Id)) {
      throw new Error(`Section with id: ${newResource.Id} exists.`);
    }

    const lineLength = newResource.Sections[0].StopLine - newResource.Sections[0].StartLine;
    const offset = this.Luresource.Sections[this.Luresource.Sections.length - 1].StopLine;
    newResource.Sections[0].StartLine += offset + 1;
    newResource.Sections[0].StopLine += offset + lineLength + 1;

    this.Luresource.Sections.push(newResource.Sections[0]);
    this.Luresource.Errors.push(...newResource.Errors);
    this.Luresource.Content = this.Luresource.Content !== '' ? `${this.Luresource.Content}${NEWLINE}${sectionContent}` : sectionContent;
    // todo : adjust startline
    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
    return this.Luresource;
  }

  updateSection(id, sectionContent) {
    sectionContent = helpers.sanitizeNewLines(sectionContent);
    const sectionIndex = this.Luresource.Sections.findIndex(u => u.Id === id);
    if (sectionIndex < 0) {
      return this.Luresource;
    }

    const section = this.Luresource.Sections[sectionIndex];
    const newResource = luParser.parseWithRef(sectionContent, this.Luresourcehis);
    if (!newResource) {
      return this.Luresource;
    }

    this.Luresource.Sections[sectionIndex] = newResource.Sections[0];
    
    // TODO: handler errors
    this.Luresource.Content = this.replaceRangeContent(this.Luresource.Content, section.StartLine, section.StopLine, sectionContent);
    // adjust start line
    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
    return this.Luresource;
  }

  deleteSection(id) {
    const sectionIndex = this.Luresource.Sections.findIndex(u => u.Id === id);
    if (sectionIndex < 0) {
      return this;
    }

    const section = this.Luresource.Sections[sectionIndex];

    this.Luresource.Sections.splice(sectionIndex, 1);
    this.Luresource.Content = this.replaceRangeContent(this.Luresource.Content, section.StartLine, section.StopLine, undefined);
    // todo:handler errors
    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
    return this.Luresource;
  }

  insertSection(id, sectionContent) {
    sectionContent = helpers.sanitizeNewLines(sectionContent);
    const sectionIndex = this.Luresource.Sections.findIndex(u => u.Id === id);
    
    if (sectionIndex < 0 && this.Luresource.Sections.length > 0 ) {
      return this.Luresource;
    }

    const newResource = luParser.parseWithRef(sectionContent, this.Luresourcehis);
    if (!newResource) {
      return this.Luresource;
    }

    this.Luresource.Sections.splice(sectionIndex >= 0 ? sectionIndex : 0, 0, newResource);
    // todo error handler

    const startLine = sectionIndex >= 0 ? this.Luresource.Sections[sectionIndex].StartLine : 0;
    const newContent = this.replaceRangeContent(this.Luresource.Content, startLine, startLine - 1, sectionContent);
    // todo : adjust startline
    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
    this.Luresource.Content = newContent;
  }

  replaceRangeContent(originString, startLine, stopLine, replaceString) {
    const originList = originString.split(/\r?\n/);
    let destList = [];
    if (isNaN(startLine) || isNaN(stopLine) || startLine < 0 || startLine > stopLine + 1 || originList.length <= stopLine) {
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
