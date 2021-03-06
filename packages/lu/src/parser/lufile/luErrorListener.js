import antlr4 from 'antlr4';
const Position = require('./diagnostic').Position;
const Range = require('./diagnostic').Range;
const Diagnostic = require('./diagnostic').Diagnostic;
const AntlrTokens = require('./diagnostic').AntlrTokens;

class LUErrorListener extends antlr4.error.ErrorListener {

    constructor(errors) {
        super();
        this.errors = errors;
    }
    
    syntaxError(recognizer, offendingSymbol, line, charPositionInLine, msg, e) {
        const startPosition = new Position(line, charPositionInLine);
        const stopPosition = new Position(line, charPositionInLine + offendingSymbol.stop - offendingSymbol.start + 1);
        const range = new Range(startPosition, stopPosition);
        msg = `syntax error: ` + msg;
        const invalidToken = msg.match(/'([^']+)'/)[1];
        const expectedTokenStr = msg.substring(msg.indexOf('{') + 1, msg.lastIndexOf('}'));
        const expectedTokens = expectedTokenStr.split(',');
        if (expectedTokenStr.length > 0 && expectedTokens.length > 0) {
            msg = `syntax error: invalid input '${invalidToken}' detected. Expecting one of this - `;
            expectedTokens.forEach(token => {
                msg += AntlrTokens[token.trim()] + ', ';
            });
    
            msg = msg.substring(0, msg.lastIndexOf(', '));
        }
        
        const diagnostic = new Diagnostic(range, msg);
        this.errors.push(diagnostic);
    }

}

module.exports = LUErrorListener;