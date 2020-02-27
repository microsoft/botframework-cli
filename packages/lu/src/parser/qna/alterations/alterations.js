/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

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
}

module.exports = Alterations
