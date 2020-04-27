const lp = require('./generated/LUFileParser').LUFileParser;
const LUISObjNameEnum = require('./../utils/enums/luisobjenum');

class Visitor {
    /**
     * @param {lp.NormalIntentStringContext} ctx
     * @returns {object}
     */
    static visitNormalIntentStringContext(ctx) {
        let utterance = '';
        let entities = [];
        let errorMsgs = [];
        for (const node of ctx.children) {
            const innerNode = node;
            switch (innerNode.symbol.type) {
                case lp.DASH: break;
                case lp.EXPRESSION: {
                    let tokUtt = this.tokenizeUtterance(innerNode.getText().trim());
                    utterance = this.recurselyResolveTokenizedUtterance(tokUtt, entities, errorMsgs, utterance.trimLeft()); 
                    break;
                }
                default: {
                    utterance = utterance.concat(innerNode.getText());
                    break;
                }
            }
        }

        return { utterance: utterance.trim(), entities, errorMsgs };
    }
    /**
     * 
     * @param {Object[]} tokUtt 
     * @param {Object[]} entities 
     * @param {Object[]} errorMsgs 
     * @param {String} srcUtterance 
     */
    static recurselyResolveTokenizedUtterance(tokUtt, entities, errorMsgs, srcUtterance) {
        for (const item of tokUtt) {
            if (item === Object(item)) {
                if (item.entityValue === undefined) {
                    // we have a pattern.any entity
                    const patternStr = item.role ? `{${item.entityName}:${item.role}}` : `{${item.entityName}}`
                    srcUtterance += patternStr;
                    entities.push({
                        type: LUISObjNameEnum.PATTERNANYENTITY,
                        entity: item.entityName.trim(),
                        role: item.role.trim()
                    })
                } else {
                    // we have a new entity
                    let newEntity = {
                        type: LUISObjNameEnum.ENTITIES,
                        entity: item.entityName.trim(),
                        role: item.role.trim(),
                        startPos: srcUtterance.length,
                        endPos: undefined
                    };
                    if (item.entityValue === undefined) {
                        errorMsgs.push(`Composite entity "${item.parent.entityName}" includes pattern.any entity "${item.entityName}".\r\n\tComposites cannot include pattern.any entity as a child.`)
                    } else {
                        srcUtterance = this.recurselyResolveTokenizedUtterance(item.entityValue, entities, errorMsgs, srcUtterance).trimLeft();
                        newEntity.endPos = srcUtterance.length - 1;
                        entities.push(newEntity);
                    }
                }
            } else {
                srcUtterance += item;
            }
        }
        return srcUtterance;
    }
    /**
     * @param {string} exp 
     * @returns {object}
     */
    static tokenizeUtterance(exp) {
        let splitString = [];
        let curList = splitString;
        let curEntity = undefined;
        let entityNameCapture = false;
        let entityValueCapture = false;
        let entityRoleCapture = false;
        exp.split('').forEach(char => {
            switch(char) 
            {
                case '{':
                    let newEntity = {entityName : '', role : '', entityValue : undefined, parent : curEntity};
                    curList.push(newEntity);
                    curEntity = newEntity;
                    entityNameCapture = true;
                    entityRoleCapture = false;
                    entityValueCapture = false;
                    break;
                case '}':
                    curEntity = curEntity.parent || undefined;
                    curList = curEntity != undefined ? curEntity.entityValue : splitString;
                    entityValueCapture = false;
                    entityRoleCapture = false;
                    entityNameCapture = false;
                    break;
                case '=':
                    curEntity.entityValue = [];
                    curList = curEntity.entityValue;
                    entityNameCapture = false;
                    entityValueCapture = true;
                    entityRoleCapture = false;
                    break;
                case ':':
                    if (curEntity !== undefined && curEntity.entityName !== '' && entityNameCapture === true) {
                        entityRoleCapture = true;
                        entityNameCapture = false;
                        entityValueCapture = false;
                    } else {
                        curList.push(char);
                    }
                    break;
                default :
                    if (entityNameCapture) {
                        curEntity.entityName += char;
                    } else if (entityValueCapture) {
                        if (char === ' ') {
                            // we do not want leading spaces
                            if (curList.length !== 0) {
                                curList.push(char);
                            }
                        } else {
                            curList.push(char);
                        }
                    } else if (entityRoleCapture) {
                        curEntity.role += char;
                    } else {
                        curList.push(char);
                    }
                    break;
            }
        });
        return splitString;
    }
}

module.exports = Visitor;