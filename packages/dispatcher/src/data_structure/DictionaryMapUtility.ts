/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TMapAnyKeyGenericArray } from "./TMapAnyKeyGenericArray";
import { TMapAnyKeyGenericArrays } from "./TMapAnyKeyGenericArrays";
import { TMapAnyKeyGenericValue } from "./TMapAnyKeyGenericValue";
import { TMapAnyKeyGenericSet } from "./TMapAnyKeyGenericSet";
import { TMapNumberKeyGenericArray } from "./TMapNumberKeyGenericArray";
import { TMapNumberKeyGenericArrays } from "./TMapNumberKeyGenericArrays";
import { TMapNumberKeyGenericValue } from "./TMapNumberKeyGenericValue";
import { TMapNumberKeyGenericSet } from "./TMapNumberKeyGenericSet";
import { TMapGenericKeyGenericArray } from "./TMapGenericKeyGenericArray";
import { TMapGenericKeyGenericArrays } from "./TMapGenericKeyGenericArrays";
import { TMapGenericKeyGenericValue } from "./TMapGenericKeyGenericValue";
import { TMapGenericKeyGenericSet } from "./TMapGenericKeyGenericSet";
import { TMapStringKeyGenericArray } from "./TMapStringKeyGenericArray";
import { TMapStringKeyGenericArrays } from "./TMapStringKeyGenericArrays";
import { TMapStringKeyGenericValue } from "./TMapStringKeyGenericValue";
import { TMapStringKeyGenericSet } from "./TMapStringKeyGenericSet";

import { IDictionaryNumberIdGenericArray } from "../data_structure/IDictionaryNumberIdGenericArray";
import { IDictionaryNumberIdGenericArrays } from "../data_structure/IDictionaryNumberIdGenericArrays";
import { IDictionaryNumberIdGenericValue } from "../data_structure/IDictionaryNumberIdGenericValue";
import { IDictionaryNumberIdGenericSet } from "../data_structure/IDictionaryNumberIdGenericSet";
import { IDictionaryStringIdGenericArray } from "../data_structure/IDictionaryStringIdGenericArray";
import { IDictionaryStringIdGenericArrays } from "../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../data_structure/IDictionaryStringIdGenericValue";
import { IDictionaryStringIdGenericSet } from "../data_structure/IDictionaryStringIdGenericSet";

import { Utility } from "../utility/Utility";

export class DictionaryMapUtility {

    public static readonly UnknownLabel: string = "UNKNOWN";

    public static readonly UnknownLabelSet: Set<string> =
        new Set<string>(["", "NONE", DictionaryMapUtility.UnknownLabel]);

    public static processUnknowLabelsInUtteranceLabelsMapUsingLabelSet(
        utteranceLabels: {
            "utteranceLabelsMap": { [id: string]: string[] };
            "utteranceLabelDuplicateMap": Map<string, Set<string>>; },
        labelSet: Set<string>): {
            "utteranceLabelsMap": { [id: string]: string[] };
            "utteranceLabelDuplicateMap": Map<string, Set<string>>; } {
        const utteranceLabelsMap: { [id: string]: string[] } = utteranceLabels.utteranceLabelsMap;
        const utteranceLabelDuplicateMap:  Map<string, Set<string>> = utteranceLabels.utteranceLabelDuplicateMap;
        if (utteranceLabelsMap) {
            for (const utteranceKey in utteranceLabelsMap) {
                if (utteranceKey) {
                    const concreteLabels: string[] = utteranceLabelsMap[utteranceKey].filter(
                        (label: string) =>
                        !DictionaryMapUtility.UnknownLabelSet.has(label.toUpperCase()) && labelSet.has(label));
                    const hasConcreteLabel: boolean = concreteLabels.length > 0;
                    if (!hasConcreteLabel) {
                        utteranceLabelsMap[utteranceKey].length = 0; // ---- NOTE ---- truncate the array!
                        utteranceLabelsMap[utteranceKey].push(DictionaryMapUtility.UnknownLabel);
                        continue;
                    }
                    utteranceLabelsMap[utteranceKey].length = 0; // ---- NOTE ---- truncate the array!
                    for (const label of concreteLabels) {
                        utteranceLabelsMap[utteranceKey].push(label);
                    }
                }
          }
        }
        if (utteranceLabelDuplicateMap) {
            utteranceLabelDuplicateMap.forEach((labelsSet: Set<string>, _: string) => {
                const labelsArray: string[] = [...labelsSet];
                const concreteLabels: string[] = labelsArray.filter(
                    (label: string) =>
                    !DictionaryMapUtility.UnknownLabelSet.has(label.toUpperCase()) && labelSet.has(label));
                const hasConcreteLabel: boolean = concreteLabels.length > 0;
                // eslint-disable-next-line max-depth
                if (hasConcreteLabel) {
                    labelsSet.clear(); // ---- NOTE ---- truncate the array!
                    // eslint-disable-next-line max-depth
                    for (const label of concreteLabels) {
                        labelsSet.add(label);
                    }
                } else {
                    labelsSet.clear(); // ---- NOTE ---- truncate the array!
                    labelsSet.add(DictionaryMapUtility.UnknownLabel);
                }
            });
        }
        return utteranceLabels;
    }

    public static processUnknowLabelsInUtteranceLabelsMap(
        utteranceLabels: {
            "utteranceLabelsMap": { [id: string]: string[] };
            "utteranceLabelDuplicateMap": Map<string, Set<string>>; }): {
                "utteranceLabelsMap": { [id: string]: string[] };
                "utteranceLabelDuplicateMap": Map<string, Set<string>>; } {
        const utteranceLabelsMap: { [id: string]: string[] } = utteranceLabels.utteranceLabelsMap;
        const utteranceLabelDuplicateMap:  Map<string, Set<string>> = utteranceLabels.utteranceLabelDuplicateMap;
        if (utteranceLabelsMap) {
            for (const utteranceKey in utteranceLabelsMap) {
                if (utteranceKey) {
                    const concreteLabels: string[] = utteranceLabelsMap[utteranceKey].filter(
                        (label: string) => !DictionaryMapUtility.UnknownLabelSet.has(label.toUpperCase()));
                    const hasConcreteLabel: boolean = concreteLabels.length > 0;
                    if (!hasConcreteLabel) {
                        utteranceLabelsMap[utteranceKey].length = 0; // ---- NOTE ---- truncate the array!
                        utteranceLabelsMap[utteranceKey].push(DictionaryMapUtility.UnknownLabel);
                        continue;
                    }
                    utteranceLabelsMap[utteranceKey].length = 0; // ---- NOTE ---- truncate the array!
                    for (const label of concreteLabels) {
                        utteranceLabelsMap[utteranceKey].push(label);
                    }
                }
            }
        }
        if (utteranceLabelDuplicateMap) {
            utteranceLabelDuplicateMap.forEach((labelsSet: Set<string>, _: string) => {
                const labelsArray: string[] = [...labelsSet];
                const concreteLabels: string[] = labelsArray.filter(
                    (label: string) => !DictionaryMapUtility.UnknownLabelSet.has(label.toUpperCase()));
                const hasConcreteLabel: boolean = concreteLabels.length > 0;
                // eslint-disable-next-line max-depth
                if (hasConcreteLabel) {
                    labelsSet.clear(); // ---- NOTE ---- truncate the array!
                    // eslint-disable-next-line max-depth
                    for (const label of concreteLabels) {
                        labelsSet.add(label);
                    }
                } else {
                    labelsSet.clear(); // ---- NOTE ---- truncate the array!
                    labelsSet.add(DictionaryMapUtility.UnknownLabel);
                }
            });
        }
        return utteranceLabels;
    }

    public static convertStringKeyGenericSetNativeMapToDictionary<T>(
        stringKeyGenericSetMap: Map<string, Set<T>>): { [id: string]: Set<T> } {
        const stringIdGenericSetDictionary: { [id: string]: Set<T> } = {};
        for (const key in stringKeyGenericSetMap) {
            if (key) {
                const value: Set<T> | undefined = stringKeyGenericSetMap.get(key);
                stringIdGenericSetDictionary[key] = value as Set<T>;
            }
        }
        return stringIdGenericSetDictionary;
    }
    public static convertStringKeyGenericValueNativeMapToDictionary<T>(
        stringKeyGenericValueMap: Map<string, T>): { [id: string]: T } {
        const stringIdGenericValueDictionary: { [id: string]: T } = {};
        for (const key in stringKeyGenericValueMap) {
            if (key) {
                const value: T | undefined = stringKeyGenericValueMap.get(key);
                stringIdGenericValueDictionary[key] = value as T;
            }
        }
        return stringIdGenericValueDictionary;
    }
    public static convertNumberKeyGenericSetNativeMapToDictionary<T>(
        numberKeyGenericSetMap: Map<number, Set<T>>): { [id: number]: Set<T> } {
        const numberIdGenericSetDictionary: { [id: number]: Set<T> } = {};
        for (const key in numberKeyGenericSetMap) {
            if (key) {
                // ---- key is already a number, tslint is mistaken that it's a string
                const keyInNumber: number = Number(key);
                const value: Set<T> | undefined = numberKeyGenericSetMap.get(keyInNumber);
                numberIdGenericSetDictionary[keyInNumber] = value as Set<T>;
            }
        }
        return numberIdGenericSetDictionary;
    }
    public static convertNumberKeyGenericValueNativeMapToDictionary<T>(
        numberKeyGenericValueMap: Map<number, T>): { [id: number]: T } {
        const numberIdGenericValueDictionary: { [id: number]: T } = {};
        for (const key in numberKeyGenericValueMap) {
            if (key) {
                // ---- key is already a number, tslint is mistaken that it's a string
                const keyInNumber: number = Number(key);
                const value: T | undefined = numberKeyGenericValueMap.get(keyInNumber);
                numberIdGenericValueDictionary[keyInNumber] = value as T;
            }
        }
        return numberIdGenericValueDictionary;
    }

    public static convertStringKeyGenericSetMapToDictionary<T>(
        stringKeyGenericSetMap: TMapStringKeyGenericSet<T>): IDictionaryStringIdGenericSet<T> {
        const stringIdGenericSetDictionary: IDictionaryStringIdGenericSet<T> = {};
        for (const key in stringKeyGenericSetMap) {
            if (key) {
                const value: Set<T> | undefined = stringKeyGenericSetMap.get(key);
                stringIdGenericSetDictionary[key] = value as Set<T>;
            }
        }
        return stringIdGenericSetDictionary;
    }
    public static convertStringKeyGenericValueMapToDictionary<T>(
        stringKeyGenericValueMap: TMapStringKeyGenericValue<T>): IDictionaryStringIdGenericValue<T> {
        const stringIdGenericValueDictionary: IDictionaryStringIdGenericValue<T> = {};
        for (const key in stringKeyGenericValueMap) {
            if (key) {
                const value: T | undefined = stringKeyGenericValueMap.get(key);
                stringIdGenericValueDictionary[key] = value as T;
            }
        }
        return stringIdGenericValueDictionary;
    }
    public static convertNumberKeyGenericSetMapToDictionary<T>(
        numberKeyGenericSetMap: TMapNumberKeyGenericSet<T>): IDictionaryNumberIdGenericSet<T> {
        const numberIdGenericSetDictionary: IDictionaryNumberIdGenericSet<T> = {};
        for (const key in numberKeyGenericSetMap) {
            if (key) {
                // ---- key is already a number, tslint is mistaken that it's a string
                const keyInNumber: number = Number(key);
                const value: Set<T> | undefined = numberKeyGenericSetMap.get(keyInNumber);
                numberIdGenericSetDictionary[keyInNumber] = value as Set<T>;
            }
        }
        return numberIdGenericSetDictionary;
    }
    public static convertNumberKeyGenericValueMapToDictionary<T>(
        numberKeyGenericValueMap: TMapNumberKeyGenericValue<T>): IDictionaryNumberIdGenericValue<T> {
        const numberIdGenericValueDictionary: IDictionaryNumberIdGenericValue<T> = {};
        for (const key in numberKeyGenericValueMap) {
            if (key) {
                // ---- key is already a number, tslint is mistaken that it's a string
                const keyInNumber: number = Number(key);
                const value: T | undefined = numberKeyGenericValueMap.get(keyInNumber);
                numberIdGenericValueDictionary[keyInNumber] = value as T;
            }
        }
        return numberIdGenericValueDictionary;
    }

    public static insertStringPairToStringIdStringSetNativeDictionary(
        key: string,
        value: string,
        stringIdStringSetDictionary: { [id: string]: Set<string> }): { [id: string]: Set<string> } {
        if (!stringIdStringSetDictionary) {
            stringIdStringSetDictionary = {};
        }
        if (key in stringIdStringSetDictionary) {
            const stringSet: Set<string> = stringIdStringSetDictionary[key];
            stringSet.add(value);
        } else {
            const stringSet: Set<string> = new Set<string>();
            stringIdStringSetDictionary[key] = stringSet;
            stringSet.add(value);
        }
        return stringIdStringSetDictionary;
    }
    public static insertNumberStringPairToNumberIdStringSetNativeDictionary(
        key: number,
        value: string,
        numberIdStringSetDictionary: { [id: number]: Set<string> }): { [id: number]: Set<string> } {
        if (!numberIdStringSetDictionary) {
            numberIdStringSetDictionary = {};
        }
        if (key in numberIdStringSetDictionary) {
            const stringSet: Set<string> = numberIdStringSetDictionary[key];
            stringSet.add(value);
        } else {
            const stringSet: Set<string> = new Set<string>();
            numberIdStringSetDictionary[key] = stringSet;
            stringSet.add(value);
        }
        return numberIdStringSetDictionary;
    }

    public static insertStringPairToStringIdStringSetDictionary(
        key: string,
        value: string,
        stringIdStringSetDictionary: IDictionaryStringIdGenericSet<string>): IDictionaryStringIdGenericSet<string> {
        if (DictionaryMapUtility.isEmptyStringIdGenericSetDictionary<string>(stringIdStringSetDictionary)) {
            stringIdStringSetDictionary = {};
        }
        if (key in stringIdStringSetDictionary) {
            const stringSet: Set<string> = stringIdStringSetDictionary[key];
            stringSet.add(value);
        } else {
            const stringSet: Set<string> = new Set<string>();
            stringIdStringSetDictionary[key] = stringSet;
            stringSet.add(value);
        }
        return stringIdStringSetDictionary;
    }
    public static insertNumberStringPairToNumberIdStringSetDictionary(
        key: number,
        value: string,
        numberIdStringSetDictionary: IDictionaryNumberIdGenericSet<string>): IDictionaryNumberIdGenericSet<string> {
        if (DictionaryMapUtility.isEmptyNumberIdGenericSetDictionary<string>(numberIdStringSetDictionary)) {
            numberIdStringSetDictionary = {};
        }
        if (key in numberIdStringSetDictionary) {
            const stringSet: Set<string> = numberIdStringSetDictionary[key];
            stringSet.add(value);
        } else {
            const stringSet: Set<string> = new Set<string>();
            numberIdStringSetDictionary[key] = stringSet;
            stringSet.add(value);
        }
        return numberIdStringSetDictionary;
    }

    public static insertStringPairToStringIdStringSetNativeMap(
        key: string,
        value: string,
        stringKeyStringSetMap: Map<string, Set<string>>): Map<string, Set<string>> {
        if (!stringKeyStringSetMap) {
            stringKeyStringSetMap = new Map<string, Set<string>>();
        }
        if (stringKeyStringSetMap.has(key)) {
            let stringSet: Set<string> | undefined = stringKeyStringSetMap.get(key);
            if (!stringSet) {
                stringSet = new Set<string>();
                stringKeyStringSetMap.set(key, stringSet);
            }
            stringSet.add(value);
        } else {
            const stringSet: Set<string> = new Set<string>();
            stringKeyStringSetMap.set(key, stringSet);
            stringSet.add(value);
        }
        return stringKeyStringSetMap;
    }
    public static insertNumberStringPairToNumberIdStringSetNativeMap(
        key: number,
        value: string,
        numberKeyStringSetMap: Map<number, Set<string>>): Map<number, Set<string>> {
        if (!numberKeyStringSetMap) {
            numberKeyStringSetMap = new Map<number, Set<string>>();
        }
        if (numberKeyStringSetMap.has(key)) {
            let stringSet: Set<string> | undefined = numberKeyStringSetMap.get(key);
            if (!stringSet) {
                stringSet = new Set<string>();
                numberKeyStringSetMap.set(key, stringSet);
            }
            stringSet.add(value);
        } else {
            const stringSet: Set<string> = new Set<string>();
            numberKeyStringSetMap.set(key, stringSet);
            stringSet.add(value);
        }
        return numberKeyStringSetMap;
    }

    public static insertStringPairToStringIdStringSetMap(
        key: string,
        value: string,
        stringKeyStringSetMap: TMapStringKeyGenericSet<string>): TMapStringKeyGenericSet<string> {
        if (DictionaryMapUtility.isEmptyStringKeyGenericSetMap<string>(stringKeyStringSetMap)) {
            stringKeyStringSetMap = DictionaryMapUtility.newTMapStringKeyGenericSet<string>();
        }
        if (stringKeyStringSetMap.has(key)) {
            let stringSet: Set<string> | undefined = stringKeyStringSetMap.get(key);
            if (!stringSet) {
                stringSet = new Set<string>();
                stringKeyStringSetMap.set(key, stringSet);
            }
            stringSet.add(value);
        } else {
            const stringSet: Set<string> = new Set<string>();
            stringKeyStringSetMap.set(key, stringSet);
            stringSet.add(value);
        }
        return stringKeyStringSetMap;
    }
    public static insertNumberStringPairToNumberIdStringSetMap(
        key: number,
        value: string,
        numberKeyStringSetMap: TMapNumberKeyGenericSet<string>): TMapNumberKeyGenericSet<string> {
        if (DictionaryMapUtility.isEmptyNumberKeyGenericSetMap<string>(numberKeyStringSetMap)) {
            numberKeyStringSetMap = DictionaryMapUtility.newTMapNumberKeyGenericSet<string>();
        }
        if (numberKeyStringSetMap.has(key)) {
            let stringSet: Set<string> | undefined = numberKeyStringSetMap.get(key);
            if (!stringSet) {
                stringSet = new Set<string>();
                numberKeyStringSetMap.set(key, stringSet);
            }
            stringSet.add(value);
        } else {
            const stringSet: Set<string> = new Set<string>();
            numberKeyStringSetMap.set(key, stringSet);
            stringSet.add(value);
        }
        return numberKeyStringSetMap;
    }

    public static buildStringIdNumberValueDictionaryFromUniqueStringArrayFile(
        filename: string,
        delimiter: string = "\t"): {
            "stringArray": string[],
            "stringMap": IDictionaryStringIdGenericValue<number> } {
        const content: string = Utility.loadFile(filename);
        return DictionaryMapUtility.buildStringIdNumberValueDictionaryFromUniqueStringArrayContent(
            content,
            delimiter);
    }
    public static buildStringIdNumberValueDictionaryFromUniqueStringArrayContent(
        content: string,
        delimiter: string = "\t"): {
            "stringArray": string[],
            "stringMap": IDictionaryStringIdGenericValue<number> } {
        let stringArray: string[] = Utility.split(content, delimiter);
        stringArray = DictionaryMapUtility.sortStringArray(stringArray);
        const stringMap: IDictionaryStringIdGenericValue<number> =
            DictionaryMapUtility.buildStringIdNumberValueDictionaryFromUniqueStringArray(stringArray);
        return { stringArray, stringMap };
    }
    public static buildStringIdNumberValueDictionaryFromUniqueStringArray(
        inputStringArray: string[]): IDictionaryStringIdGenericValue<number> {
        inputStringArray = DictionaryMapUtility.sortStringArray(inputStringArray);
        const stringMap: IDictionaryStringIdGenericValue<number> = { };
        for (let index: number = 0; index < inputStringArray.length; index++) {
            stringMap[inputStringArray[index]] = index;
        }
        return stringMap;
    }
    public static buildStringIdNumberValueDictionaryFromStringArrayFile(
        filename: string,
        delimiter: string = "\t"): {
            "stringArray": string[],
            "stringMap": IDictionaryStringIdGenericValue<number> } {
        const content: string = Utility.loadFile(filename);
        return DictionaryMapUtility.buildStringIdNumberValueDictionaryFromStringArrayContent(
            content,
            delimiter);
    }
    public static buildStringIdNumberValueDictionaryFromStringArrayContent(
        content: string,
        delimiter: string = "\t"): {
            "stringArray": string[],
            "stringMap": IDictionaryStringIdGenericValue<number> } {
        const records: string[] = Utility.split(content, delimiter);
        return DictionaryMapUtility.buildStringIdNumberValueDictionaryFromStringArray(records);
    }
    public static buildStringIdNumberValueDictionaryFromStringArray(
        inputStringArray: string[]): {
            "stringArray": string[],
            "stringMap": IDictionaryStringIdGenericValue<number> } {
        const stringSet: Set<string> = new Set(inputStringArray);
        let stringArray: string[] = Array.from(stringSet.values());
        stringArray = DictionaryMapUtility.sortStringArray(stringArray);
        const stringMap: IDictionaryStringIdGenericValue<number> =
            DictionaryMapUtility.buildStringIdNumberValueDictionaryFromUniqueStringArray(stringArray);
        return { stringArray, stringMap };
    }
    public static buildStringIdNumberValueDictionaryFromStringArrays(
        inputStringArrays: string[][]): {
            "stringArray": string[],
            "stringMap": IDictionaryStringIdGenericValue<number> } {
        const stringSet: Set<string> = new Set();
        for (const elementStringArray of inputStringArrays) {
            for (const elementString of elementStringArray) {
                stringSet.add(elementString);
            }
        }
        let stringArray: string[] = Array.from(stringSet.values());
        stringArray = DictionaryMapUtility.sortStringArray(stringArray);
        const stringMap: IDictionaryStringIdGenericValue<number> =
            DictionaryMapUtility.buildStringIdNumberValueDictionaryFromUniqueStringArray(stringArray);
        return { stringArray, stringMap };
    }

    public static validateStringArrayAndStringIdNumberValueDictionary(
        stringArray: string[],
        stringIdNumberValueDictionary: IDictionaryStringIdGenericValue<number>,
        throwIfNotLegal: boolean = true): boolean {
        if (stringArray === null) {
            if (throwIfNotLegal) {
                throw new Error("stringArray===null");
            }
            return false;
        }
        if (stringIdNumberValueDictionary === null) {
            if (throwIfNotLegal) {
                throw new Error("stringIdNumberValueDictionary===null");
            }
            return false;
        }
        if (stringArray.length !==
            DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringIdNumberValueDictionary)) {
            if (throwIfNotLegal) {
                throw new Error(
                    `stringArray.length|${stringArray.length}|` +
                    "!==stringIdNumberValueDictionary.length" +
                    `|${DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringIdNumberValueDictionary)}|`);
            }
            return false;
        }
        for (const key in stringIdNumberValueDictionary) {
            if (key) {
                // ---- side effect is to remove TSLint warning for
                // ---- "in" statements must be filtered with an if statement.
                const keyId: number = stringIdNumberValueDictionary[key];
                if ((keyId < 0) || (keyId > stringArray.length)) {
                    if (throwIfNotLegal) {
                        throw new Error(`(keyId<0)||(keyId|${keyId}|>stringArray.length|${stringArray.length}|)`);
                    }
                    return false;
                }
                const keyRetrieved = stringArray[keyId];
                if (key !== keyRetrieved) {
                    if (throwIfNotLegal) {
                        throw new Error(`key|${key}|!==keyRetrieved|${keyRetrieved}|`);
                    }
                    return false;
                }
            }
        }
        return true;
    }
    public static validateNumberKeyIdInStringIdNumberValueDictionary(
        keyId: number,
        stringIdNumberValueDictionary: IDictionaryStringIdGenericValue<number>,
        throwIfNotLegal: boolean = true): boolean {
        if (keyId < 0) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `keyId=${keyId}, small than 0`);
            }
            return false;
        }
        if (keyId >= DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringIdNumberValueDictionary)) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `keyId=${keyId}, greater or equal to number of keys: ${stringIdNumberValueDictionary.size}`);
            }
            return false;
        }
        return true;
    }
    public static validateStringKeyInStringIdNumberValueDictionary(
        key: string,
        stringIdNumberValueDictionary: IDictionaryStringIdGenericValue<number>,
        throwIfNotLegal: boolean = true): boolean {
        if (key in stringIdNumberValueDictionary) {
            return true;
        } else {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `key=${key}, not in the dictionary: ${stringIdNumberValueDictionary}`);
            }
            return false;
        }
    }

    public static buildStringKeyNumberValueMapFromUniqueStringArrayFile(
        filename: string,
        delimiter: string = "\t"): {
            "stringArray": string[],
            "stringMap": TMapStringKeyGenericValue<number> } {
        const content: string = Utility.loadFile(filename);
        return DictionaryMapUtility.buildStringKeyNumberValueMapFromUniqueStringArrayContent(
            content,
            delimiter);
    }
    public static buildStringKeyNumberValueMapFromUniqueStringArrayContent(
        content: string,
        delimiter: string = "\t"): {
            "stringArray": string[],
            "stringMap": TMapStringKeyGenericValue<number> } {
        let stringArray: string[] = Utility.split(content, delimiter);
        stringArray = DictionaryMapUtility.sortStringArray(stringArray);
        const stringMap: TMapStringKeyGenericValue<number> =
            DictionaryMapUtility.buildStringKeyNumberValueMapFromUniqueStringArray(stringArray);
        return { stringArray, stringMap };
    }
    public static buildStringKeyNumberValueMapFromUniqueStringArray(
        inputStringArray: string[]): TMapStringKeyGenericValue<number> {
        inputStringArray = DictionaryMapUtility.sortStringArray(inputStringArray);
        const stringMap: TMapStringKeyGenericValue<number> =
            DictionaryMapUtility.newTMapStringKeyGenericValue();
        for (let index: number = 0; index < inputStringArray.length; index++) {
            stringMap.set(inputStringArray[index], index);
        }
        return stringMap;
    }
    public static buildStringKeyNumberValueMapFromStringArrayFile(
        filename: string,
        delimiter: string = "\t"): {
            "stringArray": string[],
            "stringMap": TMapStringKeyGenericValue<number> } {
        const content: string = Utility.loadFile(filename);
        return DictionaryMapUtility.buildStringKeyNumberValueMapFromStringArrayContent(
            content,
            delimiter);
    }
    public static buildStringKeyNumberValueMapFromStringArrayContent(
        content: string,
        delimiter: string = "\t"): {
            "stringArray": string[],
            "stringMap": TMapStringKeyGenericValue<number> } {
        const records: string[] = Utility.split(content, delimiter);
        return DictionaryMapUtility.buildStringKeyNumberValueMapFromStringArray(records);
    }
    public static buildStringKeyNumberValueMapFromStringArray(
        inputStringArray: string[]): {
            "stringArray": string[],
            "stringMap": TMapStringKeyGenericValue<number> } {
        const stringSet: Set<string> = new Set(inputStringArray);
        let stringArray: string[] = Array.from(stringSet.values());
        stringArray = DictionaryMapUtility.sortStringArray(stringArray);
        const stringMap: TMapStringKeyGenericValue<number> =
            DictionaryMapUtility.buildStringKeyNumberValueMapFromUniqueStringArray(stringArray);
        return { stringArray, stringMap };
    }
    public static buildStringKeyNumberValueMapFromStringArrays(
        inputStringArrays: string[][]): {
            "stringArray": string[],
            "stringMap": TMapStringKeyGenericValue<number> } {
        const stringSet: Set<string> = new Set();
        for (const elementStringArray of inputStringArrays) {
            for (const elementString of elementStringArray) {
                stringSet.add(elementString);
            }
        }
        let stringArray: string[] = Array.from(stringSet.values());
        stringArray = DictionaryMapUtility.sortStringArray(stringArray);
        const stringMap: TMapStringKeyGenericValue<number> =
            DictionaryMapUtility.buildStringKeyNumberValueMapFromUniqueStringArray(stringArray);
        return { stringArray, stringMap };
    }

    public static sortAnyArray(inputStringArray: any[]): any[] {
        return inputStringArray.sort(
          (n1: any, n2: any) => {
            if (n1 > n2) {
              return 1;
            }
            if (n1 < n2) {
              return -1;
            }
            return 0;
          });
    }
    public static sortNumberArray(inputStringArray: number[]): number[] {
        return inputStringArray.sort(
          (n1: number, n2: number) => {
            if (n1 > n2) {
              return 1;
            }
            if (n1 < n2) {
              return -1;
            }
            return 0;
          });
    }
    public static sortStringArray(inputStringArray: string[]): string[] {
        return inputStringArray.sort(
          (n1: string, n2: string) => {
            if (n1 > n2) {
              return 1;
            }
            if (n1 < n2) {
              return -1;
            }
            return 0;
          });
    }

    public static validateStringArrayAndStringKeyNumberValueMap(
        stringArray: string[],
        stringKeyNumberValueMap: TMapStringKeyGenericValue<number>,
        throwIfNotLegal: boolean = true): boolean {
        if (stringArray === null) {
            if (throwIfNotLegal) {
                throw new Error("stringArray===null");
            }
            return false;
        }
        if (stringKeyNumberValueMap === null) {
            if (throwIfNotLegal) {
                throw new Error("stringKeyNumberValueMap===null");
            }
            return false;
        }
        if (stringArray.length !== DictionaryMapUtility.getStringKeyGenericValueMapLength(stringKeyNumberValueMap)) {
            if (throwIfNotLegal) {
                throw new Error(
                    "stringArray.length|" +
                    stringArray.length +
                    "|!==stringKeyNumberValueMap.length|" +
                    DictionaryMapUtility.getStringKeyGenericValueMapLength(stringKeyNumberValueMap) + "|");
            }
            return false;
        }
        for (const key in stringKeyNumberValueMap) {
            if (key) {
                // ---- side effect is to remove TSLint warning for
                // ---- "in" statements must be filtered with an if statement.
                const keyId: number|undefined = stringKeyNumberValueMap.get(key);
                if (keyId) {
                    if ((keyId < 0) || (keyId > stringArray.length)) {
                        if (throwIfNotLegal) {
                            throw new Error("(keyId < 0) || (keyId > stringArray.length)");
                        }
                        return false;
                    }
                    const keyRetrieved = stringArray[keyId];
                    if (key !== keyRetrieved) {
                        if (throwIfNotLegal) {
                            throw new Error("key !== keyRetrieved");
                        }
                        return false;
                    }
                } else {
                    if (throwIfNotLegal) {
                        throw new Error("keyId is undefined in stringKeyNumberValueMap");
                    }
                    return false;
                }
            }
        }
        return true;
    }
    public static validateNumberKeyIdInStringKeyNumberValueMap(
        keyId: number,
        stringKeyNumberValueMap: TMapStringKeyGenericValue<number>,
        throwIfNotLegal: boolean = true): boolean {
        if (keyId < 0) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `keyId=${keyId}, small than 0`);
            }
            return false;
        }
        if (keyId >= DictionaryMapUtility.getStringKeyGenericValueMapLength(stringKeyNumberValueMap)) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `keyId=${keyId}, greater or equal to number of keys, ${stringKeyNumberValueMap.size}`);
            }
            return false;
        }
        return true;
    }
    public static validateStringKeyInStringKeyNumberValueMap(
        key: string,
        stringKeyNumberValueMap: TMapStringKeyGenericValue<number>,
        throwIfNotLegal: boolean = true): boolean {
        if (stringKeyNumberValueMap.has(key)) {
            return true;
        } else {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `key=${key}, not in the map: ${Utility.mapToJsonSerialization(stringKeyNumberValueMap)}`);
            }
            return false;
        }
    }

    public static validateStringIdGenericValueDictionaryPair<T>(
        stringIdGenericValueDictionaryFirst: IDictionaryStringIdGenericValue<T>,
        stringIdGenericValueDictionarySecond: IDictionaryStringIdGenericValue<T>,
        throwIfNotLegal: boolean = true): boolean {
        if ((stringIdGenericValueDictionaryFirst == null) && (stringIdGenericValueDictionarySecond == null)) {
            return true;
        }
        if (stringIdGenericValueDictionaryFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringIdGenericValueDictionaryFirst==null");
            }
            return false;
        }
        if (stringIdGenericValueDictionarySecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringIdGenericValueDictionarySecond==null");
            }
            return false;
        }
        const stringIdGenericValueDictionaryFirstLength: number =
            DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringIdGenericValueDictionaryFirst);
        const stringIdGenericValueDictionarySecondLength: number =
            DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringIdGenericValueDictionarySecond);
        if (stringIdGenericValueDictionaryFirstLength !== stringIdGenericValueDictionarySecondLength) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `stringIdGenericValueDictionaryFirstLength|${stringIdGenericValueDictionaryFirstLength}|` +
                    `!=stringIdGenericValueDictionarySecondLength|${stringIdGenericValueDictionarySecondLength}|`);
            }
            return false;
        }
        for (const key in stringIdGenericValueDictionaryFirst) {
            if (key) {
                if (key in stringIdGenericValueDictionarySecond) {
                    if (stringIdGenericValueDictionaryFirst[key] !== stringIdGenericValueDictionarySecond[key]) {
                        if (throwIfNotLegal) {
                            Utility.debuggingThrow(
                                `stringIdGenericValueDictionaryFirst[key]=${key}, ` +
                                `stringIdGenericValueDictionarySecond[key]=${key}`);
                        }
                        return false;
                    }
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in stringIdGenericValueDictionaryFirst, ` +
                            `but not in stringIdGenericValueDictionarySecond`);
                    }
                    return false;
                }
            }
        }
        for (const key in stringIdGenericValueDictionarySecond) {
            if (key) {
                if (key in stringIdGenericValueDictionaryFirst) {
                    if (stringIdGenericValueDictionaryFirst[key] !== stringIdGenericValueDictionarySecond[key]) {
                        if (throwIfNotLegal) {
                            Utility.debuggingThrow(
                                `stringIdGenericValueDictionaryFirst[key]=${key}, ` +
                                `stringIdGenericValueDictionarySecond[key]=${key}`);
                        }
                        return false;
                    }
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in stringIdGenericValueDictionarySecond, ` +
                            `but not in stringIdGenericValueDictionaryFirst`);
                    }
                    return false;
                }
            }
        }
        return true;
    }
    public static validateNumberIdGenericValueDictionaryPair<T>(
        numberIdGenericValueDictionaryFirst: IDictionaryNumberIdGenericValue<T>,
        numberIdGenericValueDictionarySecond: IDictionaryNumberIdGenericValue<T>,
        throwIfNotLegal: boolean = true): boolean {
        if ((numberIdGenericValueDictionaryFirst == null) && (numberIdGenericValueDictionarySecond == null)) {
            return true;
        }
        if (numberIdGenericValueDictionaryFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("numberIdGenericValueDictionaryFirst==null");
            }
            return false;
        }
        if (numberIdGenericValueDictionarySecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("numberIdGenericValueDictionarySecond==null");
            }
            return false;
        }
        const numberIdGenericValueDictionaryFirstLength: number =
            DictionaryMapUtility.getNumberIdGenericValueDictionaryLength(numberIdGenericValueDictionaryFirst);
        const numberIdGenericValueDictionarySecondLength: number =
            DictionaryMapUtility.getNumberIdGenericValueDictionaryLength(numberIdGenericValueDictionarySecond);
        if (numberIdGenericValueDictionaryFirstLength !== numberIdGenericValueDictionarySecondLength) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `numberIdGenericValueDictionaryFirstLength|${numberIdGenericValueDictionaryFirstLength}|` +
                    `!=numberIdGenericValueDictionarySecondLength|${numberIdGenericValueDictionarySecondLength}|`);
            }
            return false;
        }
        for (const key in numberIdGenericValueDictionaryFirst) {
            if (key) {
                if (key in numberIdGenericValueDictionarySecond) {
                    if (numberIdGenericValueDictionaryFirst[key] !== numberIdGenericValueDictionarySecond[key]) {
                        if (throwIfNotLegal) {
                            Utility.debuggingThrow(
                                `numberIdGenericValueDictionaryFirst[key]=${key}, ` +
                                `numberIdGenericValueDictionarySecond[key]=${key}`);
                        }
                        return false;
                    }
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in numberIdGenericValueDictionaryFirst, ` +
                            `but not in numberIdGenericValueDictionarySecond`);
                    }
                    return false;
                }
            }
        }
        for (const key in numberIdGenericValueDictionarySecond) {
            if (key) {
                if (key in numberIdGenericValueDictionaryFirst) {
                    if (numberIdGenericValueDictionaryFirst[key] !== numberIdGenericValueDictionarySecond[key]) {
                        if (throwIfNotLegal) {
                            Utility.debuggingThrow(
                                `numberIdGenericValueDictionaryFirst[key]=${key}, ` +
                                `numberIdGenericValueDictionarySecond[key]=${key}`);
                        }
                        return false;
                    }
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in numberIdGenericValueDictionarySecond, ` +
                            `but not in numberIdGenericValueDictionaryFirst`);
                    }
                    return false;
                }
            }
        }
        return true;
    }
    public static validateStringIdNumberValueDictionaryPair(
        stringIdNumberValueDictionaryFirst: IDictionaryStringIdGenericValue<number>,
        stringIdNumberValueDictionarySecond: IDictionaryStringIdGenericValue<number>,
        throwIfNotLegal: boolean = true): boolean {
        if ((stringIdNumberValueDictionaryFirst === null) && (stringIdNumberValueDictionarySecond === null)) {
            return true;
        }
        if (stringIdNumberValueDictionaryFirst === null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringIdNumberValueDictionaryFirst==null");
            }
            return false;
        }
        if (stringIdNumberValueDictionarySecond === null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringIdNumberValueDictionarySecond==null");
            }
            return false;
        }
        const stringKeyNumberValueDictionaryFirstLength: number =
            DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringIdNumberValueDictionaryFirst);
        const stringKeyNumberValueDictionarySecondLength: number =
            DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringIdNumberValueDictionarySecond);
        if (stringKeyNumberValueDictionaryFirstLength !== stringKeyNumberValueDictionarySecondLength) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `stringKeyNumberValueDictionaryFirstLength|${stringKeyNumberValueDictionaryFirstLength}|` +
                    `!=stringKeyNumberValueDictionarySecondLength|${stringKeyNumberValueDictionarySecondLength}|`);
            }
            return false;
        }
        for (const key in stringIdNumberValueDictionaryFirst) {
            if (key) {
                if (key in stringIdNumberValueDictionarySecond) {
                    if (stringIdNumberValueDictionaryFirst[key] !== stringIdNumberValueDictionarySecond[key]) {
                        if (throwIfNotLegal) {
                            Utility.debuggingThrow(
                                `stringKeyNumberValueDictionaryFirst[key]=${key}, ` +
                                `stringKeyNumberValueDictionarySecond[key]=${key}`);
                        }
                        return false;
                    }
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in stringKeyNumberValueDictionaryFirst, ` +
                            `but not in stringKeyNumberValueDictionarySecond`);
                    }
                    return false;
                }
            }
        }
        for (const key in stringIdNumberValueDictionarySecond) {
            if (key) {
                if (key in stringIdNumberValueDictionaryFirst) {
                    if (stringIdNumberValueDictionaryFirst[key] !== stringIdNumberValueDictionarySecond[key]) {
                        if (throwIfNotLegal) {
                            Utility.debuggingThrow(
                                `stringKeyNumberValueDictionaryFirst[key]=${key}, ` +
                                `stringKeyNumberValueDictionarySecond[key]=${key}`);
                        }
                        return false;
                    }
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in stringKeyNumberValueDictionarySecond, ` +
                            `but not in stringKeyNumberValueDictionaryFirst`);
                    }
                    return false;
                }
            }
        }
        return true;
    }

    public static validateGenericKeyGenericValueMapPair<I, T>(
        genericKeyGenericValueMapFirst: TMapGenericKeyGenericValue<I, T>,
        genericKeyGenericValueMapSecond: TMapGenericKeyGenericValue<I, T>,
        throwIfNotLegal: boolean = true): boolean {
        if ((genericKeyGenericValueMapFirst == null) && (genericKeyGenericValueMapSecond == null)) {
            return true;
        }
        if (genericKeyGenericValueMapFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericKeyGenericValueMapFirst==null");
            }
            return false;
        }
        if (genericKeyGenericValueMapSecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericKeyGenericValueMapSecond==null");
            }
            return false;
        }
        const genericKeyGenericValueMapFirstLength: number =
            DictionaryMapUtility.getGenericKeyGenericValueMapLength(genericKeyGenericValueMapFirst);
        const genericKeyGenericValueMapSecondLength: number =
            DictionaryMapUtility.getGenericKeyGenericValueMapLength(genericKeyGenericValueMapSecond);
        if (genericKeyGenericValueMapFirstLength !== genericKeyGenericValueMapSecondLength) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `genericKeyGenericValueMapFirstLength|${genericKeyGenericValueMapFirstLength}|` +
                    `!=genericKeyGenericValueMapSecondLength|${genericKeyGenericValueMapSecondLength}|`);
            }
            return false;
        }
        for (const key of genericKeyGenericValueMapFirst.keys()) {
            if (key) {
                if (genericKeyGenericValueMapSecond.has(key)) {
                    if (genericKeyGenericValueMapFirst.get(key) !== genericKeyGenericValueMapSecond.get(key)) {
                        if (throwIfNotLegal) {
                            Utility.debuggingThrow(
                                `genericKeyGenericValueMapFirst.get(key)=${genericKeyGenericValueMapFirst.get(key)}, ` +
                                `genericKeyGenericValueMapSecond.get(key)=${genericKeyGenericValueMapSecond.get(key)}`);
                        }
                        return false;
                    }
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in genericKeyGenericValueMapFirst, ` +
                            `but not in genericKeyGenericValueMapSecond`);
                    }
                    return false;
                }
            }
        }
        for (const key of genericKeyGenericValueMapSecond.keys()) {
            if (key) {
                if (genericKeyGenericValueMapFirst.has(key)) {
                    if (genericKeyGenericValueMapFirst.get(key) !== genericKeyGenericValueMapSecond.get(key)) {
                        if (throwIfNotLegal) {
                            Utility.debuggingThrow(
                                `genericKeyGenericValueMapFirst.get(key)=${genericKeyGenericValueMapFirst.get(key)}, ` +
                                `genericKeyGenericValueMapSecond.get(key)=${genericKeyGenericValueMapSecond.get(key)}`);
                        }
                        return false;
                    }
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in genericKeyGenericValueMapSecond, ` +
                            `but not in genericKeyGenericValueMapFirst`);
                    }
                    return false;
                }
            }
        }
        return true;
    }
    public static validateStringKeyGenericValueMapPair<T>(
        stringKeyGenericValueMapFirst: TMapStringKeyGenericValue<T>,
        stringKeyGenericValueMapSecond: TMapStringKeyGenericValue<T>,
        throwIfNotLegal: boolean = true): boolean {
        if ((stringKeyGenericValueMapFirst == null) && (stringKeyGenericValueMapSecond == null)) {
            return true;
        }
        if (stringKeyGenericValueMapFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringKeyGenericValueMapFirst==null");
            }
            return false;
        }
        if (stringKeyGenericValueMapSecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringKeyGenericValueMapSecond==null");
            }
            return false;
        }
        const stringKeyGenericValueMapFirstLength: number =
            DictionaryMapUtility.getGenericKeyGenericValueMapLength(stringKeyGenericValueMapFirst);
        const stringKeyGenericValueMapSecondLength: number =
            DictionaryMapUtility.getGenericKeyGenericValueMapLength(stringKeyGenericValueMapSecond);
        if (stringKeyGenericValueMapFirstLength !== stringKeyGenericValueMapSecondLength) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `stringKeyGenericValueMapFirstLength|${stringKeyGenericValueMapFirstLength}|` +
                    `!=stringKeyGenericValueMapSecondLength|${stringKeyGenericValueMapSecondLength}|`);
            }
            return false;
        }
        for (const key of stringKeyGenericValueMapFirst.keys()) {
            if (key) {
                if (stringKeyGenericValueMapSecond.has(key)) {
                    if (stringKeyGenericValueMapFirst.get(key) !== stringKeyGenericValueMapSecond.get(key)) {
                        if (throwIfNotLegal) {
                            Utility.debuggingThrow(
                                `stringKeyGenericValueMapFirst.get(key)=${stringKeyGenericValueMapFirst.get(key)}, ` +
                                `stringKeyGenericValueMapSecond.get(key)=${stringKeyGenericValueMapSecond.get(key)}`);
                        }
                        return false;
                    }
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in stringKeyGenericValueMapFirst, ` +
                            `but not in stringKeyGenericValueMapSecond`);
                    }
                    return false;
                }
            }
        }
        for (const key of stringKeyGenericValueMapSecond.keys()) {
            if (key) {
                if (stringKeyGenericValueMapFirst.has(key)) {
                    if (stringKeyGenericValueMapFirst.get(key) !== stringKeyGenericValueMapSecond.get(key)) {
                        if (throwIfNotLegal) {
                            Utility.debuggingThrow(
                                `stringKeyGenericValueMapFirst.get(key)=${stringKeyGenericValueMapFirst.get(key)}, ` +
                                `stringKeyGenericValueMapSecond.get(key)=${stringKeyGenericValueMapSecond.get(key)}`);
                        }
                        return false;
                    }
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in stringKeyGenericValueMapSecond, ` +
                            `but not in stringKeyGenericValueMapFirst`);
                    }
                    return false;
                }
            }
        }
        return true;
    }
    public static validateStringKeyNumberValueMapPair(
        stringKeyNumberValueMapFirst: TMapStringKeyGenericValue<number>,
        stringKeyNumberValueMapSecond: TMapStringKeyGenericValue<number>,
        throwIfNotLegal: boolean = true): boolean {
        if ((stringKeyNumberValueMapFirst == null) && (stringKeyNumberValueMapSecond == null)) {
            return true;
        }
        if (stringKeyNumberValueMapFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringKeyNumberValueMapFirst==null");
            }
            return false;
        }
        if (stringKeyNumberValueMapSecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringKeyNumberValueMapSecond==null");
            }
            return false;
        }
        const stringKeyNumberValueMapFirstLength: number =
            DictionaryMapUtility.getStringKeyGenericValueMapLength(stringKeyNumberValueMapFirst);
        const stringKeyNumberValueMapSecondLength: number =
            DictionaryMapUtility.getStringKeyGenericValueMapLength(stringKeyNumberValueMapSecond);
        if (stringKeyNumberValueMapFirstLength !== stringKeyNumberValueMapSecondLength) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `stringKeyNumberValueMapFirstLength|${stringKeyNumberValueMapFirstLength}|` +
                    `!=stringKeyNumberValueMapSecondLength|${stringKeyNumberValueMapSecondLength}|`);
            }
            return false;
        }
        for (const key in stringKeyNumberValueMapFirst) {
            if (key) {
                if (stringKeyNumberValueMapSecond.has(key)) {
                    if (stringKeyNumberValueMapFirst.get(key) !== stringKeyNumberValueMapSecond.get(key)) {
                        if (throwIfNotLegal) {
                            Utility.debuggingThrow(
                                `stringKeyNumberValueMapFirst.get(key)=${stringKeyNumberValueMapFirst.get(key)}, ` +
                                `stringKeyNumberValueMapSecond.get(key)=${stringKeyNumberValueMapSecond.get(key)}`);
                        }
                        return false;
                    }
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in stringKeyNumberValueMapFirst, ` +
                            `but not in stringKeyNumberValueMapSecond`);
                    }
                    return false;
                }
            }
        }
        for (const key in stringKeyNumberValueMapSecond) {
            if (key) {
                if (stringKeyNumberValueMapFirst.has(key)) {
                    if (stringKeyNumberValueMapFirst.get(key) !== stringKeyNumberValueMapSecond.get(key)) {
                        if (throwIfNotLegal) {
                            Utility.debuggingThrow(
                                `stringKeyNumberValueMapFirst.get(key)=${stringKeyNumberValueMapFirst.get(key)}, ` +
                                `stringKeyNumberValueMapSecond.get(key)=${stringKeyNumberValueMapSecond.get(key)}`);
                        }
                        return false;
                    }
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in stringKeyNumberValueMapSecond, ` +
                            `but not in stringKeyNumberValueMapFirst`);
                    }
                    return false;
                }
            }
        }
        return true;
    }

    public static isEmptyStringIdGenericSetDictionary<T>(
        stringIdGenericSetMap: IDictionaryStringIdGenericSet<T>): boolean {
        return !(stringIdGenericSetMap &&
            DictionaryMapUtility.getStringIdGenericSetDictionaryLength(stringIdGenericSetMap) > 0);
    }
    public static isEmptyStringIdGenericValueDictionary<T>(
        stringIdGenericValueMap: IDictionaryStringIdGenericValue<T>): boolean {
        return !(stringIdGenericValueMap &&
            DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringIdGenericValueMap) > 0);
    }
    public static isEmptyStringIdGenericArrayDictionary<T>(
        stringIdGenericArrayMap: IDictionaryStringIdGenericArray<T>): boolean {
        return !(stringIdGenericArrayMap &&
            DictionaryMapUtility.getStringIdGenericArrayDictionaryLength(stringIdGenericArrayMap) > 0);
    }
    public static isEmptyStringIdGenericArraysDictionary<T>(
        stringIdGenericArraysMap: IDictionaryStringIdGenericArrays<T>): boolean {
        return !(stringIdGenericArraysMap &&
            DictionaryMapUtility.getStringIdGenericArraysDictionaryLength(stringIdGenericArraysMap) > 0);
    }
    public static isEmptyNumberIdGenericSetDictionary<T>(
        numberIdGenericSetMap: IDictionaryNumberIdGenericSet<T>): boolean {
        return !(numberIdGenericSetMap &&
            DictionaryMapUtility.getNumberIdGenericSetDictionaryLength(numberIdGenericSetMap) > 0);
    }
    public static isEmptyNumberIdGenericValueDictionary<T>(
        numberIdGenericValueMap: IDictionaryNumberIdGenericValue<T>): boolean {
        return !(numberIdGenericValueMap &&
            DictionaryMapUtility.getNumberIdGenericValueDictionaryLength(numberIdGenericValueMap) > 0);
    }
    public static isEmptyNumberIdGenericArrayDictionary<T>(
        numberIdGenericArrayMap: IDictionaryNumberIdGenericArray<T>): boolean {
        return !(numberIdGenericArrayMap &&
            DictionaryMapUtility.getNumberIdGenericArrayDictionaryLength(numberIdGenericArrayMap) > 0);
    }
    public static isEmptyNumberIdGenericArraysDictionary<T>(
        numberIdGenericArraysMap: IDictionaryNumberIdGenericArrays<T>): boolean {
        return !(numberIdGenericArraysMap &&
            DictionaryMapUtility.getNumberIdGenericArraysDictionaryLength(numberIdGenericArraysMap) > 0);
    }

    public static isEmptyAnyKeyGenericSetMap<T>(
        anyKeyGenericSetMap: TMapAnyKeyGenericSet<T>): boolean {
        return !(anyKeyGenericSetMap &&
            DictionaryMapUtility.getAnyKeyGenericSetMapLength(anyKeyGenericSetMap) > 0);
    }
    public static isEmptyAnyKeyGenericValueMap<T>(
        anyKeyGenericValueMap: TMapAnyKeyGenericValue<T>): boolean {
        return !(anyKeyGenericValueMap &&
            DictionaryMapUtility.getAnyKeyGenericValueMapLength(anyKeyGenericValueMap) > 0);
    }
    public static isEmptyAnyKeyGenericArrayMap<T>(
        anyKeyGenericArrayMap: TMapAnyKeyGenericArray<T>): boolean {
        return !(anyKeyGenericArrayMap &&
            DictionaryMapUtility.getAnyKeyGenericArrayMapLength(anyKeyGenericArrayMap) > 0);
    }
    public static isEmptyAnyKeyGenericArraysMap<T>(
        anyKeyGenericArraysMap: TMapAnyKeyGenericArrays<T>): boolean {
        return !(anyKeyGenericArraysMap &&
            DictionaryMapUtility.getAnyKeyGenericArraysMapLength(anyKeyGenericArraysMap) > 0);
    }
    public static isEmptyGenericKeyGenericSetMap<I, T>(
        genericKeyGenericSetMap: TMapGenericKeyGenericSet<I, T>): boolean {
        return !(genericKeyGenericSetMap &&
            DictionaryMapUtility.getGenericKeyGenericSetMapLength(genericKeyGenericSetMap) > 0);
    }
    public static isEmptyGenericKeyGenericValueMap<I, T>(
        genericKeyGenericValueMap: TMapGenericKeyGenericValue<I, T>): boolean {
        return !(genericKeyGenericValueMap &&
            DictionaryMapUtility.getGenericKeyGenericValueMapLength(genericKeyGenericValueMap) > 0);
    }
    public static isEmptyGenericKeyGenericArrayMap<I, T>(
        genericKeyGenericArrayMap: TMapGenericKeyGenericArray<I, T>): boolean {
        return !(genericKeyGenericArrayMap &&
            DictionaryMapUtility.getGenericKeyGenericArrayMapLength(genericKeyGenericArrayMap) > 0);
    }
    public static isEmptyGenericKeyGenericArraysMap<I, T>(
        genericKeyGenericArraysMap: TMapGenericKeyGenericArrays<I, T>): boolean {
        return !(genericKeyGenericArraysMap &&
            DictionaryMapUtility.getGenericKeyGenericArraysMapLength(genericKeyGenericArraysMap) > 0);
    }
    public static isEmptyNumberKeyGenericSetMap<T>(
        numberKeyGenericSetMap: TMapNumberKeyGenericSet<T>): boolean {
        return !(numberKeyGenericSetMap &&
            DictionaryMapUtility.getNumberKeyGenericSetMapLength(numberKeyGenericSetMap) > 0);
    }
    public static isEmptyNumberKeyGenericValueMap<T>(
        numberKeyGenericValueMap: TMapNumberKeyGenericValue<T>): boolean {
        return !(numberKeyGenericValueMap &&
            DictionaryMapUtility.getNumberKeyGenericValueMapLength(numberKeyGenericValueMap) > 0);
    }
    public static isEmptyNumberKeyGenericArrayMap<T>(
        numberKeyGenericArrayMap: TMapNumberKeyGenericArray<T>): boolean {
        return !(numberKeyGenericArrayMap &&
            DictionaryMapUtility.getNumberKeyGenericArrayMapLength(numberKeyGenericArrayMap) > 0);
    }
    public static isEmptyNumberKeyGenericArraysMap<T>(
        numberKeyGenericArraysMap: TMapNumberKeyGenericArrays<T>): boolean {
        return !(numberKeyGenericArraysMap &&
            DictionaryMapUtility.getNumberKeyGenericArraysMapLength(numberKeyGenericArraysMap) > 0);
    }
    public static isEmptyStringKeyGenericSetMap<T>(
        stringKeyGenericSetMap: TMapStringKeyGenericSet<T>): boolean {
        return !(stringKeyGenericSetMap &&
            DictionaryMapUtility.getStringKeyGenericSetMapLength(stringKeyGenericSetMap) > 0);
    }
    public static isEmptyStringKeyGenericValueMap<T>(
        stringKeyGenericValueMap: TMapStringKeyGenericValue<T>): boolean {
        return !(stringKeyGenericValueMap &&
            DictionaryMapUtility.getStringKeyGenericValueMapLength(stringKeyGenericValueMap) > 0);
    }
    public static isEmptyStringKeyGenericArrayMap<T>(
        stringKeyGenericArrayMap: TMapStringKeyGenericArray<T>): boolean {
        return !(stringKeyGenericArrayMap &&
            DictionaryMapUtility.getStringKeyGenericArrayMapLength(stringKeyGenericArrayMap) > 0);
    }
    public static isEmptyStringKeyGenericArraysMap<T>(
        stringKeyGenericArraysMap: TMapStringKeyGenericArrays<T>): boolean {
        return !(stringKeyGenericArraysMap &&
            DictionaryMapUtility.getStringKeyGenericArraysMapLength(stringKeyGenericArraysMap) > 0);
    }

    public static getStringIdGenericSetDictionaryLength<T>(map: IDictionaryStringIdGenericSet<T>): number {
        return (Object.keys(map).length);
    }
    public static getNumberIdGenericSetDictionaryLength<T>(map: IDictionaryNumberIdGenericSet<T>): number {
        return (Object.keys(map).length);
    }
    public static getStringIdGenericValueDictionaryLength<T>(map: IDictionaryStringIdGenericValue<T>): number {
        return (Object.keys(map).length);
    }
    public static getNumberIdGenericValueDictionaryLength<T>(map: IDictionaryNumberIdGenericValue<T>): number {
        return (Object.keys(map).length);
    }
    public static getStringIdGenericArrayDictionaryLength<T>(map: IDictionaryStringIdGenericArray<T>): number {
        return (Object.keys(map).length);
    }
    public static getNumberIdGenericArrayDictionaryLength<T>(map: IDictionaryNumberIdGenericArray<T>): number {
        return (Object.keys(map).length);
    }
    public static getStringIdGenericArraysDictionaryLength<T>(map: IDictionaryStringIdGenericArrays<T>): number {
        return (Object.keys(map).length);
    }
    public static getNumberIdGenericArraysDictionaryLength<T>(map: IDictionaryNumberIdGenericArrays<T>): number {
        return (Object.keys(map).length);
    }

    public static getAnyKeyGenericSetMapLength<T>(map: TMapAnyKeyGenericSet<T>): number {
        return [...map].length;
    }
    public static getGenericKeyGenericSetMapLength<I, T>(map: TMapGenericKeyGenericSet<I, T>): number {
        return [...map].length;
    }
    public static getNumberKeyGenericSetMapLength<T>(map: TMapNumberKeyGenericSet<T>): number {
        return [...map].length;
    }
    public static getStringKeyGenericSetMapLength<T>(map: TMapStringKeyGenericSet<T>): number {
        return [...map].length;
    }
    public static getAnyKeyGenericValueMapLength<T>(map: TMapAnyKeyGenericValue<T>): number {
        return [...map].length;
    }
    public static getGenericKeyGenericValueMapLength<I, T>(map: TMapGenericKeyGenericValue<I, T>): number {
        return [...map].length;
    }
    public static getNumberKeyGenericValueMapLength<T>(map: TMapNumberKeyGenericValue<T>): number {
        return [...map].length;
    }
    public static getStringKeyGenericValueMapLength<T>(map: TMapStringKeyGenericValue<T>): number {
        return [...map].length;
    }
    public static getAnyKeyGenericArrayMapLength<T>(map: TMapAnyKeyGenericArray<T>): number {
        return [...map].length;
    }
    public static getGenericKeyGenericArrayMapLength<I, T>(map: TMapGenericKeyGenericArray<I, T>): number {
        return [...map].length;
    }
    public static getNumberKeyGenericArrayMapLength<T>(map: TMapNumberKeyGenericArray<T>): number {
        return [...map].length;
    }
    public static getStringKeyGenericArrayMapLength<T>(map: TMapStringKeyGenericArray<T>): number {
        return [...map].length;
    }
    public static getAnyKeyGenericArraysMapLength<T>(map: TMapAnyKeyGenericArrays<T>): number {
        return [...map].length;
    }
    public static getGenericKeyGenericArraysMapLength<I, T>(map: TMapGenericKeyGenericArrays<I, T>): number {
        return (Object.keys(map).length);
    }
    public static getNumberKeyGenericArraysMapLength<T>(map: TMapNumberKeyGenericArrays<T>): number {
        return [...map].length;
    }
    public static getStringKeyGenericArraysMapLength<T>(map: TMapStringKeyGenericArrays<T>): number {
        return [...map].length;
    }

    public static newTMapAnyKeyGenericSet<T>(): TMapAnyKeyGenericSet<T> {
        return new Map<any, Set<T>>();
    }
    public static newTMapGenericKeyGenericSet<I, T>(): TMapGenericKeyGenericSet<I, T> {
        return new Map<I, Set<T>>();
    }
    public static newTMapNumberKeyGenericSet<T>(): TMapNumberKeyGenericSet<T> {
        return new Map<number, Set<T>>();
    }
    public static newTMapStringKeyGenericSet<T>(): TMapStringKeyGenericSet<T> {
        return new Map<string, Set<T>>();
    }
    public static newTMapAnyKeyGenericValue<T>(): TMapAnyKeyGenericValue<T> {
        return new Map<any, T>();
    }
    public static newTMapGenericKeyGenericValue<I, T>(): TMapGenericKeyGenericValue<I, T> {
        return new Map<I, T>();
    }
    public static newTMapNumberKeyGenericValue<T>(): TMapNumberKeyGenericValue<T> {
        return new Map<number, T>();
    }
    public static newTMapStringKeyGenericValue<T>(): TMapStringKeyGenericValue<T> {
        return new Map<string, T>();
    }
    public static newTMapAnyKeyGenericArray<T>(): TMapAnyKeyGenericArray<T> {
        return new Map<any, T[]>();
    }
    public static newTMapGenericKeyGenericArray<I, T>(): TMapGenericKeyGenericArray<I, T> {
        return new Map<I, T[]>();
    }
    public static newTMapNumberKeyGenericArray<T>(): TMapNumberKeyGenericArray<T> {
        return new Map<number, T[]>();
    }
    public static newTMapStringKeyGenericArray<T>(): TMapStringKeyGenericArray<T> {
        return new Map<string, T[]>();
    }
    public static newTMapAnyKeyGenericArrays<T>(): TMapAnyKeyGenericArrays<T> {
        return new Map<any, T[][]>();
    }
    public static newTMapGenericKeyGenericArrays<I, T>(): TMapGenericKeyGenericArrays<I, T> {
        return new Map<I, T[][]>();
    }
    public static newTMapNumberKeyGenericArrays<T>(): TMapNumberKeyGenericArrays<T> {
        return new Map<number, T[][]>();
    }
    public static newTMapStringKeyGenericArrays<T>(): TMapStringKeyGenericArrays<T> {
        return new Map<string, T[][]>();
    }
}
