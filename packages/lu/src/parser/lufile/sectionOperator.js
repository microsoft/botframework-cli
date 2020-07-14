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

    this.Luresource.Content = this.Luresource.Content !== '' ? `${this.Luresource.Content}${NEWLINE}${sectionContent}` : sectionContent;

    const offset = this.Luresource.Content.split(/\r?\n/).length;
    const newSection = newResource.Sections[0];
    this.adjustRangeForAddTemplate(newSection, offset);

    // adjust error range
    newResource.Errors.forEach(u => {
      u.Range.Start.Line += offset;
      u.Range.End.Line += offset;
      this.Luresource.Errors.push(u);
    });

    this.Luresource.Sections.push(newSection);
    
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

    const startLine =  section.Range.Start.Line;
    const endLine = section.Range.End.Line;

    // remove the original errors.
    let index = -1;
    while ((index = this.Luresource.Errors.findIndex(u => 
      (u.Range.Start.Line >= startLine && u.Range.Start.Line <= endLine) 
      || (u.Range.End.Line >= startLine && u.Range.End.Line <= endLine))
      ) >= 0) {
        this.Luresource.Errors.splice(index, 1);
      }
    
    // adjust current errors
    const newLineRange = newResource.Sections[0].Range.End.Line - newResource.Sections[0].Range.Start.Line;
    const originalRange = endLine - startLine;
    const originalOffset = newLineRange - originalRange;
    this.Luresource.Errors.forEach(u => {
      if (u.Range.Start.Line > endLine) {
        u.Range.Start.Line += originalOffset;
        u.Range.End.Line += originalOffset;
      }
    });
    
    const offset = this.Luresource.Sections[sectionIndex].Range.Start.Line - newResource.Sections[0].Range.Start.Line;
    // append the new errors
    newResource.Errors.forEach(u => {
      u.Range.Start.Line += offset;
      u.Range.End.Line += offset;
      this.Luresource.Errors.push(u);
    });

    this.Luresource.Content = this.replaceRangeContent(this.Luresource.Content, section.Range.Start.Line, section.Range.End.Line, sectionContent);
    this.adjustRangeForUpdateSection(this.Luresource.Sections[sectionIndex], newResource.Sections[0]);
    return this.Luresource;
  }

  deleteSection(id) {
    const sectionIndex = this.Luresource.Sections.findIndex(u => u.Id === id);
    if (sectionIndex < 0) {
      return this;
    }

    const section = this.Luresource.Sections[sectionIndex];
    const startLine =  section.Range.Start.Line;
    const endLine = section.Range.End.Line;
    
    // remove the original errors.
    let index = -1;
    while ((index = this.Luresource.Errors.findIndex(u => 
      (u.Range.Start.Line >= startLine && u.Range.Start.Line <= endLine) 
      || (u.Range.End.Line >= startLine && u.Range.End.Line <= endLine))
      ) >= 0) {
        this.Luresource.Errors.splice(index, 1);
      }
    
      // adjust original errors
      const offset = endLine - startLine;
      this.Luresource.Errors.forEach(u => {
        if (u.Range.Start.Line > endLine) {
          u.Range.Start.Line -= offset;
          u.Range.End.Line -= offset;
        }
      });

    this.Luresource.Sections.splice(sectionIndex, 1);
    this.Luresource.Content = this.replaceRangeContent(this.Luresource.Content, startLine, endLine, undefined);
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
    
    // adjust original errors
    const offset = sectionIndex >= 0 ? this.Luresource.Sections[sectionIndex].Range.End.Line : 0;
    const rangOffset = newSection.End.Line - newSection.Start.Line;
    this.Luresource.Errors.forEach(u => {
      if (u.Range.Start.Line > offset) {
        u.Range.Start.Line += rangOffset;
        u.Range.End.Line += rangOffset;
      }
    });

    // append the new errors
    newResource.Errors.forEach(u => {
      u.Range.Start.Line += offset;
      u.Range.End.Line += offset;
      this.Luresource.Errors.push(u);
    });

    const startLine = sectionIndex >= 0 ? this.Luresource.Sections[sectionIndex].Range.Start.Line : 0;
    this.Luresource.Content = this.replaceRangeContent(this.Luresource.Content, startLine, startLine - 1, sectionContent);
    this.adjustRangeForInsertSection(newSection);
    
    return this.Luresource;
  }

  adjustRangeForAddTemplate(newSection, offset) {
    const lineLength = newSection.Range.End.Line - newSection.Range.Start.Line;
    newSection.Range.Start.Line += offset;
    newSection.Range.End.Line += offset + lineLength;
  }

  adjustRangeForUpdateSection(oldSection, newSection) {
    const newRange = newSection.Range.End.Line - newSection.Range.Start.Line;
    const oldRange = oldSection.Range.End.Line - oldSection.Range.Start.Line;

    const lineOffset = newRange - oldRange;

    let hasFound = false;
    for (let i = 0; i < this.Luresource.Sections.length; i++) {
        if (hasFound) {
            this.Luresource.Sections[i].Range.Start.Line += lineOffset;
            this.Luresource.Sections[i].Range.End.Line += lineOffset;
        } else if (this.Luresource.Sections[i].Id === oldSection.Id) {
            hasFound = true;
            newSection.Range.Start.Line = oldSection.Range.Start.Line;
            newSection.Range.End.Line = oldSection.Range.End.Line + lineOffset;
            this.Luresource.Sections[i] = newSection;
        }
    }
    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
  }

  adjustRangeForInsertSection(newSection) {
    // TODO handler if the section if the first section
    const lineOffset = newSection.Range.End.Line - newSection.Range.Start.Line;

    let hasFound = false;
    for (let i = 0; i < this.Luresource.Sections.length; i++) {
        if (hasFound) {
            this.Luresource.Sections[i].Range.Start.Line += lineOffset;
            this.Luresource.Sections[i].Range.End.Line += lineOffset;
        } else if (this.Luresource.Sections[i].Id === newSection.Id) {
            hasFound = true;
            this.Luresource.Sections[i].Range.Start.Line +=  this.Luresource.Sections[i-1].Range.End.Line;
            this.Luresource.Sections[i].Range.End.Line += this.Luresource.Sections[i-1].Range.End.Line;
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
