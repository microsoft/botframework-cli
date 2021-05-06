/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const delay = require('delay')

export async function test(
  client: any,
  appId: string,
  slotName: string,
  options: {},
  luisObject: any,
  allowIntentsCount: number,
  intentOnly: boolean,
  resultLog: any[]) {
  // luis api TPS which means 5 concurrent transactions to luis api in 1 second
  // can set to other value if switched to a higher TPS(transaction per second) key
  const concurrency = 5
  const delayTime = 1000

  // here we do a while loop to make full use of luis tps capacity
  let index = 0
  while (index < luisObject.utterances.length) {
    const subUtterances = luisObject.utterances.slice(index, index + concurrency)
    await Promise.all(subUtterances.map(async (utterance: any) => {
      const predictionRequest: any = {}
      predictionRequest.query = utterance.text
      let predictedResult = await client.prediction.getSlotPrediction(appId, slotName, predictionRequest, options)
      resultLog.push(predictedResult)
      let result: any = new Object()
      result.predictedIntents = []

      let intentCount = 0
      for (const intent of Object.keys(predictedResult.prediction.intents)) {
        if (intentCount >= allowIntentsCount) {
          break
        }
        const predictedIntents: any = {}
        predictedIntents.intent = intent
        predictedIntents.score = predictedResult.prediction.intents[intent].score
        result.predictedIntents.push(predictedIntents)
        intentCount++
      }
      result.IntentPass = compareIntent(result.predictedIntents, utterance)
      if (!intentOnly) {
        result.predictedEntities = []
        ParseEntitiyResult(predictedResult.prediction.entities, result)
        result.EntityPass = compareEntity(result.predictedEntities, utterance)
      }
      utterance.predictedResult = result
    }))
    await delay(delayTime)
    index += concurrency
  }

  luisObject.intents.forEach((intent: any) => {
    intent.count = 0
    intent.passNumber = 0
  })

  luisObject.utterances.forEach((utterance: any) => {
    let intent = luisObject.intents.find((item: any) => item.name === utterance.intent)
    intent.count++
    if (utterance.predictedResult.IntentPass && (utterance.predictedResult.EntityPass !== false)) {
      intent.passNumber++
    }
  })

  luisObject.test = true
  luisObject.count = 0
  luisObject.passNumber = 0
  luisObject.intents.forEach((intent: any) => {
    luisObject.count += intent.count
    luisObject.passNumber += intent.passNumber
  })
}

// we just check if the labeled intent is the same with the top-intent in predicted result
function compareIntent(predictedIntents: any[], utterance: any) {
  let pass = false
  if (predictedIntents.length > 0) {
    pass = predictedIntents[0].intent === utterance.intent ? true : false
  }
  return pass
}

// we just check if all the labeled entities are in the predicted result
function compareEntity(predictedEntities: any[], utterance: any) {
  let pass = true
  for (const entity of utterance.entities) {
    if (!predictedEntities.find((x: any) =>
      ((entity.role !== undefined && entity.role === x.role) || (entity.role === undefined && entity.entity === x.entity))
      && entity.startPos === x.startPos
      && entity.endPos === x.endPos)) {
      pass = false
      break
    }
  }
  return pass
}

// convert the predicted result to specific format
function ParseEntitiyResult(entities: any, result: any) {
  for (const name of Object.keys(entities)) {
    if (name === '$instance') {
      for (const entityType of Object.keys(entities.$instance)) {
        for (const entity of entities.$instance[entityType]) {
          if (entity.modelTypeId || entity.role) {
            let newEntity: any = new Object()
            newEntity.entity = entityType
            newEntity.startPos = entity.startIndex
            newEntity.endPos = entity.startIndex + entity.length - 1
            if (entity.role !== undefined && entity.role !== '') {
              newEntity.role = entity.role
            }
            result.predictedEntities.push(newEntity)
          }
        }
      }
    } else {
      if (typeof entities[name][Symbol.iterator] === 'function') {
        for (const subEntity of entities[name]) {
          if (typeof subEntity === 'object') {
            ParseEntitiyResult(subEntity, result)
          }
        }
      }
    }
  }
}
