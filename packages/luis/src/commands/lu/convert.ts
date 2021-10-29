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
  - name: OrderPizza
    utterances:
      - text: a cheese pizza [medium](s1) [with some](m1) [pineapple](t1)
      - text: add [5](q1) [party size](s1) [marinera pizzas](pt1) and i will pick them up at 6pm
      - text: can i get [3](q1) [pepperoni pizzas](pt1) and a [four cheese pizza](pt2) with [a large house salad](sp) and [a large fries](sp2)
        disambiguation:
          - label: FPWM2
            value:
              - pt2
  entities:
    - name: order
      type: ml
      value:
        - FullPizzaWithModifiers
        - SideOrder
    - name : FullPizzaWithModifiers
      type: ml
      value:
        - PizzaType
        - Size
        - Quantity
        - ToppingWithModifiers
      references: [FPWM2]
    - name: ToppingWithModifiers
      value:
        - Topping
        - Modifier
    - name: Topping
      type: list
      references: [t1]
    - name: Size
      type: list
      references: [s1]
    - name: PizzaType
      type: list
      references: [pt1, pt2]
    - name: Modifier
      type: list
      references: [m1]
    - name: Quantity
      type: list
      references: [q1]
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
