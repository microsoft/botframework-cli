/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import httpRequest from './http-request'

const delay = require('delay')
const os = require('os')
const Luis = require('./../luis/luis')
const packageJSON = require('./../../../package')

const rateLimitErrorCode = '429'
const absoluteUrlPattern = /^https?:\/\//i

export class LuBuildCore {
  private readonly subscriptionKey: string
  private readonly endpoint: string
  private readonly retryCount: number
  private readonly retryDuration: number
  private readonly headers: any
  private readonly trainMode: string | undefined

  constructor(subscriptionKey: string, endpoint: string, retryCount: number, retryDuration: number) {
    this.subscriptionKey = subscriptionKey
    this.endpoint = `${endpoint}/luis/authoring/v3.0-preview`
    this.retryCount = retryCount
    this.retryDuration = retryDuration

    // check endpoint is absolute or not
    if (!absoluteUrlPattern.test(endpoint)) {
      throw new Error(`Only absolute URLs are supported. "${endpoint}" is not an absolute LUIS endpoint URL.`)
    }

    // set user agent
    const luisUserAgent = process.env['LUIS_USER_AGENT'] || this.getUserAgent()

    // set luis train mode
    this.trainMode = process.env['LUIS_TRAIN_MODE']

    // set headers
    this.headers = {
      'Content-Type': 'application/json',
      'User-Agent': luisUserAgent,
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
    }
  }

  public async getApplicationList() {
    const url = `${this.endpoint}/apps`

    let apps
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode) {
        
        apps = await httpRequest.get(url, this.headers)

        if (apps.error === undefined) break

        error = apps.error
        retryCount--
        if (retryCount > 0) await delay(this.retryDuration)
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
    const url = `${this.endpoint}/apps/${appId}`

    let appInfo
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode) {
        appInfo = await httpRequest.get(url, this.headers)

        if (appInfo.error === undefined) break

        error = appInfo.error
        retryCount--
        if (retryCount > 0) await delay(this.retryDuration)
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
    const name = `?appName=${currentApp.name}`
    const url = `${this.endpoint}/apps/import${name}`

    let messageData
    let retryCount = this.retryCount + 1
    let error: any
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode) {
        messageData = await httpRequest.post(url, JSON.stringify(currentApp), this.headers)

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
    const url = `${this.endpoint}/apps/${appId}/versions/${versionId}/export?format=json`

    let messageData
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode) {
        messageData = await httpRequest.get(url, this.headers)

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
    const versionId = `?versionId=${options.versionId}`
    let url = `${this.endpoint}/apps/${appId}/versions/import${versionId}`

    let messageData
    let retryCount = this.retryCount + 1
    let error: any
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode) {
        messageData = await httpRequest.post(url, JSON.stringify(app), this.headers)
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
    let url = `${this.endpoint}/apps/${appId}/versions`

    let appVersions
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode) {
        appVersions = await httpRequest.get(url, this.headers)
        if (appVersions.error === undefined) break

        error = appVersions.error
        retryCount--
        if (retryCount > 0) await delay(this.retryDuration)
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
    let url = `${this.endpoint}/apps/${appId}/versions/${versionId}`

    let messageData
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode) {
        messageData = await httpRequest.delete(url, this.headers)
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

  public async trainApplication(appId: string, versionId: string, trainMode: string) {
    let mode = trainMode || this.trainMode
    let url = `${this.endpoint}/apps/${appId}/versions/${versionId}/train`
    url += mode ? `?mode=${mode}` : ''

    let messageData
    let retryCount = this.retryCount + 1
    let error: any
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode) {
        messageData = await httpRequest.post(url, '', this.headers)

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

  public async getTrainingStatus(appId: string, versionId: string) {
    let url = `${this.endpoint}/apps/${appId}/versions/${versionId}/train`

    let status
    let retryCount = this.retryCount + 1
    let error
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode) {
        status = await httpRequest.get(url, this.headers)
        if (status.error === undefined) break

        error = status.error
        retryCount--
        if (retryCount > 0) await delay(this.retryDuration)
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
    let url = `${this.endpoint}/apps/${appId}/publish`

    let messageData
    let retryCount = this.retryCount + 1
    let error: any
    while (retryCount > 0) {
      if (error === undefined || error.code === rateLimitErrorCode) {
        messageData = await httpRequest.post(
          url,
          JSON.stringify({
            versionId,
            isStaging,
            directVersionPublish
          }),
          this.headers)

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
