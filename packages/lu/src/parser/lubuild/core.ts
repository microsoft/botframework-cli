/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Content} from './content'
import {parser} from '../index'
import {Recognizer} from './recognizer'
import {MultiLanguageRecognizer} from './multi-language-recognizer'
import {Settings} from './settings'
import {isEqual, differenceWith} from 'lodash'
import * as path from 'path'
const luisUtils = require('@microsoft/bf-luis-cli/lib/utils/index')

export class LuBuildCore {
  public InitLuisClient(authoringKey: string, endpoint: string): any {
    // new luis api client
    const client = luisUtils.getLUISClient(authoringKey, endpoint)

    return client
  }

  public async GetApplicationList(client: any) {
    let apps = await client.apps.list(undefined, undefined)

    return apps
  }

  public async ParseLuContent(content: string, locale: string): Promise<any> {
    const response = await parser.parseFile(content, false, locale)
    parser.validateLUISBlob(response.LUISJsonStructure)
    let parsedLUISObj = response.LUISJsonStructure

    return parsedLUISObj
  }

  public async ImportApplication(client: any, currentApp: any): Promise<any> {
    let response = await client.apps.importMethod(currentApp)

    return response
  }

  public async ExportApplication(client: any, appId: string, versionId: string) {
    const response = await client.versions.exportMethod(appId, versionId)

    return response
  }

  public CompareApplications(currentApp: any, existingApp: any) {
    currentApp.desc = currentApp.desc && currentApp.desc !== '' && currentApp.desc !== existingApp.desc ? currentApp.desc : existingApp.desc
    currentApp.culture = currentApp.culture && currentApp.culture !== '' && currentApp.culture !== existingApp.culture ? currentApp.culture : existingApp.culture
    currentApp.versionId = currentApp.versionId && currentApp.versionId !== '' && currentApp.versionId !== existingApp.versionId ? currentApp.versionId : existingApp.versionId;

    // convert utterance text from lu file to lower case
    // as utterances from luis api are all converted to lower case automatically
    (currentApp.utterances || []).forEach((u: any) => {
      u.text = u.text.toLowerCase()
    });

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
      if (e.children === undefined) {
        e.children = []
      }
    })

    currentApp.name = existingApp.name

    if (!this.isApplicationEqual(currentApp, existingApp)) {
      return true
    } else {
      return false
    }
  }

  public UpdateVersion(currentApp: any, existingApp: any) {
    let newVersionId: string
    if (currentApp.versionId && currentApp.versionId !== existingApp.versionId) {
      newVersionId = currentApp.versionId
    } else {
      newVersionId = this.updateVersion(existingApp.versionId)
    }

    currentApp.versionId = newVersionId

    return newVersionId
  }

  public async ImportNewVersion(client: any, appId: string, app: any, options: any) {
    await client.versions.importMethod(appId, app, options)
  }

  public async TrainApplication(client: any, appId: string, versionId: string) {
    await client.train.trainVersion(appId, versionId)
  }

  public async GetTrainingStatus(client: any, appId: string, versionId: string) {
    const status = client.train.getStatus(appId, versionId)

    return status
  }

  public async PublishApplication(client: any, appId: string, versionId: string) {
    client.apps.publish(appId,
      {
        versionId,
        isStaging: false
      })
  }

  public GenerateDeclarativeAssets(recognizers: Array<Recognizer>, multiRecognizers: Array<MultiLanguageRecognizer>, settings: Settings)
    : Array<Content> {
    let contents = new Array<Content>()
    for (const recognizer of recognizers) {
      let content = new Content(
        path.basename(recognizer.getDialogPath()),
        recognizer.getDialogPath(),
        recognizer.save())

      contents.push(content)
    }

    for (const multiRecognizer of multiRecognizers) {
      const multiLangContent = new Content(
        path.basename(multiRecognizer.getDialogPath()),
        multiRecognizer.getDialogPath(),
        multiRecognizer.save())

      contents.push(multiLangContent)
    }

    const settingsContent = new Content(
      path.basename(settings.getSettingsPath()),
      settings.getSettingsPath(),
      settings.save())

    contents.push(settingsContent)

    return contents
  }

  private updateVersion(versionId: string) {
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
    equal = equal && this.isArrayEqual(appA.modelFeatures, appB.modelFeatures)
    equal = equal && this.isArrayEqual(appA.patternAnyEntities, appB.patternAnyEntities)
    equal = equal && this.isArrayEqual(appA.patterns, appB.patterns)
    equal = equal && this.isArrayEqual(appA.prebuiltEntities, appB.prebuiltEntities)
    equal = equal && this.isArrayEqual(appA.regexEntities, appB.regexEntities)
    equal = equal && this.isArrayEqual(appA.regexFeatures, appB.regexFeatures)
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

    return differenceWith(xObj, yObj, isEqual).length === 0
  }
}
