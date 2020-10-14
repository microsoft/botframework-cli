const luParser = require('./luParser');
const helpers = require('./../utils/helpers');
const NEWLINE = require('os').EOL;
const LUResource = require('./luResource');
const LUSectionTypes = require('../utils/enums/lusectiontypes');

class SectionOperator {

  /**
   * @param {LUResource} luresource 
   */
  constructor(luresource) {
    this.Luresource = JSON.parse(JSON.stringify(luresource));
  }

  // After CRUD, section Ids will keep same unless you change section name.
  addSection(sectionContent) {
    sectionContent = helpers.sanitizeNewLines(sectionContent);

    const newResource = luParser.parseWithRef(sectionContent, this.Luresource);
    if (!newResource) {
      return this.Luresource;
    }

    if (this.Luresource.Sections.some(u => u.Id === newResource.Id)) {
      throw new Error(`Section with id: ${newResource.Id} exists.`);
    }

    const offset = !this.Luresource.Content ? 0 : this.Luresource.Content.split(/\r?\n/).length;

    this.Luresource.Content = this.Luresource.Content !== '' ? `${this.Luresource.Content}${NEWLINE}${sectionContent}` : sectionContent;

    // add a NestedIntentSection may appears multiple sections
    this.adjustRangeForAddSection(newResource.Sections, offset);
    this.Luresource.Sections.push(...newResource.Sections);

    this.adjustRangeForErrors(newResource.Errors, offset);
    this.Luresource.Errors.push(...newResource.Errors);

    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
    return this.Luresource;
  }

  updateSection(id, sectionContent) {
    sectionContent = helpers.sanitizeNewLines(sectionContent);
    const sectionIndex = this.Luresource.Sections.findIndex(u => u.Id === id);
    if (sectionIndex < 0) {
      return this.Luresource;
    }

    const oldSection = this.Luresource.Sections[sectionIndex];
    const newResource = luParser.parseWithRef(sectionContent, this.Luresource);
    if (!newResource) {
      return this.Luresource;
    }

    // add a NestedIntentSection may appears multiple sections
    const startLine = oldSection.Range.Start.Line;
    const endLine = oldSection.Range.End.Line;

    this.removeErrors(this.Luresource.Errors, startLine, endLine);

    // adjust original errors
    const newLineRange = sectionContent.split(/\r?\n/).length;
    const originalRange = endLine - startLine + 1;
    this.adjustRangeForErrors(this.Luresource.Errors, newLineRange - originalRange, endLine);

    // adjust updated sections' errors
    const offset = oldSection.Range.Start.Line - 1;
    this.adjustRangeForErrors(newResource.Errors, offset);
    this.Luresource.Errors.push(...newResource.Errors);

    this.Luresource.Content = this.replaceRangeContent(this.Luresource.Content, oldSection.Range.Start.Line - 1, oldSection.Range.End.Line - 1, sectionContent);
    this.adjustRangeForUpdateSection(sectionIndex, newResource.Sections);

    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
    return this.Luresource;
  }

  deleteSection(id) {
    const sectionIndex = this.Luresource.Sections.findIndex(u => u.Id === id);
    if (sectionIndex < 0) {
      return this.Luresource;
    }

    const oldSection = this.Luresource.Sections[sectionIndex];
    const startLine = oldSection.Range.Start.Line;
    const endLine = oldSection.Range.End.Line;

    this.removeErrors(this.Luresource.Errors, startLine, endLine);
    this.adjustRangeForErrors(this.Luresource.Errors, startLine - endLine, endLine);

    this.Luresource.Sections.splice(sectionIndex, 1);
    this.Luresource.Content = this.replaceRangeContent(this.Luresource.Content, startLine - 1, endLine - 1, undefined);

    const offset = endLine - startLine + 1;
    this.adjustRangeForDeleteSection(sectionIndex, offset);
    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
    return this.Luresource;
  }

  insertSection(id, sectionContent) {
    // insert into the front of the old section
    sectionContent = helpers.sanitizeNewLines(sectionContent);
    const sectionIndex = this.Luresource.Sections.findIndex(u => u.Id === id);

    if (sectionIndex < 0 && this.Luresource.Sections.length > 0) {
      return this.Luresource;
    }

    // if secionIndex < 0 and the luresource is empty, just add it
    if (sectionIndex < 0 && this.Luresource.Sections.length === 0) {
      return this.addSection(sectionContent);
    }

    const newResource = luParser.parseWithRef(sectionContent, this.Luresource);
    if (!newResource) {
      return this.Luresource;
    }

    // add a NestedIntentSection may appears multiple sections

    // adjust original errors
    const newLineRange = sectionContent.split(/\r?\n/).length;
    const startLine = sectionIndex < 0 ? 1 : this.Luresource.Sections[sectionIndex].Range.Start.Line;
    this.adjustRangeForErrors(this.Luresource.Errors, newLineRange, startLine);

    // adjust the insert errors of section
    this.adjustRangeForErrors(newResource.Errors, startLine - 1);
    this.Luresource.Errors.push(...newResource.Errors);

    this.Luresource.Content = this.replaceRangeContent(this.Luresource.Content, startLine - 1, startLine - 2, sectionContent);
    this.adjustRangeForInsertSection(sectionIndex, newResource.Sections);

    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
    return this.Luresource;
  }

  removeErrors(errors, startLine, endLine) {
    if (errors && startLine >= 0 && endLine >= startLine) {
      let index = -1;

      while ((index = errors.findIndex(u =>
        !u.Range || ((u.Range.Start.Line >= startLine && u.Range.Start.Line <= endLine)
        || (u.Range.End.Line >= startLine && u.Range.End.Line <= endLine)))) >= 0) {
        this.Luresource.Errors.splice(index, 1);
      }
    }
  }

  adjustRangeForErrors(errors, offset, startLine, endLine) {
    if (errors) {
      if (startLine === undefined && endLine === undefined) {
        errors.forEach(u => {
          this.adjustErrorRange(u, offset);
        });
      } else if (startLine >= 0 && (endLine === undefined || endLine < startLine)) {
        errors.forEach(u => {
          if (u.Range && u.Range.Start.Line >= startLine) {
            this.adjustErrorRange(u, offset);
          }
        });
      } else if (startLine >= 0 && endLine >= startLine) {
        errors.forEach(u => {
          if (u.Range && u.Range.Start.Line >= startLine && u.Range.End.Line <= endLine) {
            this.adjustErrorRange(u, offset);
          }
        });
      }
    }
  }
  
  adjustErrorRange(error, offset) {
    if (error && error.Range) {
      error.Range.Start.Line += offset;
      error.Range.End.Line += offset;
    }
  }

  adjustRangeForAddSection(newSections, offset) {
    newSections.forEach(u => {
      this.adjustSectionRange(u, offset);
    });
  }

  adjustSectionRange(section, offset) {
    if (section) {
      if (section.SimpleIntentSections && section.SectionType === LUSectionTypes.NESTEDINTENTSECTION && section.SimpleIntentSections) {
        section.SimpleIntentSections.forEach(k => {
          k.Range.Start.Line += offset;
          k.Range.End.Line += offset;
        });
      }
  
      section.Range.Start.Line += offset;
      section.Range.End.Line += offset;
    }
  }

  adjustRangeForDeleteSection(index, offset) {
    for (let i = index; i < this.Luresource.Sections.length; i++) {
      const section = this.Luresource.Sections[i];
      this.adjustSectionRange(section, -offset) 
    }
  }

  adjustRangeForUpdateSection(oldIndex, newSections) {
    const sectionsSize = newSections.length;
    const oldStartLine = this.Luresource.Sections[oldIndex].Range.Start.Line;
    const oldEndLine = this.Luresource.Sections[oldIndex].Range.End.Line;
    const newEndLine = newSections[newSections.length - 1].Range.End.Line;

    this.Luresource.Sections.splice(oldIndex, 1, ...newSections);

    // adjust updated sections' range
    const updateOffset = oldStartLine - 1;
    for (let i = oldIndex; i < oldIndex + sectionsSize; i++) {
      const section = this.Luresource.Sections[i];
      this.adjustSectionRange(section, updateOffset);
    }

    // adjust remaining sections' range
    const remainingOffset = (newEndLine - 1) - (oldEndLine - oldStartLine);
    for (let i = oldIndex + sectionsSize; i < this.Luresource.Sections.length; i++) {
      const section = this.Luresource.Sections[i];
      this.adjustSectionRange(section, remainingOffset);
    }
  }

  adjustRangeForInsertSection(postIndex, newSections) {
    const sectionsSize = newSections.length;
    const insertOffset = postIndex < 0 ? 0 : this.Luresource.Sections[postIndex].Range.Start.Line - 1;
    const newEndLine = newSections[newSections.length - 1].Range.End.Line;

    this.Luresource.Sections.splice(postIndex, 0, ...newSections);

    // adjust inserted sections' range
    for (let i = postIndex; i < postIndex + sectionsSize; i++) {
      const section = this.Luresource.Sections[i];
      this.adjustSectionRange(section, insertOffset);
    }

    // adjust remaining sections' range
    const remainingOffset = newEndLine;
    for (let i = postIndex + sectionsSize; i < this.Luresource.Sections.length; i++) {
      const section = this.Luresource.Sections[i];
      this.adjustSectionRange(section, remainingOffset);
    }
  }

  replaceRangeContent(originString, startLine, stopLine, replaceString) {
    const originList = originString.split(/\r?\n/);
    let destList = [];
    if (isNaN(startLine) || isNaN(stopLine) || startLine < 0 || startLine > stopLine + 1) {
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
