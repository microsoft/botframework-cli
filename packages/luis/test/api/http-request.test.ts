import {expect, test} from '@oclif/test'
import http from './../../src/api/http-request'
const nock = require('nock')


describe('Http Client Get', () => {

    before(async function () {
        // runs before all tests in this block
        nock('https://test.com', {
            reqheaders: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': headerValue => headerValue.includes('242592YT')
            },
        })
        .get('/get/api')
        .reply(200, { Success: 'true'})
      })

    it('http get', async () => {
      const result = await http.get('https://test.com/get/api', '242592YT')
      expect(JSON.stringify(result)).to.contain('Success');
    });
});

describe('Http Client Post', () => {

    before(async function () {
        // runs before all tests in this block
        nock('https://test.com', {
            reqheaders: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': headerValue => headerValue.includes('242592YT'),
              'extra-header': headerValue => headerValue.includes('extra'),
            },
        })
        .post('/post/api', {
            body: 'test'
          })
        .reply(200, { Success: 'true'})
      })

    it('http post extra header', async () => {
      const result = await http.post('https://test.com/post/api', '242592YT', {body: 'test'}, {'extra-header': 'extra'})
      expect(JSON.stringify(result)).to.contain('Success');
    });
});

describe('Http Client Put', () => {

    before(async function () {
        // runs before all tests in this block
        nock('https://test.com', {
            reqheaders: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': headerValue => headerValue.includes('242592YT')
            },
        })
        .put('/put/api', {
            body: 'test'
          })
        .reply(200, { Success: 'true'})
      })

    it('http put', async () => {
      const result = await http.put('https://test.com/put/api', '242592YT', {body: 'test'})
      expect(JSON.stringify(result)).to.contain('Success');
    });
});

describe('Http Client Delete', () => {

    before(async function () {
        // runs before all tests in this block
        nock('https://test.com', {
            reqheaders: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': headerValue => headerValue.includes('242592YT')
            },
        })
        .delete('/delete/api')
        .reply(200, { Success: 'true'})
      })

    it('http put', async () => {
      const result = await http.delete('https://test.com/delete/api', '242592YT')
      expect(JSON.stringify(result)).to.contain('Success');
    });
});
