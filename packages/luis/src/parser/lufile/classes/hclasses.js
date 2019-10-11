/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const readerObj = {
    readerObject : class {
        constructor(sourceFile, model) {
            this.sourceFile = sourceFile?sourceFile:'';
            this.model = model?model:'';
        }
    },
    entity : class {
        constructor(entity, value, start, end) {
            this.entity = entity?entity:'';
            this.value = value?value:'';
            this.start = !isNaN(start)?start:-1;
            this.end = !isNaN(end)?end:-1;
        }
    },
    intent: class {
        constructor(intent, utterances) {
            this.intent = intent?intent:'';
            this.utterances = utterances?utterances:[]
        }
    }, 
    uttereances: class {
        constructor(text, intent, entities) {
            this.text = text?text:'';
            this.intent = intent?intent:''; 
            this.entities = entities?entities:[];
        }
    },
    rLuisObj: class {
        constructor(intents, patterns) {
            this.intents = intents?intents:[];
            this.patterns = patterns?patterns:[]; 
        }
    }, 
    validateLUISBlobEntity: class {
        constructor(name, type, roles) {
            this.name = name?name:'';
            this.type = type?type:[];
            this.roles = roles?roles:[];
        }
    }, 
    pattern: class {
        constructor(pattern, intent) {
            this.pattern = pattern?pattern:'';
            this.intent = intent?intent:'';
        }
    },
    modelObj: class {
        constructor(name, mode, words, activated) {
            this.name = name?name:'';
            this.words = words?words:'';
            this.mode = mode?mode:false;
            this.activated = activated?activated:false;
        }
    }, 
    subList: class {
        constructor(canonicalForm, list) {
            this.canonicalForm = canonicalForm?canonicalForm:'';
            this.list = list?list:[];
        }
    },
    closedLists: class {
        constructor(name, subLists, roles) {
            this.name = name?name:'';
            this.subLists = subLists?subLists:[];
            this.roles = roles?roles:[];
        }
    },
    translateLine: class {
        constructor(text, localize, idx) {
            this.text = text ? text: '';
            this.localize = localize ? localize : false;
            this.idx = idx ? idx : -1;
        }
    },
    regExEntity: class {
        constructor (name, regexPattern, roles) {
            this.name = name ? name : '';
            this.regexPattern = regexPattern ? regexPattern : '';
            this.roles = roles ? roles : [];
        }
    },
    compositeEntity: class {
        constructor (name, children, roles) {
            this.name = name ? name : '';
            this.children = children ? children : [];
            this.roles = roles ? roles : [];
        }
    },
    utteranceEntity: class {
        constructor (name, startPos, endPos, role) {
            this.entity = name ? name : '';
            this.startPos = startPos ? startPos : 0;
            this.endPos = endPos ? endPos : 0
        }
    },
    parserEntity: class {
        constructor (parent, startPos, entity, value, endPos, type, role) {
            this.entity = entity ? entity : '';
            this.value = value ? value : [],
            this.startPos = startPos ? startPos : 0,
            this.endPos = endPos ? endPos : 0,
            this.type = type ? type : 'simple';
            this.role = role ? role : '';
            this.parent = parent ? parent : undefined;
        }
    },
    patternAnyEntity: class{
        constructor(name, explicitList, roles) {
            this.name = name ? name : '';
            this.explicitList = explicitList ? explicitList : [];
            this.roles = roles ? roles : [];
        }
    },
    entityAndRoles: class {
        constructor(name, type, roles) {
            this.name = name ? name : '';
            this.type = type ? type : '';
            this.roles = roles ? roles : [];
        }
        addRoles(roles) {
            (roles || []).forEach(role => {
                if (!this.roles.includes(role)) this.roles.push(role)
            })
        }
        hasRole(value) {
            return this.roles.includes(value);
        }
    },
    featureToModel: class {
        constructor(name) {
            this.featureName = name ? name : '';
        }
    },
    modelToFeature: class {
        constructor(name) {
            this.modelName = name ? name : '';
        }
    },
    childEntity: class {
        constructor(name, instanceOf, context, children, features) {
            this.name = name ? name : '';
            this.instanceOf = instanceOf ? instanceOf : '';
            this.children = children ? children : [];
            this.features = features ? features : '';
            this.context = context ? context : '';
        }
    }
};

module.exports = readerObj;

