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
  concurrency: number,
  intentOnly: boolean,
  resultLog: any[]) {
  // luis api TPS which means 5 concurrent transactions to luis api in 1 second
  // can set to other value if switched to a higher TPS(transaction per second) key
  let luisApiTps = 5
  concurrency = concurrency < 5? concurrency : 5
  let minTime = 1000 * concurrency / luisApiTps

  // here we do a while loop to make full use of luis tps capacity
  let index = 0
  while (index < luisObject.utterances.length) {
    let subUtterances: any[] = []
    let subIndex = 0
    while (subIndex < concurrency && index+subIndex < luisObject.utterances.length){
      subUtterances.push(luisObject.utterances[index+subIndex])
      subIndex++
    }
    await Promise.all(subUtterances.map(async (utterance: any) => {
      const predictionRequest: any = {"query": utterance.text}
      let predictedResult = await client.prediction.getSlotPrediction(appId, slotName, predictionRequest, options)
      resultLog.push(predictedResult)
      let result : any = new Object()
      result.predictedIntents = []
      
      let intentCount = 0
      for (let intent in predictedResult.prediction.intents){
        if (intentCount >= allowIntentsCount){
          break;
        }
        result.predictedIntents.push({"intent" : intent, "score": predictedResult.prediction.intents[intent]["score"]})
        intentCount++
      }
      result.IntentPass = compareIntent(result.predictedIntents, utterance)
      
      if (!intentOnly){
        result.predictedEntities = []
        ParseEntitiyResult(predictedResult.prediction.entities, result)
        result.EntityPass = compareEntity(result.predictedEntities, utterance)
      }
      utterance.predictedResult = result
    }))
    await delay(minTime)
    index+=subIndex
  }

  luisObject.intents.forEach((intent: any) => {
    intent.count = 0
    intent.passNumber = 0
  });

  luisObject.utterances.forEach((utterance: any) => {
      let intent = luisObject.intents.find((item: any) => item.name == utterance.intent)
      intent.count++
      if (utterance.predictedResult.IntentPass && (utterance.predictedResult.EntityPass===undefined||utterance.predictedResult.EntityPass==true)){
        intent.passNumber++
      }
  })
  
  luisObject.count = 0
  luisObject.passNumber = 0
  luisObject.intents.forEach((intent: any) => {
    luisObject.count += intent.count
    luisObject.passNumber += intent.passNumber
  })
}

function compareIntent(predictedIntents: any[], utterance: any){
  let pass = false
  if(predictedIntents.length > 0){
    pass = predictedIntents[0].intent===utterance.intent ? true : false;
  }
  return pass
}

function compareEntity(predictedEntities: any[], utterance: any){
  let pass = true
  for (let entity of utterance.entities){
    if(!predictedEntities.find((x: any)=> 
      (entity.role!==undefined && entity.role==x.role || entity.role === undefined && entity.entity==x.entity)
      && entity.startPos==x.startPos 
      && entity.endPos==x.endPos)){
      pass = false;
      break;
    }
  }
  return pass
}

function ParseEntitiyResult(entities :any, result: any){
  for(let name in entities){
    if (name == "$instance"){
      for(let entityType in entities.$instance){
        for(let entity of entities.$instance[entityType]){
          if (entity.modelTypeId === 1 || entity.modelTypeId === 4 || (entity.role !== undefined && entity.role !== "")){
            let newEntity: any = new Object()
            newEntity.entity = entityType
            newEntity.startPos = entity.startIndex
            newEntity.endPos = entity.startIndex + entity.length - 1
            if(entity.role !== undefined && entity.role !== ""){
                newEntity.role = entity.role
            }
            result.predictedEntities.push(newEntity)
          }
        }
      }
    }
    else{
      for(let subEntity of entities[name]){
        if (typeof subEntity == "object"){
          ParseEntitiyResult(subEntity, result);
        }
      }
    }
  }
}