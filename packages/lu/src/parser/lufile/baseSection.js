class BaseSection {
    constructor(parameters) {
        this.Errors = [];
        this.SectionType = '';
        this.Id = '';
        this.Body = '';
        this.Range;

        if (parameters) {
            this.Errors = parameters.Errors || [];
            this.SectionType = parameters.SectionType || '';
            this.Id = parameters.Id || '';
            this.Body = parameters.Body || '';
            this.Range = parameters.Range;
        }
    }
}

module.exports = BaseSection;