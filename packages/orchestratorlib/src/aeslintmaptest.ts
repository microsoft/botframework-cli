/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Label} from '@microsoft/bf-dispatcher';
import {StructTextLabelObjects} from '@microsoft/bf-dispatcher';
import {StructTextNumber} from '@microsoft/bf-dispatcher';

export class OrchestratorAssess {
  // public static runTestcase0(utteranceEntityLabelsMap: Map<string, Label[]>): void {
  //   const utterancesMultiLabelArrays: [string, number][] = [...utteranceEntityLabelsMap.entries()].map(
  //     (x: [string, Label[]]) => [
  //       x[0],
  //       x[1].length
  //       ]);
  //   // eslint-disable-next-line no-console
  //   console.log(`utterancesMultiLabelArrays.length=${utterancesMultiLabelArrays.length}`);
  // }
  // public static runTestcase00(utteranceEntityLabelsMap: Map<string, Label[]>): void {
  //   const utterancesMultiLabelArrays: StructTextNumber[] = [...utteranceEntityLabelsMap.entries()].map(
  //     (x: [string, Label[]]) => new StructTextNumber(
  //       x[0],
  //       x[1].length
  //       ));
  //   // eslint-disable-next-line no-console
  //   console.log(`utterancesMultiLabelArrays.length=${utterancesMultiLabelArrays.length}`);
  // }

  // public static runTestcase1(utteranceEntityLabelsMap: Map<string, Label[]>): void {
  //   const utterancesMultiLabelArrays: [string, number][] = [...utteranceEntityLabelsMap.keys()].map(
  //     (x: string) => new StructTextLabelObjects(x, utteranceEntityLabelsMap.get(x) as Label[])).map(
  //       (x: StructTextLabelObjects) => [
  //         x.text,
  //         x.labels.length
  //       ]);
  //   // eslint-disable-next-line no-console
  //   console.log(`utterancesMultiLabelArrays.length=${utterancesMultiLabelArrays.length}`);
  // }
  public static runTestcase1fixed(utteranceEntityLabelsMap: Map<string, Label[]>): void {
    const utterancesMultiLabelArrays: StructTextNumber[] = [...utteranceEntityLabelsMap.keys()].map(
      (x: string) => new StructTextLabelObjects(x, utteranceEntityLabelsMap.get(x) as Label[])).map(
      (x: StructTextLabelObjects) => new StructTextNumber(
        x.text,
        x.labels.length
      ));
    // eslint-disable-next-line no-console
    console.log(`utterancesMultiLabelArrays.length=${utterancesMultiLabelArrays.length}`);
  }

  // public static runTestcase2(utteranceEntityLabelsMap: Map<string, Label[]>): void {
  //   const utteranceEntityLabelsArray: StructTextLabelObjects[] = [];
  //   utteranceEntityLabelsMap.forEach((value: Label[], key: string) => {
  //     utteranceEntityLabelsArray.push(new StructTextLabelObjects(key, value));
  //   });
  //   const utterancesMultiLabelArrays: [string, number][] = utteranceEntityLabelsArray.map(
  //     (x: StructTextLabelObjects) => [
  //       x.text,
  //       x.labels.length
  //     ]);
  //   // eslint-disable-next-line no-console
  //   console.log(`utterancesMultiLabelArrays.length=${utterancesMultiLabelArrays.length}`);
  // }
  public static runTestcase2fixed(utteranceEntityLabelsMap: Map<string, Label[]>): void {
    const utteranceEntityLabelsArray: StructTextLabelObjects[] = [];
    utteranceEntityLabelsMap.forEach((value: Label[], key: string) => {
      utteranceEntityLabelsArray.push(new StructTextLabelObjects(key, value));
    });
    const utterancesMultiLabelArrays: StructTextNumber[] = utteranceEntityLabelsArray.map(
      (x: StructTextLabelObjects) => new StructTextNumber(
        x.text,
        x.labels.length
      ));
    // eslint-disable-next-line no-console
    console.log(`utterancesMultiLabelArrays.length=${utterancesMultiLabelArrays.length}`);
  }

  // public static runTestcase3(utteranceEntityLabelsMap: Map<string, Label[]>): void {
  //   const utteranceEntityLabelsArray: StructTextLabelObjects[] = [];
  //   utteranceEntityLabelsMap.forEach((value: Label[], key: string) => {
  //     utteranceEntityLabelsArray.push(new StructTextLabelObjects(key, value));
  //   });
  //   const utterancesMultiLabelArrays: [string, number][] = utteranceEntityLabelsArray.map(
  //     (x: StructTextLabelObjects) => [
  //       x.text,
  //       x.labels.length
  //     ]);
  // // eslint-disable-next-line no-console
  // console.log(`utterancesMultiLabelArrays.length=${utterancesMultiLabelArrays.length}`);
  // }
  public static runTestcase3fixed(utteranceEntityLabelsMap: Map<string, Label[]>): void {
    const utteranceEntityLabelsArray: StructTextLabelObjects[] = [];
    utteranceEntityLabelsMap.forEach((value: Label[], key: string) => {
      utteranceEntityLabelsArray.push(new StructTextLabelObjects(key, value));
    });
    const utterancesMultiLabelArrays: string[] = utteranceEntityLabelsArray.map(
      (x: StructTextLabelObjects) =>
        x.text);
    // eslint-disable-next-line no-console
    console.log(`utterancesMultiLabelArrays.length=${utterancesMultiLabelArrays.length}`);
  }

  // public static runTestcase4(): void {
  //   const inputTupleArray: [string, number][] = [];
  //   inputTupleArray.push(['0', 0]);
  //   inputTupleArray.push(['1', 1]);
  //   inputTupleArray.push(['2', 2]);
  //   // eslint-disable-next-line no-console
  //   console.log(`inputTupleArray.length=${inputTupleArray.length}`);
  // }
  public static runTestcase4f(): void {
    const inputTupleArray: StructTextNumber[] = [];
    inputTupleArray.push(new StructTextNumber('0', 0));
    inputTupleArray.push(new StructTextNumber('1', 1));
    inputTupleArray.push(new StructTextNumber('2', 2));
    // eslint-disable-next-line no-console
    console.log(`inputTupleArray.length=${inputTupleArray.length}`);
  }

  // public static runTestcase5(): void {
  //   const inputTuple: [string, number] = ['0', 0];
  //   // eslint-disable-next-line no-console
  //   console.log(`inputTuple=${inputTuple}`);
  // }
  public static runTestcase5f(): void {
    const inputTuple: StructTextNumber = new StructTextNumber('0', 0);
    // eslint-disable-next-line no-console
    console.log(`inputTuple=${inputTuple}`);
  }
}
