/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags, utils} from '@microsoft/bf-cli-command'
const yaml = require('js-yaml')
export default class LuConvert extends Command {
  static description = 'Parsing of lu format to NLU providers input'

  v2 = `
intents:
  - name: AskForUserName
  - name: CreateAlarm
  - name: CommunicationPreference
entities:
  - name: userName
    roles: []
composites: []
closedLists:
  - name: commPreference
    subLists:
      - canonicalForm: call
        list:
          - phone call
          - give me a ring
          - ring
          - call
          - cell phone
          - phone
      - canonicalForm: text
        list:
          - message
          - text
          - sms
          - text message
      - canonicalForm: fax
        list:
          - fax
          - fascimile
    roles: []
regex_entities: []
model_features:
  - name: ChocolateType
    words: 'm&m,mars,mints,spearmings,payday,jelly,kit kat,kitkat,twix'
    mode: false
    activated: true
  - name: question
    words: 'are you,you are'
    mode: true
    activated: true
regex_features: []
utterances:
  - text: I'm [vishwac](userName)
    intent: AskForUserName
  - text: call me [vishwac](userName)
    intent: AskForUserName
  - text: my name is [vishwac](userName)
    intent: AskForUserName
  - text: you  can call me [vishwac](userName)
    intent: AskForUserName
  - text: create  an alarm
    intent: CreateAlarm
  - text: create an alarm for 7AM
    intent: CreateAlarm
  - text: set an alarm for 7AM next thursday
    intent: CreateAlarm
  - text: set phone call as my communication preference
    intent: CommunicationPreference
  - text: I prefer to receive text message
    intent: CommunicationPreference
patterns:
  - pattern: 'delete the {alarmTime} alarm'
    intent: DeleteAlarm
  - pattern: 'remove the {alarmTime} alarm'
    intent: DeleteAlarm
patternAnyEntities:
  - name: alarmTime
    explicitList: []
    roles: []
prebuiltEntities:
  - name: datetimeV2
    roles: []
luis_schema_version: 3.2.0
versionId: '0.1'
name: all
desc: ''
culture: en-us
`

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
    in: flags.string({char: 'i', description: 'Source .lu file(s'}),
    luis: flags.string({char: 'l', description: 'name to print'}),
    v2: flags.boolean({description: 'name to print', exclusive: ['luis']}),
  }

  async run() {
    const {args, flags} = this.parse(LuConvert)
    const luis = this.parseToLUIS()
    this.log(JSON.stringify(luis, null, 2))
    const yamlLU = this.parseToYAML(luis);
    this.log(yamlLU)
  }

  parseToLUIS() {
    const yamlLU= yaml.load(this.v2);
    for(let utterance of yamlLU.utterances) {
      let regexDeclaration = /\[.*\]\(.*\)/i;
      if (regexDeclaration.test(utterance['text'])) {
        let match = regexDeclaration.exec(utterance['text'])
        let regexEntity = /\[(.*?)\]/i;
        let regexEntityName = /\((.*?)\)/i;
        let entity = regexEntity.exec(match ? match[0] + '' : '')
        let entityName = regexEntityName.exec(match ? match[0] + '' : '')
       utterance['entities'] = {
         'entity': (entityName ? entityName[1] : ''),
         'startPos': (match ? match.index : 0),
         'endPos': (match ? match.index : 0) + (entity ? entity[1].length -1 : 0)
       }
      }
    }
    return yamlLU
  }

  parseToYAML(luisObject: any) {
    for(let utterance of luisObject.utterances) {
      if (utterance['entities']?.length > 0) {
        let userFriendlyText = utterance['text']
        let firstHalf = userFriendlyText.substring(0, utterance['entities']['startPos'])
        let entity = userFriendlyText.substring(utterance['entities']['startPos'], utterance['entities']['endPos'])
        let secondHalf = userFriendlyText.substring(utterance['entities']['endPos'])
        utterance['text'] = `${firstHalf}[${entity}]${utterance['entities']['entity']}${secondHalf}`
      }
      delete utterance.entities
    }
    return yaml.dump(luisObject)
  }

}
