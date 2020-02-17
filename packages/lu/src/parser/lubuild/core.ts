/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Recognizer} from './recognizer'
import {MultiLanguageRecognizer} from './multi-language-recognizer'
import {Settings} from './settings'
import {isEqual, differenceWith} from 'lodash'
import {CognitiveServicesCredentials} from '@azure/ms-rest-azure-js'
import {LUISAuthoringClient} from '@azure/cognitiveservices-luis-authoring'
import * as path from 'path'
const Content = require('./../lu/lu')

export class LuBuildCore {
  private readonly client: any

  constructor(authoringKey: string, endpoint: string) {
    // new luis api client
    const creds = new CognitiveServicesCredentials(authoringKey)
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
    let response = await this.client.apps.importMethod(currentApp)

    return response
  }

  public async exportApplication(appId: string, versionId: string) {
    const response = await this.client.versions.exportMethod(appId, versionId)

    return response
  }

  public compareApplications(currentApp: any, existingApp: any) {
    currentApp.desc = currentApp.desc && currentApp.desc !== '' && currentApp.desc !== existingApp.desc ? currentApp.desc : existingApp.desc
    currentApp.culture = currentApp.culture && currentApp.culture !== '' && currentApp.culture !== existingApp.culture ? currentApp.culture : existingApp.culture
    currentApp.versionId = currentApp.versionId && currentApp.versionId !== '' && currentApp.versionId > existingApp.versionId ? currentApp.versionId : existingApp.versionId;

    // convert list entities to remove synonyms word in list which is same with canonicalForm
    (currentApp.closedLists || []).forEach((c: any) => {
      (c.subLists || []).forEach((s: any) => {
        if (s.list) {
          const foundIndex = s.list.indexOf(s.canonicalForm)
          if (foundIndex > -1) {
            s.list.splice(foundIndex, 1)
          }
        }
      })
    });

    (currentApp.entities || []).forEach((e: any) => {
      if (e.children === undefined && existingApp.entities) {
        let matchedEntities = existingApp.entities.filter((x: any) => x.name === e.name)
        if (matchedEntities && matchedEntities.length > 0 && matchedEntities[0].children !== undefined) {
          e.children = []
        }
      }
    })

    currentApp.name = existingApp.name

    return !this.isApplicationEqual(currentApp, existingApp)
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
    await this.client.versions.importMethod(appId, app, options)
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
      let content = new Content(recognizer.save(), path.basename(recognizer.getDialogPath()), true, '', recognizer.getDialogPath())
      contents.push(content)
    }

    for (const multiRecognizer of multiRecognizers) {
      const multiLangContent = new Content(multiRecognizer.save(), path.basename(multiRecognizer.getDialogPath()), true, '', multiRecognizer.getDialogPath())
      contents.push(multiLangContent)
    }

    for (const setting of settings) {
      const settingsContent = new Content(setting.save(), path.basename(setting.getSettingsPath()), true, '', setting.getSettingsPath())
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

  private isApplicationEqual(appA: any, appB: any): boolean {
    let equal = true
    equal = equal && isEqual(appA.desc, appB.desc)
    equal = equal && isEqual(appA.versionId, appB.versionId)
    equal = equal && isEqual(appA.culture, appB.culture)
    equal = equal && this.isArrayEqual(appA.closedLists, appB.closedLists)
    equal = equal && this.isArrayEqual(appA.composites, appB.composites)
    equal = equal && this.isArrayEqual(appA.entities, appB.entities)
    equal = equal && this.isArrayEqual(appA.model_features, appB.modelFeatures)
    equal = equal && this.isArrayEqual(appA.patternAnyEntities, appB.patternAnyEntities)
    equal = equal && this.isArrayEqual(appA.patterns, appB.patterns)
    equal = equal && this.isArrayEqual(appA.prebuiltEntities, appB.prebuiltEntities)
    equal = equal && this.isArrayEqual(appA.regex_entities, appB.regexEntities)
    equal = equal && this.isArrayEqual(appA.regex_features, appB.regexFeatures)
    equal = equal && this.isArrayEqual(appA.utterances, appB.utterances)

    // handle exception for none intent which is default added in luis portal
    if (equal) {
      if (appA.intents && !appA.intents.some((x: any) => x.name === 'None')) {
        const appBWithoutNoneIntent = (appB.intents).filter((x: any) => x.name !== 'None')
        equal = equal && this.isArrayEqual(appA.intents, appBWithoutNoneIntent)
      } else {
        equal = equal && this.isArrayEqual(appA.intents, appB.intents)
      }
    }

    return equal
  }

  // compare object arrays
  private isArrayEqual(x: any, y: any) {
    let xObj = []
    let yObj = []

    if (x && x.length > 0) {
      xObj = JSON.parse(JSON.stringify(x))
    }

    if (y && y.length > 0) {
      yObj = JSON.parse(JSON.stringify(y))
    }

    if (xObj.length !== yObj.length) return false
    
    if (differenceWith(xObj, yObj, isEqual).length > 0) return false

    return true
  }
}
