import 'mocha'
import { expect } from 'chai'
import * as util from 'util'
const exec = util.promisify(require('child_process').exec)

describe('functional tests for luis cli commands', () => {
  let appId = ''
  let importedAppId = ''
  let queryComplete = false
  const endpoint = process.env.ENDPOINT || 'https://westus.api.cognitive.microsoft.com'
  const subscriptionKey = process.env.SUBSCRIPTION_KEY || ''

  if (!subscriptionKey) return console.log('Subscription key missing for LUIS CLI functional tests')

  const checkPublishStatus = async (id: string) => {
    return await exec(`bf luis:application:show --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${id}`)
  }
    
  before(async () => {
    // create a test app
    const { stdout, stderr } = await exec(`bf luis:application:create --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --name test_app --versionId 0.1`)
    if (stderr) return console.log(stderr)
    const uuidRegex = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/;
    appId = stdout.match(uuidRegex)[0]
    console.log(`Functional test app created: ${stdout}`)
  })

  after(async () => {
    // delete test apps
    const checkStatus = async () => {
      const statusPromise = checkPublishStatus(importedAppId)
      statusPromise.then(async (pValue) => {
        const { stdout, stderr } = pValue
        if (stderr) return console.log(stderr)
        const endIndex = stdout.search("Application data successfully output to console")
        const resp = JSON.parse(endIndex ? stdout.substr(0, endIndex) : stdout)
        let publishInProgress = Object.keys(resp.endpoints).length === 0 && resp.endpoints.constructor === Object
        if (!publishInProgress && queryComplete) {
          await deleteApps()
        } else {
          setTimeout(() => {
            checkStatus()
          }, 3000)
        }
      })
    }

    const deleteApps = async () => {
      try {
        await Promise.all([
          exec(`bf luis:application:delete --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${importedAppId}`), 
          exec(`bf luis:application:delete --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${appId}`)
        ])
        console.log('Test apps deleted')
      } catch(error) {
        console.log(`Error deleting apps: ${error}`)
      }
    }

    checkStatus()
  })

  describe('luis:application:rename', () => {
    it('rename a luis app', async () => {
      const { stdout, stderr } = await exec(`bf luis:application:rename --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${appId} --name functional_test_app`)
      if (stderr) return console.log(stderr)
      expect(stdout).to.include('App successfully renamed')
    })
  })

  describe('luis:application:show', () => {
    it('retrieve the details of the test app', async () => {
      const { stdout, stderr } = await exec(`bf luis:application:show --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${appId}`)
      if (stderr) return console.log(stderr)
      const endIndex = stdout.search("Application data successfully output to console")
      const response = JSON.parse(endIndex ? stdout.substr(0, endIndex) : stdout)
      expect(response.id).to.equal(appId)
    })
  })

  describe('luis:application:import', () => {
    it('import a luis app from a json file', async () => {
      const { stdout, stderr } = await exec(`bf luis:application:import --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --in ./test/fixtures/sample-app.json`)
      if (stderr) return console.log(stderr)
      expect(stdout).to.include('App successfully imported with id')
      const respArry = stdout.split(' ')
      let idStr = respArry[respArry.length - 1].split('.')[0]
      importedAppId = idStr
    })
  })

  describe('luis:application:list', () => {
    it('retrieve a list of all LUIS apps', async () => {
      const { stdout, stderr } = await exec(`bf luis:application:list --endpoint ${endpoint} --subscriptionKey ${subscriptionKey}`)
      if (stderr) return console.log(stderr)
      expect(stdout).to.include("List successfully output to console")
    })
  })

  describe('luis:version:clone', () => {
    it('clone a luis app version', async () => {
      const { stdout, stderr } = await exec(`bf luis:version:clone --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${appId} --versionId 0.1 --targetVersionId 0.2`)
      if (stderr) return console.log(stderr)
      expect(stdout).to.include('App successfully cloned. Latest version is now: 0.2')
    })
  })

  describe('luis:version:rename', () => {
    it('rename a luis app version', async () => {
      const { stdout, stderr } = await exec(`bf luis:version:rename --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${appId} --versionId 0.2 --newVersionId 0.3`)
      if (stderr) return console.log(stderr)
      expect(stdout).to.include('App version successfully renamed')
    })
  })

  describe('luis:version:export', () => {
    it('export a luis app version', async () => {
      const { stdout, stderr } = await exec(`bf luis:version:export --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${appId} --versionId 0.3`)
      if (stderr) return console.log(stderr)
      expect(stdout).to.include('"versionId": "0.3",')
    })
  })

  describe('luis:version:import', () => {
    it('import a luis app version', async () => {
      const { stdout, stderr } = await exec(`bf luis:version:import --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${appId} --versionId 0.5 --in ./test/fixtures/sample-app-version.json`)
      if (stderr) return console.log(stderr)
      expect(stdout).to.include('App version successfully imported as version 0.5')
    })
  })

  describe('luis:version:list', () => {
    it('list luis app versions', async () => {
      const { stdout, stderr } = await exec(`bf luis:version:list --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${appId}`)
      if (stderr) return console.log(stderr)
      expect(stdout).to.include('\nList successfully output to console')
    })
  })

  describe('luis:version:delete', () => {
    it('delete a luis app version', async () => {
      const { stdout, stderr } = await exec(`bf luis:version:delete --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${appId} --versionId 0.5`)
      if (stderr) return console.log(stderr)
      expect(stdout).to.include('Successfully deleted version')
    })
  })

  describe('luis:train:run', () => {
    it('train a LUIS application', async () => {
      const { stdout, stderr } = await exec(`bf luis:train:run --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${importedAppId} --versionId 0.1`)
      if (stderr) return console.log(stderr)
      expect(stdout).to.include('\nTraining request successfully issued')
    })
  })

  describe('luis:train:show', () => {
    it('train a LUIS application', async () => {
      const { stdout, stderr } = await exec(`bf luis:train:show --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${importedAppId} --versionId 0.1`)
      if (stderr) return console.log(stderr)
      expect(stdout).to.include('status')
    })
  })

  describe('luis:application:publish', () => {
    it('publish a LUIS application', async () => {
      const publishApp = async () => {
        const { stdout, stderr } = await exec(`bf luis:application:publish --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${importedAppId} --versionId 0.1`)
        if (stderr) return console.log(stderr)
        expect(stdout).to.include('endpointUrl')
        expect(stdout).to.include('region')
        expect(stdout).to.include('publishedDateTime')
        expect(stdout).to.include('isStaging')
      }

      const checkTrainingStatus = async () => {
        const { stdout, stderr } = await exec(`bf luis:train:show --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${importedAppId} --versionId 0.1`)
        if (stderr) return console.log(stderr)
        const respJSON = JSON.parse(stdout.replace('Training status successfully output to console',''))
        if (respJSON[0].details.status === 'InProgress') {
          setTimeout(() => {
            checkTrainingStatus()
          }, 3000)
        } else {
          publishApp()
        }
      }

      checkTrainingStatus()
    })
  })

  describe('luis:application:query', () => {
    it('query a LUIS application', async () => {
      const queryApp = async () => {
        const { stdout, stderr } = await exec(`bf luis:application:query --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${importedAppId} --query "book a flight"`)
        if (stderr) return console.log(stderr)
        expect(stdout).to.include('topIntent')
        expect(stdout).to.include('BookFlight')
        queryComplete = true
      }

      const checkStatus = async () => {
        const statusPromise = checkPublishStatus(importedAppId)
        statusPromise.then(async (pValue) => {
          const { stdout, stderr } = pValue
          if (stderr) return console.log(stderr)
          const endIndex = stdout.search("Application data successfully output to console")
          const resp = JSON.parse(endIndex ? stdout.substr(0, endIndex) : stdout)
          let publishInProgress = Object.keys(resp.endpoints).length === 0 && resp.endpoints.constructor === Object
          if(publishInProgress) {
            setTimeout(() => {
              checkStatus()
            }, 3000)
          } else {
            await queryApp()
          }
        })
      }

      checkStatus()
    })
  })

  describe('luis:endpoints:list', () => {
    it('lists an app\'s published endpoints', async () => {
      const { stdout, stderr } = await exec(`bf luis:endpoints:list --endpoint ${endpoint} --subscriptionKey ${subscriptionKey} --appId ${importedAppId}`)
      if (stderr) return console.log(stderr)
      expect(stdout).to.include('https://westus.api.cognitive.microsoft.com')
    })
  })

})
