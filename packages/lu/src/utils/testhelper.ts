/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { stringify } from 'querystring'

export async function GetPredictedResult(luisObject: any, flags: any, client: any){
    for(let index in luisObject.utterances)
    {
        let utterance = luisObject.utterances[index]
        let predictedResult = await GetSingleResult(client, flags, utterance.text)
        luisObject.utterances[index].predictedResult = predictedResult
    }
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
            for(let subEntity of entities[name])
            {
                if (typeof subEntity == "object"){
                    ParseEntitiyResult(subEntity, result);
                }
            }
        }
    }
}

//Get single predicted result, and convert to specific format
async function GetSingleResult(client: string, flags: any, query: string){
    let rawResult = await GetData(client, flags, query)
    console.log(`${JSON.stringify(rawResult, null, 0)}`)
    let result : any = new Object()
    result.predictedIntents = []
    for (let intent in rawResult.prediction.intents)
    {
        result.predictedIntents.push({"intent" : intent, "score": rawResult.prediction.intents[intent]["score"]})
    }
    
    result.predictedEntities = []
    ParseEntitiyResult(rawResult.prediction.entities, result)
    //rawResult.prediction.entities.$instance.forEach(function(entity: any){
    /*
    for(let entityType in rawResult.prediction.entities.$instance){
        for(let entity of rawResult.prediction.entities.$instance[entityType]){
            if (entity.modelTypeId === 1){
                let newEntity: any = new Object()
                newEntity.entity = entity.type
                newEntity.startPos = entity.startIndex
                newEntity.endPos = entity.startIndex + entity.length - 1
                if(entity.role !== undefined && entity.role !== ""){
                    newEntity.role = entity.role
                }
                result.predictedEntities.push(newEntity)
            }
        }
    }
    */

    return result
  }

async function GetData(client: any, flags: any, query: any){
    const options: any = {}
    let slotName = 'production'
    options.verbose = true
    options.showAllIntents  = true
    const predictionRequest: any = {"query": query}
    let result = await client.prediction.getSlotPrediction(flags.appId, slotName, predictionRequest, options)
    return result
}

