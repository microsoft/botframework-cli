
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

 /* tslint:disable no-for-in no-single-line-block-comment */

export function sort(luisInstance: any) {
  let props = ['intents', 'composites', 'entities', 'closedLists', 'regex_entities', 'model_features', 'patternAnyEntities', 'prebuiltEntities']
  for (const key of props) {
    luisInstance[key].sort(sortComparers.compareNameFn)
  }

  luisInstance.utterances.sort(sortComparers.compareIntentFn)
}

export function hasContent(luisInstance: any) {
  for (let prop in luisInstance) {
    if (Array.isArray(luisInstance[prop]) && luisInstance[prop].length > 0) return true
  }
  return false
}

const sortComparers = {
  compareNameFn : (a: any, b: any) => {
    return compareString(a.name.toUpperCase(), b.name.toUpperCase())
  },
  compareIntentFn : (a: any, b: any) => {
    return compareString(a.intent.toUpperCase(), b.intent.toUpperCase())
  }
}

function compareString(a: any, b: any) {
  if (a < b) {
    return -1
  }

  if (a > b) {
    return 1
  }

  return 0
}
