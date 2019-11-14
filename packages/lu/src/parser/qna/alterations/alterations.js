const qnaAlterationsToLuContent = require('./qnaConverter')

class Alterations {
    constructor(alterations = null) {
        if (alterations) {
            for (let prop in alterations) {
                this[prop] = alterations[prop];
            }
        } else {
            this.wordAlterations = [];
        }
    }

    parseToLuContent() {
        return qnaAlterationsToLuContent(this)
    }

    sort() {
        this.wordAlterations.forEach(word => {
            word.alterations.sort(sortComparers.compareFn);
        });
        this.wordAlterations.sort(sortComparers.compareAltName);
    }
}

module.exports = Alterations

/**
 * Helper set of comparer functions that help with sort by examining a specific comparison logic.
 */
const sortComparers = {
    
    compareAltName : function(a, b) {
        return compareString(a.alterations[0].toUpperCase(), b.alterations[0].toUpperCase())
    },    
    compareFn : function(a, b) {
        return compareString(a.toUpperCase(), b.toUpperCase())
    }
}

const compareString = function(a, b) {
    if (a < b) {
        return -1;
    }

    if (a > b) {
        return 1;
    }

    return 0;
}