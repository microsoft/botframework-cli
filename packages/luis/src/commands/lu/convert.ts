/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Command, flags, utils} from '@microsoft/bf-cli-command'
const yaml = require('js-yaml')
export default class LuConvert extends Command {
  static description = 'Parsing of lu format to NLU providers input'

  v2 = `

  namespace: uri://piza.org/american#
  intents:
  - name: OrderPizza
    utterances:
      - text: a cheese pizza [medium](uri://piza.org/american#size) [with some](uri://piza.org/american#modifier) [pineapple](uri://piza.org/american#topping)
      - text: add [5](uri://piza.org/american#quantity) [party size](uri://piza.org/american#size) [marinera pizzas](uri://piza.org/american#pizzaType) and i will pick them up at 6pm
      - text: can i get [3](uri://piza.org/american#quantity) [pepperoni pizzas](uri://piza.org/american#pizzaType) and a [four cheese pizza](uri://piza.org/american#pizzaType[2])
  entities:
    - name: order
      type: ml
      value:
        - FullPizzaWithModifiers
        - SideOrder
    - name : FullPizzaWithModifiers
      type: ml
      value:
        - pizzaType
        - size
        - quantity
        - toppingModifiers
    - name: toppingModifiers
      value:
        - topping
        - modifier
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
    // this.log(JSON.stringify(luis, null, 2))
    // const yamlLU = this.parseToYAML(luis);
    // this.log(yamlLU)
  }

  parseToLUIS() {
    const yamlLU= yaml.load(this.v2);
    // Extract entity definition
    let entityMap: any = {}
    let entityMapChildToParent: any = {}
    for(let entity of yamlLU.entities) {
      entityMap[entity.name] = entity.value;
      for(let child in entity.value){
        entityMapChildToParent[child] = entity.name
      }
    }

    // Extract entities from utterances
    for(let intent of yamlLU.intents) {
      for(let utterance of intent.utterances){
        let regexDeclaration = /(\[(?:(\w|\s)*)+\]\((?:(\w|\s)*)+\))/g;
        let match = utterance['text'].match(regexDeclaration)
        this.log('utternace: ' + utterance['text']);
        this.log(match ? match.length + '' : '');
        let regexEntity = /\[(.*?)\]/i;
        let regexEntityName = /\((.*?)\)/i;
        let entity = regexEntity.exec(match ? match[0] + '' : '')
        let entityName = regexEntityName.exec(match ? match[0] + '' : '')
        // utterance['entities'] = {
        //   'entity': (entityName ? entityName[1] : ''),
        //   'startPos': (match ? match.index : 0),
        //   'endPos': (match ? match.index : 0) + (entity ? entity[1].length -1 : 0)
        // }
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
