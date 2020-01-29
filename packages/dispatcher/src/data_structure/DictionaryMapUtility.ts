/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TMapGenericKeyGenericArray } from "./TMapGenericKeyGenericArray";
import { TMapGenericKeyGenericArrays } from "./TMapGenericKeyGenericArrays";
import { TMapGenericKeyGenericValue } from "./TMapGenericKeyGenericValue";
import { TMapStringKeyGenericArray } from "./TMapStringKeyGenericArray";
import { TMapStringKeyGenericArrays } from "./TMapStringKeyGenericArrays";
import { TMapStringKeyGenericValue } from "./TMapStringKeyGenericValue";
import { TMapNumberKeyGenericArray } from "./TMapNumberKeyGenericArray";
import { TMapNumberKeyGenericArrays } from "./TMapNumberKeyGenericArrays";
import { TMapNumberKeyGenericValue } from "./TMapNumberKeyGenericValue";

import { IDictionaryNumberIdGenericArray } from "../data_structure/IDictionaryNumberIdGenericArray";
import { IDictionaryNumberIdGenericArrays } from "../data_structure/IDictionaryNumberIdGenericArrays";
import { IDictionaryNumberIdGenericValue } from "../data_structure/IDictionaryNumberIdGenericValue";
import { IDictionaryStringIdGenericArray } from "../data_structure/IDictionaryStringIdGenericArray";
import { IDictionaryStringIdGenericArrays } from "../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../data_structure/IDictionaryStringIdGenericValue";

import { Utility } from "../utility/Utility";

export class DictionaryMapUtility {

    public static buildStringIdNumberValueDictionaryFromUniqueStringArray(
        stringArray: string[]): IDictionaryStringIdGenericValue<number> {
        const stringMap: IDictionaryStringIdGenericValue<number> = { };
        for (let index: number = 0; index < stringArray.length; index++) {
            stringMap[stringArray[index]] = index;
        }
        return stringMap;
    }
    public static buildStringIdNumberValueDictionaryFromStringArray(
        strings: string[]):
        { "stringArray": string[], "stringMap": IDictionaryStringIdGenericValue<number> } {
        const stringSet: Set<string> = new Set(strings);
        const stringArray: string[] = Array.from(stringSet.values());
        const stringMap: IDictionaryStringIdGenericValue<number> =
            DictionaryMapUtility.buildStringIdNumberValueDictionaryFromUniqueStringArray(stringArray);
        return { stringArray, stringMap };
    }
    public static buildStringIdNumberValueDictionaryFromStringArrays(
        stringArrays: string[][]): { "stringArray": string[], "stringMap": IDictionaryStringIdGenericValue<number> } {
        const stringSet: Set<string> = new Set();
        for (const elementStringArray of stringArrays) {
            for (const elementString of elementStringArray) {
                stringSet.add(elementString);
            }
        }
        const stringArray: string[] = Array.from(stringSet.values());
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
                    "stringArray.length|" +
                    stringIdNumberValueDictionary.length +
                    "| !== stringIdNumberValueDictionary.length|" +
                    DictionaryMapUtility.getStringIdGenericValueDictionaryLength(stringIdNumberValueDictionary) + "|");
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
                        throw new Error("(keyId<0)||(keyId>stringArray.length)");
                    }
                    return false;
                }
                const keyRetrieved = stringArray[keyId];
                if (key !== keyRetrieved) {
                    if (throwIfNotLegal) {
                        throw new Error("key!==keyRetrieved");
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

    public static buildStringKeyNumberValueMapFromUniqueStringArray(
        stringArray: string[]): TMapStringKeyGenericValue<number> {
        const stringMap: TMapStringKeyGenericValue<number> = DictionaryMapUtility.newTMapStringKeyGenericValue();
        for (let index: number = 0; index < stringArray.length; index++) {
            stringMap.set(stringArray[index], index);
        }
        return stringMap;
    }
    public static buildStringKeyNumberValueMapFromStringArray(
        strings: string[]):
        { "stringArray": string[], "stringMap": TMapStringKeyGenericValue<number> } {
        const stringSet: Set<string> = new Set(strings);
        const stringArray: string[] = Array.from(stringSet.values());
        const stringMap: TMapStringKeyGenericValue<number> =
            DictionaryMapUtility.buildStringKeyNumberValueMapFromUniqueStringArray(stringArray);
        return { stringArray, stringMap };
    }
    public static buildStringKeyNumberValueMapFromStringArrays(
        stringArrays: string[][]): { "stringArray": string[], "stringMap": TMapStringKeyGenericValue<number> } {
        const stringSet: Set<string> = new Set();
        for (const elementStringArray of stringArrays) {
            for (const elementString of elementStringArray) {
                stringSet.add(elementString);
            }
        }
        const stringArray: string[] = Array.from(stringSet.values());
        const stringMap: TMapStringKeyGenericValue<number> =
            DictionaryMapUtility.buildStringKeyNumberValueMapFromUniqueStringArray(stringArray);
        return { stringArray, stringMap };
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
        if (key in stringKeyNumberValueMap) {
            return true;
        } else {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `key=${key}, not int the map: ${Utility.mapToJsonSerialization(stringKeyNumberValueMap)}`);
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
        if ((stringIdNumberValueDictionaryFirst == null) && (stringIdNumberValueDictionarySecond == null)) {
            return true;
        }
        if (stringIdNumberValueDictionaryFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringKeyNumberValueDictionaryFirst==null");
            }
            return false;
        }
        if (stringIdNumberValueDictionarySecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringKeyNumberValueDictionarySecond==null");
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
                if (key in stringKeyNumberValueMapSecond) {
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
                if (key in stringKeyNumberValueMapFirst) {
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

    public static getGenericKeyGenericValueMapLength<I, T>(map: TMapGenericKeyGenericValue<I, T>): number {
        return [...map].length;
    }
    public static getStringKeyGenericValueMapLength<T>(map: TMapStringKeyGenericValue<T>): number {
        return [...map].length;
    }
    public static getNumberKeyGenericValueMapLength<T>(map: TMapNumberKeyGenericValue<T>): number {
        return [...map].length;
    }
    public static getGenericKeyGenericArrayMapLength<I, T>(map: TMapGenericKeyGenericArray<I, T>): number {
        return [...map].length;
    }
    public static getStringKeyGenericArrayMapLength<T>(map: TMapStringKeyGenericArray<T>): number {
        return [...map].length;
    }
    public static getNumberKeyGenericArrayMapLength<T>(map: TMapNumberKeyGenericArray<T>): number {
        return [...map].length;
    }
    public static getGenericKeyGenericArraysMapLength<I, T>(map: TMapGenericKeyGenericArrays<I, T>): number {
        return (Object.keys(map).length);
    }
    public static getStringKeyGenericArraysMapLength<T>(map: TMapStringKeyGenericArrays<T>): number {
        return [...map].length;
    }
    public static getNumberKeyGenericArraysMapLength<T>(map: TMapNumberKeyGenericArrays<T>): number {
        return [...map].length;
    }

    public static newTMapGenericKeyGenericValue<I, T>(): TMapGenericKeyGenericValue<I, T> {
        return new Map<I, T>();
    }
    public static newTMapStringKeyGenericValue<T>(): TMapStringKeyGenericValue<T> {
        return new Map<string, T>();
    }
    public static newTMapNumberKeyGenericValue<T>(): TMapNumberKeyGenericValue<T> {
        return new Map<number, T>();
    }
    public static newTMapGenericKeyGenericArray<I, T>(): TMapGenericKeyGenericArray<I, T> {
        return new Map<I, T[]>();
    }
    public static newTMapStringKeyGenericArray<T>(): TMapStringKeyGenericArray<T> {
        return new Map<string, T[]>();
    }
    public static newTMapNumberKeyGenericArray<T>(): TMapNumberKeyGenericArray<T> {
        return new Map<number, T[]>();
    }
    public static newTMapGenericKeyGenericArrays<I, T>(): TMapGenericKeyGenericArrays<I, T> {
        return new Map<I, T[][]>();
    }
    public static newTMapStringKeyGenericArrays<T>(): TMapStringKeyGenericArrays<T> {
        return new Map<string, T[][]>();
    }
    public static newTMapNumberKeyGenericArrays<T>(): TMapNumberKeyGenericArrays<T> {
        return new Map<number, T[][]>();
    }
}
