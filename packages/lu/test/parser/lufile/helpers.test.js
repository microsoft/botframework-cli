/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const chai = require('chai');
const assert = chai.assert;
const helpers = require('./../../../src/parser/utils/helpers');
const path = require('path');

const LUDOWN_ROOT = path.join(__dirname, './../../fixtures/');
function resolvePath(relativePath) {
    return path.join(LUDOWN_ROOT, relativePath);
}

describe('With helper functions', function() {
    it('findLUFiles should recursively find subfolders', function(done) {
        let rootPath = resolvePath('examples');
        let findFilesIncludingSubfolders = helpers.findLUFiles(rootPath, true);
        let findFilesInRootFolder = helpers.findLUFiles(rootPath, false);
        try {
            assert.notEqual(findFilesIncludingSubfolders.length, findFilesInRootFolder.length);
            done();
        } catch (err) {
            done(err);
        }
    });

    it('parseLinkURI throws when invalid link definition is found', function(done){
        let testLu = `[test](https://botframework.com`;
        helpers.parseLinkURI(testLu)
            .then(res => {
                done('Test failed: splitFileBySections did not throw!');
            }).catch(err => done());
    });

    it('parseLinkURI throws when invalid link definition is found', function(done){
        let testLu = `[test](https://botframework.com)`;
        helpers.parseLinkURI(testLu)
            .then(res => {
                done('Test failed: splitFileBySections did not throw!');
            }).catch(err => done());
    });

    it('parseLinkURI throws when invalid link definition is found', function(done){
        let testLu = `[test](./1.lu)`;
        helpers.parseLinkURI(testLu)
            .then(res => {
                done('Test failed: splitFileBySections did not throw!');
            }).catch(err => done());
    });

    it('parseLinkURI throws when invalid link definition is found', function(done){
        let testLu = `[test](./1.lu/*)`;
        helpers.parseLinkURI(testLu)
            .then(res => {
                done('Test failed: splitFileBySections did not throw!');
            }).catch(err => done());
    });

    it('parseLinkURI throws when invalid link definition is found', function(done){
        let testLu = `[test](./1.lu/!)`;
        helpers.parseLinkURI(testLu)
            .then(res => {
                done('Test failed: splitFileBySections did not throw!');
            }).catch(err => done());
    });
});