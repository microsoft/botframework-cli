const luParser = require('./luParser');

class LUResource {
  /**
   * @param {any[]} sections
   * @param {string} content
   * @param {any[]} errors
   */
  constructor(sections, content, errors) {
    this.Sections = sections;
    this.Content = content;
    this.Errors = errors;
  }

  // TODO
  // After CRUD, section Ids will be Scrambled and regenerated.
  addSection(sectionContent) {
    this.checkSectionContent(sectionContent);
    var newContent = `${this.Content}\r\n${sectionContent}`;

    return luParser.parse(newContent);
  }

  updateSection(id, sectionContent) {
    this.checkSectionContent(sectionContent);

    const section = this.Sections.find(u => u.Id === id);
    if (!section) {
       return this;
    }

    var startLine = section.ParseTree.Start.Line - 1;
    var stopLine = section.ParseTree.Stop.Line - 1;

    var newContent = this.replaceRangeContent(this.Content, startLine, stopLine, sectionContent);

    return luParser.parse(newContent);
  }

  deleteSection(id) {
    const section = this.Sections.find(u => u.Id === id);
    if (!section) {
       return this;
    }

    var startLine = section.ParseTree.Start.Line - 1;
    var stopLine = section.ParseTree.Stop.Line - 1;

    var newContent = this.replaceRangeContent(this.Content, startLine, stopLine, undefined);

    return luParser.parse(newContent);
  }

  checkSectionContent(sectionContent) {
    let findSection = false;
    const originList = originString.split('\n');

    for (let line of originList) {
      if (this.isIntentSection(line) 
        || this.isEntitySection(line) 
        || this.isImportSection(line)
        || this.isModelInfoSection(line)
        || this.isQnaSection(line)) {
          if (!findSection) {
            findSection = true;
            continue;
          } else {
            throw new Error("Please operate one section at a time.");
          }
        }
    }

  }

  replaceRangeContent(originString, startLine, stopLine, replaceString) {

    if (!originString) {
      throw new Error('replace content with error parameters.');
    }

    const originList = originString.split('\n');
    let destList = [];
    if (isNaN(startLine) || isNaN(stopLine) || startLine < 0 || startLine > stopLine || originList.Length <= stopLine) {
        throw new Error("index out of range.");
    }

    destList.push(...originList.slice(0, startLine));

    if (replaceString)
    {
        destList.push(replaceString);
    }

    destList.push(...originList.slice(stopLine + 1));

    return destList.join('\n');
  }

  isIntentSection(line) {
    return line && line.startsWith('#') && !line.startsWith('##');
  }

  isEntitySection(line) {
    return line && line.startsWith('$');
  }

  isImportSection(line) {
    const importPattern = /^\[[^\[]+\]\([^|]+\)$/gi;
    return line && importPattern.test(line);
  }

  isModelInfoSection(line) {
    return line && line.startsWith('> !#');
  }

  isQnaSection(line) {
    const qnaPattern = /^#+ +\?/gi;
    return line && qnaPattern.test(line);
  }
}

module.exports = LUResource;