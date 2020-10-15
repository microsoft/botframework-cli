/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const chai = require('chai');
const assert = chai.assert;
const luisBuild = require('./../../../src/parser/luis/luisBuilder');
const luMerger = require('./../../../src/parser/lu/luMerger');
const luObj = require('../../../src/parser/lu/lu');
const luOptions = require('./../../../src/parser/lu/luOptions')
const nock = require('nock');

describe('luis:convert with URL imports', () => {
    before(function () {
      nock('https://vkstoragetest.blob.core.windows.net')
        .head(/.*/)
        .reply(200, { status: 'OK' })
      
      nock('https://vkstoragetest.blob.core.windows.net')
        .get(/.*/)
        .reply(200, `## None
        - {@add=add {@globalCount={@count={@countNumber=two} apples}}}
        
        @ ml add
            - @ globalCount count
        
        @ ml globalCount
            - @ number countNumber
        
        @ prebuilt number`)
      })
  
    it('luis:convert [LUIS] with import statements to LU URLs is parsed correctly', (done) => {
        let luContent = `[import](https://vkstoragetest.blob.core.windows.net/testlu/Expected.lu)`;
        const expectedOutput = require('./../../fixtures/verified/importUrl.json');
        luisBuild.fromLUAsync([new luObj(luContent)])
            .then(res => {
              assert.deepEqual(res, expectedOutput)
              done();
            })
            .catch(err => done(err))
    })
  })
  
  describe('luis:convert with URL imports', function() {
    before(function () {
      nock('https://vkstoragetest.blob.core.windows.net')
        .head(/.*/)
        .reply(200, { status: 'OK' })
      
      nock('https://vkstoragetest.blob.core.windows.net')
        .get(uri => uri.includes('Expected.lu'))
        .reply(200, `## None
        - {@add=add {@globalCount={@count={@countNumber=two} apples}}}
        
        @ ml add
            - @ globalCount count
        
        @ ml globalCount
            - @ number countNumber
        
        @ prebuilt number`)
      })
    it('luis:convert [LUIS] with import statements to LU URLs is parsed correctly', (done) => {
      let luContent = `
# test
- [import](https://vkstoragetest.blob.core.windows.net/testlu/Expected.lu#None)`;
      const expectedOutput = require('./../../fixtures/verified/referenceUrl.json');
      luisBuild.fromLUAsync([new luObj(luContent)])
          .then(res => {
            assert.deepEqual(res, expectedOutput)
            done();
          })
          .catch(err => done(err))
    })
  })
  
  describe('luis:convert with URL imports', function() {
    before(function () {
      nock('https://vkstoragetest.blob.core.windows.net')
        .head(/.*/)
        .reply(200, { status: 'OK' })

      nock('https://vkstoragetest.blob.core.windows.net')
        .get(uri => uri.includes('Expected.lu'))
        .reply(200, `## None
        - {@add=add {@globalCount={@count={@countNumber=two} apples}}}
        
        @ ml add
            - @ globalCount count
        
        @ ml globalCount
            - @ number countNumber
        
        @ prebuilt number`)
  
        nock('https://vkstoragetest.blob.core.windows.net')
        .get(uri => uri.includes('Actual.lu'))
        .reply(200, `
        ## test
        - one
        
        ## test2
        - two
        - another {entity}
        
        
        @ prebuilt number
        `)
      })
      it('luis:convert [LUIS] with import statements to LU URLs is parsed correctly', (done) => {
        let luContent = `
# test
- [import](https://vkstoragetest.blob.core.windows.net/testlu/Expected.lu#None)
- [import](https://vkstoragetest.blob.core.windows.net/testlu/Actual.lu#*utterancessndpatterns*)`;
        const expectedOutput = require('./../../fixtures/verified/referenceUrlWithWildCard.json');
        luisBuild.fromLUAsync([new luObj(luContent)])
            .then(res => {
              assert.deepEqual(res, expectedOutput)
              done();
            })
            .catch(err => done(err))
      })
  })


