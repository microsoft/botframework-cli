const ModelInfoDefinitionContext = require('./generated/LUFileParser').LUFileParser.ModelInfoDefinitionContext;

class LUModelInfo {
    /**
     * 
     * @param {ModelInfoDefinitionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.ModelInfo = parseTree.getText();
    }
}

module.exports = LUModelInfo;