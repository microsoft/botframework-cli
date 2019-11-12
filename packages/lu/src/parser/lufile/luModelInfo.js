
class LUModelInfo {
    /**
     * 
     * @param {ImportDefinitionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.ModelInfo = parseTree.getText();
    }
}

module.exports = LUModelInfo;