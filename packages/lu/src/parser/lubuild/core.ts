/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Recognizer} from './recognizer'
import {MultiLanguageRecognizer} from './multi-language-recognizer'
import {Settings} from './settings'
import {CognitiveServicesCredentials} from '@azure/ms-rest-azure-js'
import {LUISAuthoringClient} from '@azure/cognitiveservices-luis-authoring'
import * as path from 'path'
import fetch from 'node-fetch'
const retCode = require('./../utils/enums/CLI-errors')
const exception = require('./../utils/exception')
const Content = require('./../lu/lu')
const LUOptions = require('./../lu/luOptions')
const Luis = require('./../luis/luis')

export class LuBuildCore {
  private readonly client: any
  private readonly subscriptionKey: string
  private readonly endpoint: string

  constructor(subscriptionKey: string, endpoint: string) {
    this.subscriptionKey = subscriptionKey
    this.endpoint = endpoint

    // new luis api client
    const creds = new CognitiveServicesCredentials(subscriptionKey)
    this.client = new LUISAuthoringClient(creds, endpoint)
  }

  public async getApplicationList() {
    let apps = await this.client.apps.list(undefined, undefined)

    return apps
  }

  public async getApplicationInfo(appId: string) {
    let appInfo = await this.client.apps.get(appId)

    return appInfo
  }

  public async importApplication(currentApp: any): Promise<any> {
    // let response = await this.client.apps.importMethod(currentApp)

    const name = `?appName=${currentApp.name}`
    const url = this.endpoint + '/luis/authoring/v3.0-preview/apps/import' + name
    const headers = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': this.subscriptionKey
    }

    const response = await fetch(url, {method: 'POST', headers, body: JSON.stringify(currentApp)})
    const messageData = await response.json()

    if (messageData.error) {
      throw (new exception(retCode.errorCode.LUIS_API_CALL_FAILED, messageData.error.message))
    }

    return messageData
  }

  public async exportApplication(appId: string, versionId: string) {
    const response = await this.client.versions.exportMethod(appId, versionId)

    return response
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

    // skip comparison of properties that LUIS API automatically added or updated
    currentAppToCompare.luis_schema_version = existingApp.luis_schema_version
    currentAppToCompare.tokenizerVersion = existingApp.tokenizerVersion
    currentAppToCompare.settings = existingApp.settings

    // align the properties between local Luis json schema and remote one
    existingApp.model_features = existingApp.phraselists
    delete existingApp.phraselists

    existingApp.regex_features = existingApp.regexFeatures
    delete existingApp.regexFeatures

    existingApp.regex_entities = existingApp.regexEntities
    delete existingApp.regexEntities

    // skip none intent comparison if that is automatically added by LUIS server
    if (currentAppToCompare.intents && !currentAppToCompare.intents.some((x: any) => x.name === 'None')) {
      const existingNoneIntentIndex = existingApp.intents.findIndex((x: any) => x.name === 'None')
      if (existingNoneIntentIndex > -1) existingApp.intents.splice(existingNoneIntentIndex, 1)
    }

    // sort properties so that they can be converted to exact same lu content when comparing
    this.sortApplication(currentAppToCompare)
    this.sortApplication(existingApp)

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
    const headers = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': this.subscriptionKey
    }

    const response = await fetch(url, {method: 'POST', headers, body: JSON.stringify(app)})
    const messageData = await response.json()

    if (messageData.error) {
      throw (new exception(retCode.errorCode.LUIS_API_CALL_FAILED, messageData.error.message))
    }

    return messageData
  }

  public async listApplicationVersions(appId: string) {
    return this.client.versions.list(appId)
  }

  public async deleteVersion(appId: string, versionId: string) {
    await this.client.versions.deleteMethod(appId, versionId)
  }

  public async trainApplication(appId: string, versionId: string) {
    await this.client.train.trainVersion(appId, versionId)
  }

  public async getTrainingStatus(appId: string, versionId: string) {
    const status = this.client.train.getStatus(appId, versionId)

    return status
  }

  public async publishApplication(appId: string, versionId: string) {
    this.client.apps.publish(appId,
      {
        versionId,
        isStaging: false
      })
  }

  public generateDeclarativeAssets(recognizers: Array<Recognizer>, multiRecognizers: Array<MultiLanguageRecognizer>, settings: Array<Settings>)
    : Array<any> {
    let contents = new Array<any>()
    for (const recognizer of recognizers) {
      let content = new Content(recognizer.save(), new LUOptions(path.basename(recognizer.getDialogPath()), true, '', recognizer.getDialogPath()))
      contents.push(content)
    }

    for (const multiRecognizer of multiRecognizers) {
      const multiLangContent = new Content(multiRecognizer.save(), new LUOptions(path.basename(multiRecognizer.getDialogPath()), true, '', multiRecognizer.getDialogPath()))
      contents.push(multiLangContent)
    }

    for (const setting of settings) {
      const settingsContent = new Content(setting.save(), new LUOptions(path.basename(setting.getSettingsPath()), true, '', setting.getSettingsPath()))
      contents.push(settingsContent)
    }

    return contents
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
    let appALu = (new Luis(appA)).parseToLuContent().toLowerCase()
    let appBLu = (new Luis(appB)).parseToLuContent().toLowerCase()

    return appALu === appBLu
  }

  private sortApplication(app: any) {
    this.sortProperty(app.intents, 'name')
    this.sortProperty(app.closedLists, 'name')
    this.sortProperty(app.composites, 'name')
    this.sortProperty(app.entities, 'name')
    this.sortProperty(app.model_features, 'name')
    this.sortProperty(app.patternAnyEntities, 'name')
    this.sortProperty(app.patterns, 'pattern')
    this.sortProperty(app.prebuiltEntities, 'name')
    this.sortProperty(app.regex_entities, 'name')
    this.sortProperty(app.regex_features, 'name')
    this.sortProperty(app.utterances, 'text')
  }

  private sortProperty(arrayToSort: any[], propertyToSort: string) {
    (arrayToSort || []).sort((a: any, b: any) => {
      const aValue = a[propertyToSort].toLowerCase()
      const bValue = b[propertyToSort].toLowerCase()

      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    })
  }
}
