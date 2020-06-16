const assert = require('chai').assert
const nock = require('nock')
const Builder = require('../../../src/parser/lubuild/builder').Builder

describe('builder: getActiveVersionIds function return version id sucessfully', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'app1',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
      }, {
        name: 'app2',
        id: 'f8c64e2a-2222-3a09-8f78-39d7adc76ec5'
      }
      ])

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'app1',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
        activeVersion: 0.1
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'app2',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
        activeVersion: 0.2
      })
  })

  it('should get active version ids successfully', async () => {
    const builder = new Builder()
    const appNameVersioIdMap = await builder.getActiveVersionIds(['app1', 'app2'], 'f8c64e2a-3333-3a09-8f78-39d7adc76ec5', 'westus')
    assert.equal(appNameVersioIdMap.get('app1'), '0.1')
    assert.equal(appNameVersioIdMap.get('app2'), '0.2')
  })
})

describe('builder: getActiveVersionIds function return version id sucessfully with retry for rate limit issue', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'app1',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
      }, {
        name: 'app2',
        id: 'f8c64e2a-2222-3a09-8f78-39d7adc76ec5'
      }
      ])

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'app1',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
        activeVersion: 0.1
      })
    
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(429, {
        error: {
          message: 'Rate limit is exceeded'
        }
      })
    
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(429, {
        error: {
          message: 'Rate limit is exceeded'
        }
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(429, {
        error: {
          message: 'Rate limit is exceeded'
        }
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'app2',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
        activeVersion: 0.2
      })
  })

  it('should get active version ids successfully with retry', async () => {
    const builder = new Builder()
    const appNameVersioIdMap = await builder.getActiveVersionIds(['app1', 'app2'], 'f8c64e2a-3333-3a09-8f78-39d7adc76ec5', 'westus', 3, 1000)
    assert.equal(appNameVersioIdMap.get('app1'), '0.1')
    assert.equal(appNameVersioIdMap.get('app2'), '0.2')
  })
})

describe('builder: getActiveVersionIds function return version id failed with maximum retry count for rate limit issue', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'app1',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
      }, {
        name: 'app2',
        id: 'f8c64e2a-2222-3a09-8f78-39d7adc76ec5'
      }
      ])

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'app1',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
        activeVersion: 0.1
      })
    
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(429, {
        error: {
          message: 'Rate limit is exceeded'
        }
      })
    
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(429, {
        error: {
          message: 'Rate limit is exceeded'
        }
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(429, {
        error: {
          message: 'Rate limit is exceeded'
        }
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(429, {
        error: {
          message: 'Rate limit is exceeded'
        }
      })
  })

  it('should get active version ids failed', async () => {
    const builder = new Builder()
    try {
      await builder.getActiveVersionIds(['app1', 'app2'], 'f8c64e2a-3333-3a09-8f78-39d7adc76ec5', 'westus', 3, 1000)
      assert.fail()
    } catch (e) {
      assert.equal(e.message, 'Rate limit is exceeded')
    }
  })
})

describe('builder: getActiveVersionIds function return version id failed for non rate limit issue', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'app1',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
      }, {
        name: 'app2',
        id: 'f8c64e2a-2222-3a09-8f78-39d7adc76ec5'
      }
      ])

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'app1',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
        activeVersion: 0.1
      })
    
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(429, {
        error: {
          message: 'Rate limit is exceeded'
        }
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(401, {
        error: {
          message: 'You do not have access'
        }
      })
  })

  it('should get active version ids failed for non rate limit issue', async () => {
    const builder = new Builder()
    try {
      await builder.getActiveVersionIds(['app1', 'app2'], 'f8c64e2a-3333-3a09-8f78-39d7adc76ec5', 'westus', 3, 1000)
      assert.fail()
    } catch (e) {
      assert.equal(e.message, 'You do not have access')
    }
  })
})