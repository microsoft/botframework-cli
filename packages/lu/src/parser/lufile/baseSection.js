class BaseSection {
    constructor(errors, sectionType, id, startLine, stopLine, body) {
        this.Errors = errors || [];
        this.SectionType = sectionType || '';
        this.Id = id || '';
        this.StartLine = startLine || 0;
        this.StopLine = stopLine || 0;
        this.Body = body || '';
    }
}

module.exports = BaseSection;