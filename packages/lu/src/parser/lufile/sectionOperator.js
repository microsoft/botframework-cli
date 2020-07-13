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

    const newSection = newResource.Sections[0];
    this.adjustRangeForAddTemplate(newSection);

    this.Luresource.Sections.push(newSection);
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

    // TODO: handler errors
    this.Luresource.Content = this.replaceRangeContent(this.Luresource.Content, section.StartLine, section.StopLine, sectionContent);
    this.adjustRangeForUpdateSection(this.Luresource.Sections[sectionIndex], newResource.Sections[0]);
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
    const newSection = newResource.Sections[0];

    this.Luresource.Sections.splice(sectionIndex >= 0 ? sectionIndex : 0, 0, newSection);
    // todo error handler

    const startLine = sectionIndex >= 0 ? this.Luresource.Sections[sectionIndex].StartLine : 0;
    this.Luresource.Content = this.replaceRangeContent(this.Luresource.Content, startLine, startLine - 1, sectionContent);
    this.adjustRangeForInsertSection(newSection);
    
    return this.Luresource;
  }

  adjustRangeForAddTemplate(newSection) {
    const lineLength = newSection.StopLine - newSection.StartLine;
    const offset = this.Luresource.Sections[this.Luresource.Sections.length - 1].StopLine;
    newSection.StartLine += offset + 1;
    newSection.StopLine += offset + lineLength + 1;
  }

  adjustRangeForUpdateSection(oldSection, newSection) {
    const newRange = newSection.StopLine - newSection.StartLine;
    const oldRange = oldSection.StopLine - oldSection.StartLine;

    const lineOffset = newRange - oldRange;

    let hasFound = false;
    for (let i = 0; i < this.Luresource.Sections.length; i++) {
        if (hasFound) {
            this.Luresource.Sections[i].StartLine += lineOffset;
            this.Luresource.Sections[i].StopLine += lineOffset;
        } else if (this.Luresource.Sections[i].Id === oldSection.Id) {
            hasFound = true;
            newSection.StartLine = oldSection.StartLine;
            newSection.StopLine = oldSection.StopLine + lineOffset;
            this.Luresource.Sections[i] = newSection;
        }
    }
    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
  }

  adjustRangeForInsertSection(newSection) {
    // TODO handler if the section if the first section
    const lineOffset = newSection.StopLine - newSection.StartLine;

    let hasFound = false;
    for (let i = 0; i < this.Luresource.Sections.length; i++) {
        if (hasFound) {
            this.Luresource.Sections[i].StartLine += lineOffset;
            this.Luresource.Sections[i].StopLine += lineOffset;
        } else if (this.Luresource.Sections[i].Id === newSection.Id) {
            hasFound = true;
            this.Luresource.Sections[i].StartLine +=  this.Luresource.Sections[i-1].StopLine;
            this.Luresource.Sections[i].StopLine += this.Luresource.Sections[i-1].StopLine;
        }
    }
    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
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
