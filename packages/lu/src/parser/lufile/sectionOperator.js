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
    this.adjustRangeForAddSection(newSection, offset);
    this.adjustRangeForErrors(newResource.Errors, offset);
    this.Luresource.Errors.push(...newResource.Errors);
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

    const oldSection = this.Luresource.Sections[sectionIndex];
    const newResource = luParser.parseWithRef(sectionContent, this.Luresourcehis);
    if (!newResource) {
      return this.Luresource;
    }

    const newSection = newResource.Sections[0];
    const startLine =  oldSection.Range.Start.Line;
    const endLine = oldSection.Range.End.Line;

    this.removeErrors(this.Luresource.Errors, startLine, endLine);
    
    const newLineRange = newSection.Range.End.Line - newSection.Range.Start.Line;
    const originalRange = endLine - startLine;
    this.adjustRangeForErrors(this.Luresource.Errors, newLineRange - originalRange, endLine);
    
    const offset = oldSection.Range.Start.Line - newSection.Range.Start.Line;
    this.adjustRangeForErrors(newResource.Errors, offset);
    this.Luresource.Errors.push(...newResource.Errors);

    this.Luresource.Content = this.replaceRangeContent(this.Luresource.Content, oldSection.Range.Start.Line, oldSection.Range.End.Line, sectionContent);
    this.adjustRangeForUpdateSection(oldSection, newSection);

    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
    return this.Luresource;
  }

  deleteSection(id) {
    const sectionIndex = this.Luresource.Sections.findIndex(u => u.Id === id);
    if (sectionIndex < 0) {
      return this;
    }

    const oldSection = this.Luresource.Sections[sectionIndex];
    const startLine =  oldSection.Range.Start.Line;
    const endLine = oldSection.Range.End.Line;
    
    this.removeErrors(this.Luresource.Errors, startLine, endLine);
    this.adjustRangeForErrors(this.Luresource.Errors, startLine - endLine, endLine);

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

    const previoudSection = sectionIndex < 0 ? undefined : this.Luresource.Sections[sectionIndex];

    const newResource = luParser.parseWithRef(sectionContent, this.Luresourcehis);
    if (!newResource) {
      return this.Luresource;
    }
    const newSection = newResource.Sections[0];

    this.Luresource.Sections.splice(sectionIndex + 1, 0, newSection);
    
    
    // adjust original errors
    const offset = previoudSection ? previoudSection.Range.End.Line : 0;
    this.adjustRangeForErrors(this.Luresource.Errors, offset, newSection.End.Line - newSection.Start.Line);
    this.adjustRangeForErrors(newResource.Errors, offset);
    this.Luresource.Errors.push(...newResource.Errors);

    // todo??
    const startLine = previoudSection ? previoudSection.Range.Start.Line : 0;
    this.Luresource.Content = this.replaceRangeContent(this.Luresource.Content, startLine, startLine - 1, sectionContent);
    this.adjustRangeForInsertSection(newSection);

    luParser.extractSectionBody(this.Luresource.Sections, this.Luresource.Content);
    return this.Luresource;
  }

  removeErrors(errors, startLine, endLine) {
    if (errors && startLine >= 0 && endLine >= startLine) {
      let index = -1;

      while ((index = errors.findIndex(u => 
        (u.Range.Start.Line >= startLine && u.Range.Start.Line <= endLine) 
        || (u.Range.End.Line >= startLine && u.Range.End.Line <= endLine))) >= 0) {
          this.Luresource.Errors.splice(index, 1);
        }
    }
  }

  adjustRangeForErrors(errors, offset, startLine, endLine) {
    if (errors) {
      if (startLine === undefined && endLine === undefined) {
        errors.forEach(u => {
          u.Range.Start.Line += offset;
          u.Range.End.Line += offset;
        });
      } else if (startLine >= 0 && (endLine === undefined || endLine < startLine)) {
        if (u.Range.Start.Line >= startLine) {
          u.Range.Start.Line += offset;
          u.Range.End.Line += offset;
        }
      } else if (startLine >= 0 && endLine >= startLine) {
        if (u.Range.Start.Line >= startLine && u.Range.End.Line <= endLine) {
          u.Range.Start.Line += offset;
          u.Range.End.Line += offset;
        }
      }
    }
  }

  adjustRangeForAddSection(newSection, offset) {
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
