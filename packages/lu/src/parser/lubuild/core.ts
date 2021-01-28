/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CognitiveServicesCredentials} from '@azure/ms-rest-azure-js'
import {LUISAuthoringClient} from '@azure/cognitiveservices-luis-authoring'
import fetch from 'node-fetch'

const delay = require('delay')
const os = require('os')
const Luis = require('./../luis/luis')
const packageJSON = require('./../../../package')

const rateLimitErrorCode = 429
const absoluteUrlPattern = /^https?:\/\//i

export class LuBuildCore {
  private readonly client: any
  private readonly subscriptionKey: string
  private readonly endpoint: string
  private readonly retryCount: number
  private readonly retryDuration: number
  private readonly headers: any

  constructor(subscriptionKey: string, endpoint: string, retryCount: number, retryDuration: number) {
    this.subscriptionKey = subscriptionKey
    this.endpoint = endpoint
    this.retryCount = retryCount
    this.retryDuration = retryDuration

    // check endpoint is absolute or not
    if (!absoluteUrlPattern.test(endpoint)) {
      throw new Error(`Only absolute URLs are supported. "${endpoint}" is not an absolute LUIS endpoint URL.`)
    }

    // set user agent
    const luisUserAgent = process.env['LUIS_USER_AGENT'] || this.getUserAgent()

    // set headers
    this.headers = {
      'Content-Type': 'application/json',
      'User-Agent': luisUserAgent,
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
    }

    // new luis api client
    const options = {
      userAgent: luisUserAgent
    }

    const creds = new CognitiveServicesCredentials(subscriptionKey)
    this.client = new LUISAuthoringClient(creds, endpoint, options)
  }

  public async getApplicationList() {
    let apps
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.statusCode === rateLimitErrorCode) {
        try {
          apps = await this.client.apps.list(undefined, undefined)
          break
        } catch (e) {
          error = e
          retryCount--
          if (retryCount > 0) await delay(this.retryDuration)
        }
      } else {
        throw error
      }
    }

    if (retryCount === 0) {
      throw error
    }

    return apps
  }

  public async getApplicationInfo(appId: string) {
    let appInfo
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.statusCode === rateLimitErrorCode) {
        try {
          appInfo = await this.client.apps.get(appId)
          break
        } catch (e) {
          error = e
          retryCount--
          if (retryCount > 0) await delay(this.retryDuration)
        }
      } else {
        throw error
      }
    }

    if (retryCount === 0) {
      throw error
    }

    return appInfo
  }

  public async importApplication(currentApp: any): Promise<any> {
    // let response = await this.client.apps.importMethod(currentApp)

    const name = `?appName=${currentApp.name}`
    const url = this.endpoint + '/luis/authoring/v3.0-preview/apps/import' + name

    let messageData
    let retryCount = this.retryCount + 1
    let error: any
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode.toString()) {
        let response = await fetch(url, {method: 'POST', headers: this.headers, body: JSON.stringify(currentApp)})
        messageData = await response.json()

        if (messageData.error === undefined) break

        error = messageData.error
        retryCount--
        if (retryCount > 0) await delay(this.retryDuration)
      } else {
        throw error
      }
    }

    if (retryCount === 0) {
      throw error
    }

    return messageData
  }

  public async exportApplication(appId: string, versionId: string) {
    const url = this.endpoint + '/luis/authoring/v3.0-preview/apps/' + appId + '/versions/' + versionId + '/export?format=json'

    let messageData
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.statusCode === rateLimitErrorCode) {
        try {
          const response = await fetch(url, {method: 'GET', headers: this.headers})
          messageData = await response.json()
          break
        } catch (e) {
          error = e
          retryCount--
          if (retryCount > 0) await delay(this.retryDuration)
        }
      } else {
        throw error
      }
    }

    if (retryCount === 0) {
      throw error
    }

    if (messageData.error) {
      throw new Error(messageData.error.message)
    }

    return messageData
  }

  public compareApplications(currentApp: any, existingApp: any) {
    currentApp.desc = currentApp.desc && currentApp.desc !== '' && currentApp.desc !== existingApp.desc ? currentApp.desc : existingApp.desc
    currentApp.culture = currentApp.culture && currentApp.culture !== '' && currentApp.culture !== existingApp.culture ? currentApp.culture : existingApp.culture
    currentApp.versionId = currentApp.versionId && currentApp.versionId !== '' && currentApp.versionId > existingApp.versionId ? currentApp.versionId : existingApp.versionId
    currentApp.name = existingApp.name

    let currentAppToCompare = JSON.parse(JSON.stringify(currentApp));

    // convert list entities to remove synonyms word in list which is same with canonicalForm
    (currentAppToCompare.closedLists || []).forEach((c: any) => {
      (c.subLists || []).forEach((s: any) => {
        if (s.list) {
          const foundIndex = s.list.indexOf(s.canonicalForm)
          if (foundIndex > -1) {
            s.list.splice(foundIndex, 1)
          }
        }
      })
    })

    // skip comparisons of properties that LUIS API automatically added or updated
    currentAppToCompare.luis_schema_version = existingApp.luis_schema_version
    currentAppToCompare.tokenizerVersion = existingApp.tokenizerVersion
    currentAppToCompare.settings = existingApp.settings

    // skip none intent comparison if that is automatically added by LUIS server
    if (currentAppToCompare.intents && !currentAppToCompare.intents.some((x: any) => x.name === 'None')) {
      const existingNoneIntentIndex = existingApp.intents.findIndex((x: any) => x.name === 'None')
      if (existingNoneIntentIndex > -1) existingApp.intents.splice(existingNoneIntentIndex, 1)
    }

    // compare lu contents converted from luis josn
    const isApplicationEqual = this.isApplicationEqual(currentAppToCompare, existingApp)

    return !isApplicationEqual
  }

  public updateVersion(currentApp: any, existingApp: any) {
    let newVersionId: string
    if (currentApp.versionId > existingApp.versionId) {
      newVersionId = currentApp.versionId
    } else {
      newVersionId = this.updateVersionValue(existingApp.versionId)
    }

    currentApp.versionId = newVersionId

    return newVersionId
  }

  public async importNewVersion(appId: string, app: any, options: any) {
    // await this.client.versions.importMethod(appId, app, options)

    const versionId = `?versionId=${options.versionId}`
    let url = this.endpoint + '/luis/authoring/v3.0-preview/apps/' + appId + '/versions/import' + versionId

    let messageData
    let retryCount = this.retryCount + 1
    let error: any
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode.toString()) {
        let response = await fetch(url, {method: 'POST', headers: this.headers, body: JSON.stringify(app)})
        messageData = await response.json()

        if (messageData.error === undefined) break

        error = messageData.error
        retryCount--
        if (retryCount > 0) await delay(this.retryDuration)
      } else {
        throw error
      }
    }

    if (retryCount === 0) {
      throw error
    }

    return messageData
  }

  public async listApplicationVersions(appId: string) {
    let appVersions
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.statusCode === rateLimitErrorCode) {
        try {
          appVersions = await this.client.versions.list(appId)
          break
        } catch (e) {
          error = e
          retryCount--
          if (retryCount > 0) await delay(this.retryDuration)
        }
      } else {
        throw error
      }
    }

    if (retryCount === 0) {
      throw error
    }

    return appVersions
  }

  public async deleteVersion(appId: string, versionId: string) {
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.statusCode === rateLimitErrorCode) {
        try {
          await this.client.versions.deleteMethod(appId, versionId)
          break
        } catch (e) {
          error = e
          retryCount--
          if (retryCount > 0) await delay(this.retryDuration)
        }
      } else {
        throw error
      }
    }

    if (retryCount === 0) {
      throw error
    }
  }

  public async trainApplication(appId: string, versionId: string) {
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.statusCode === rateLimitErrorCode) {
        try {
          await this.client.train.trainVersion(appId, versionId)
          break
        } catch (e) {
          error = e
          retryCount--
          if (retryCount > 0) await delay(this.retryDuration)
        }
      } else {
        throw error
      }
    }

    if (retryCount === 0) {
      throw error
    }
  }

  public async getTrainingStatus(appId: string, versionId: string) {
    let status
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.statusCode === rateLimitErrorCode) {
        try {
          status = await this.client.train.getStatus(appId, versionId)
          break
        } catch (e) {
          error = e
          retryCount--
          if (retryCount > 0) await delay(this.retryDuration)
        }
      } else {
        throw error
      }
    }

    if (retryCount === 0) {
      throw error
    }

    return status
  }

  public async publishApplication(appId: string, versionId: string, isStaging: boolean, directVersionPublish: boolean) {
    let url = this.endpoint + '/luis/authoring/v3.0-preview/apps/' + appId + '/publish'

    let messageData
    let retryCount = this.retryCount + 1
    let error: any
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode.toString()) {
        let response = await fetch(url, {method: 'POST', headers: this.headers, body: JSON.stringify({
          versionId,
          isStaging,
          directVersionPublish
        })})
        messageData = await response.json()

        if (messageData.error === undefined) break

        error = messageData.error
        retryCount--
        if (retryCount > 0) await delay(this.retryDuration)
      } else {
        throw error
      }
    }

    if (retryCount === 0) {
      throw error
    }

    return messageData
  }

  private updateVersionValue(versionId: string) {
    let numberVersionId = parseFloat(versionId)
    if (isNaN(numberVersionId)) {
      const index = versionId.lastIndexOf('-')
      if (index > 0) {
        const strVersion = versionId.substring(0, index)
        const numberVersion = versionId.substring(index + 1)
        numberVersionId = parseFloat(numberVersion)
        if (isNaN(numberVersionId)) {
          return versionId
        } else {
          const newVersionId = numberVersionId + 0.1

          return strVersion + '-' + newVersionId.toFixed(1)
        }
      } else {
        return versionId + '-0.1'
      }
    } else {
      return (numberVersionId + 0.1).toFixed(1)
    }
  }

  private isApplicationEqual(appA: any, appB: any) {
    let appALuis = new Luis(appA)
    this.sortLuis(appALuis)
    let appALu = appALuis.parseToLuContent().toLowerCase()

    let appBLuis = new Luis(appB)
    this.sortLuis(appBLuis)
    let appBLu = appBLuis.parseToLuContent().toLowerCase()

    return appALu === appBLu
  }

  private sortLuis(app: any) {
    this.sortProperty(app.intents, 'name')
    this.sortProperty(app.closedLists, 'name')
    this.sortProperty(app.composites, 'name')
    this.sortProperty(app.entities, 'name')
    this.sortProperty(app.model_features, 'name')
    this.sortProperty(app.phraselists, 'name')
    this.sortProperty(app.patternAnyEntities, 'name')
    this.sortProperty(app.patterns, 'pattern')
    this.sortProperty(app.prebuiltEntities, 'name')
    this.sortProperty(app.regex_entities, 'name')
    this.sortProperty(app.regexEntities, 'name')
    this.sortProperty(app.utterances, 'text')
  }

  private sortProperty(arrayToSort: any[], propertyToSort: string) {
    (arrayToSort || []).sort((a: any, b: any) => {
      const aValue = a[propertyToSort].toLowerCase()
      const bValue = b[propertyToSort].toLowerCase()

      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    })
  }

  private getUserAgent() {
    const packageUserAgent = `${packageJSON.name}/${packageJSON.version}`
    const platformUserAgent = `(${os.arch()}-${os.type()}-${os.release()}; Node.js,Version=${process.version})`
    const userAgent = `${packageUserAgent} ${platformUserAgent}`

    return userAgent
  }
}
