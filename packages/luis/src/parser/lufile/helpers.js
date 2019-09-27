#!/usr/bin/env node
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
require('./utils');
const fs = require('fs');
const path = require('path');
const retCode = require('./enums/CLI-errors');
const exception = require('./classes/exception');
const NEWLINE = require('os').EOL;
const ANY_NEWLINE = /\r\n|\r|\n/g;
const url = require('url');
const helpers = {

    /**
     * 
     * @param {string} fileContent string content of file may contain any new line chars.
     * @returns {string} string content of file using current OS new line char
     */
    sanitizeNewLines(fileContent) {
        return fileContent.replace(ANY_NEWLINE, NEWLINE);
    },

    /**
     * Helper function to recursively get all .lu files
     * @param {string} inputfolder input folder name
     * @param {boolean} getSubFolder indicates if we should recursively look in sub-folders as well
     * @returns {Array} Array of .lu files found
    */
   findLUFiles: function(inputFolder, getSubFolders) {
        let results = [];
        const luExt = '.lu';
        fs.readdirSync(inputFolder).forEach(function(dirContent) {
            dirContent = path.resolve(inputFolder,dirContent);
            if(getSubFolders && fs.statSync(dirContent).isDirectory()) {
                results = results.concat(helpers.findLUFiles(dirContent, getSubFolders));
            }
            if(fs.statSync(dirContent).isFile()) {
                if(dirContent.endsWith(luExt)) {
                    results.push(dirContent);
                }
            }
        });
        return results;
    },
    /**
     * Helper function to parse link URIs in utterances
     * @param {String} utterance
     * @returns {Object} Object that contains luFile and ref. ref can be Intent-Name or ? or * or **
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    parseLinkURI : function(utterance) {
        let reference = '';
        let luFileInRef = '';
        let linkValueList = utterance.trim().match(new RegExp(/\(.*?\)/g));
        let linkValue = linkValueList[0].replace('(', '').replace(')', '');
        if (linkValue === '') throw (new exception(retCode.errorCode.INVALID_LU_FILE_REF, `[ERROR]: Invalid LU File Ref: "${utterance}"`));
        let parseUrl = url.parse(linkValue);
        if (parseUrl.host || parseUrl.hostname) throw (new exception(retCode.errorCode.INVALID_LU_FILE_REF, `[ERROR]: Invalid LU File Ref: "${utterance}". \n Reference cannot be a URI`));
        // reference can either be #<Intent-Name> or #? or /*#? or /**#?
        let splitReference = linkValue.split(new RegExp(/(.*?)(#|\*+)/g));
        if(splitReference.length === 1) throw (new exception(retCode.errorCode.INVALID_LU_FILE_REF, `[ERROR]: Invalid LU File Ref: "${utterance}".\n Reference needs a qualifier - either a #Intent-Name or #?`));
        luFileInRef = splitReference[1];
        switch(splitReference[2]) {
            case '#':{
                reference = splitReference[3];
                break;
            }
            case '**': 
            case '*': {
                if(splitReference[6] !== '?') throw (new exception(retCode.errorCode.INVALID_LU_FILE_REF, `[ERROR]: Invalid LU File Ref: "${utterance}".\n '*' and '**' can only be used with QnA qualitifier. e.g. *#? and **#?`));
                reference = splitReference[6];
                luFileInRef = luFileInRef + '*';
                break;
            }
            default:
            throw (new exception(retCode.errorCode.INVALID_LU_FILE_REF, `[ERROR]: Invalid LU File Ref: "${utterance}".\n Unsupported syntax. Not expecting ${splitReference[2]}`));
        }
        if (reference === "" && splitReference.length >= 7 && splitReference[7].toLowerCase() === 'utterances') reference = splitReference[7].toLowerCase();
        if (reference === "" && splitReference.length >= 7 && splitReference[7].toLowerCase() === 'patterns') reference = splitReference[7].toLowerCase();
        if (reference === "" && splitReference.length >= 7 && splitReference[7].toLowerCase() === 'utterancesandpatterns') reference = splitReference[7].toLowerCase();

        return {
            luFile: luFileInRef,
            ref: reference
        }
    },
    /**
     * Helper function to do a filter operation based search over an Array
     * @param {Array} srcList Object to filter on
     * @param {string} property Property to evaluate
     * @param {string} searchValue Target value to compare
     * @returns {Array} Array of matching values
     */
    filterMatch : function (srcList, property, searchValue) {
        return srcList.filter(function(item) {
            return item[property] == searchValue;
        });
    },
    /**
     * Helper function to get roles if defined via the entity type definition
     * @param {String} entityType entity type definition passed in.
     * @returns {Object} roles and entityType parsed out. roles is always a list even if no role definitions are found
     */
    getRolesAndType : function (entityType) {
        let returnValue = {
            roles : [],
            entityType : ''
        };
        let RoleDetectionRegEx = new RegExp(/[Rr]ole[s]*[\s?]*=/g);
        let RolesSplitRegEx = new RegExp(/[;,]/g);
        let [parsedEntityType, parsedRoleDefinition] = entityType.split(RoleDetectionRegEx).map(item => item.trim());
        returnValue.entityType = parsedEntityType;
        if (parsedRoleDefinition !== undefined) {
            returnValue.roles = parsedRoleDefinition.replace('[', '').replace(']', '').split(RolesSplitRegEx).map(item => item.trim());
        }
        return returnValue;
    },
    /**
     * Helper function to detect if a given text is a link reference
     * @param {String} utterance utterance text to examine
     * @returns {Boolean} true if input is a link reference
     */
    isUtteranceLinkRef : function (utterance) {
        utterance = utterance || '';
        // Ensure only links are detected and passed on to be parsed.
        // Valid link: [bar](xyz)
        // Not a link: [bar](xyz|123), [bar[tar]](xyz), abc [foo](bar)
        let linkDetectRegex = /^\[[^\[]+\]\([^|]+\)$/gi;
        return linkDetectRegex.test(utterance);   
    },
    /**
     * Helper function to detect if a given text is a pattern.
     * @param {String} utterance
     * @returns {Boolean} true if utterance is a pattern 
     */
    isUtterancePattern : function (utterance) {
        utterance = utterance || '';
        // link references cannot be a pattern
        if (this.isUtteranceLinkRef(utterance)) return false;

        // patterns must have at least one [optional] and or one (group | text)
        let detectPatternRegex = /(\[.*?\])|(\(.*?(\|.*?)+\))/gi;
        return detectPatternRegex.test(utterance);
    }
}

module.exports = helpers;
