const luParser = require('./luParser');
const helpers = require('./helpers');
  
class SectionOperator {

    /**
     * @param {LUResource} luresource 
     */
    constructor(luresource) {
        this.Luresource = luresource;
    }

    // TODO
    // After CRUD, section Ids will be Scrambled and regenerated.
    addSection(sectionContent) {
        sectionContent = helpers.sanitizeNewLines(sectionContent);
        this.checkSectionContent(sectionContent);
        var newContent = `${this.Luresource.Content}\r\n${sectionContent}`;

        const result = luParser.parse(newContent);
        return result;
    }

    updateSection(id, sectionContent) {
        sectionContent = helpers.sanitizeNewLines(sectionContent);
        this.checkSectionContent(sectionContent);

        const section = this.Luresource.Sections.find(u => u.Id === id);
        if (!section) {
        return this;
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

    checkSectionContent(sectionContent) {
        let findSection = false;
        const originList = sectionContent.split('\n');

        for (let line of originList) {
            if (!line) {
                continue;
            }

            line = line.trim();
            if (this.isIntentSection(line) 
                || this.isEntitySection(line) 
                || this.isImportSection(line)
                || this.isModelInfoSection(line)
                || this.isQnaSection(line)
                || this.isNewEntitySection(line)) {
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
        if (isSectionEnabled) {
            return line.startsWith('#') && !line.startsWith('##');
        } else {
            return line.startsWith('#') || line.startsWith('##');
        }
    }

    isEntitySection(line) {
        return line.startsWith('$');
    }

    isImportSection(line) {
        const importPattern = /^\[[^\[]+\]\([^|]+\)$/gi;
        return importPattern.test(line);
    }

    isModelInfoSection(line) {
        return line.startsWith('> !#');
    }

    isQnaSection(line) {
        const qnaPattern = /^#+ +\?/gi;
        return qnaPattern.test(line);
    }

    isNewEntitySection(line) {
        return line && line.trim().startsWith('@');
    }

    // TODO. Get it from luparser? or get it from luresource?
    isSectionEnabled() {
        return true;
    }
}

module.exports = SectionOperator;