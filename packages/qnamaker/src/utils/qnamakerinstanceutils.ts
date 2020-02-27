/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export function sortQnA(qnaInstance: any) {
  qnaInstance.qnaList.forEach((pair: any) => {
    pair.questions.sort(sortComparers.compareFn)
  })
  qnaInstance.qnaList.sort(sortComparers.compareQn)
}

export function sortAlterations(alterationsInstance: any) {
  alterationsInstance.wordAlterations.forEach((word: any) => {
    word.alterations.sort(sortComparers.compareFn);
  })
  alterationsInstance.wordAlterations.sort(sortComparers.compareAltName);
}

const sortComparers = {
  compareAltName : (a: any, b: any) => {
    return compareString(a.alterations[0].toUpperCase(), b.alterations[0].toUpperCase())
  },    
  compareFn : (a: any, b: any) => {
    return compareString(a.toUpperCase(), b.toUpperCase())
  },    
  compareQn : (a: any, b: any) => {
    return compareString(a.questions[0].toUpperCase(), b.questions[0].toUpperCase())
  },
}

function compareString (a: string, b: string) {
  if (a < b) {
    return -1
  }

  if (a > b) {
    return 1
  }

  return 0
}
