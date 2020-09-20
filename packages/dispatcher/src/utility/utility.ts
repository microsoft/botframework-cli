/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from "path";
import * as fs from "fs";
import * as md5 from "ts-md5";

import { DictionaryMapUtility } from "../data_structure/DictionaryMapUtility";

export class Utility {

    public static toPrintDebuggingLogToConsole: boolean = false;

    public static epsilon: number = 0.0001;
    public static epsilonRough: number = 0.01;

    public static readonly LanguageTokenPunctuationDelimiters: string[] = [
        // ---- // ---- "\0",
        // ---- // ---- "\u0001",
        // ---- // ---- "\u0002",
        // ---- // ---- "\u0003",
        // ---- // ---- "\u0004",
        // ---- // ---- "\u0005",
        // ---- // ---- "\u0006",
        // ---- // ---- "\a",
        // ---- // ---- "\b",
        // ---- // ---- "\t",
        // ---- // ---- "\n",
        // ---- // ---- "\v",
        // ---- // ---- "\f",
        // ---- // ---- "\r",
        // ---- // ---- "\u000E",
        // ---- // ---- "\u000F",
        // ---- // ---- "\u0010",
        // ---- // ---- "\u0011",
        // ---- // ---- "\u0012",
        // ---- // ---- "\u0013",
        // ---- // ---- "\u0014",
        // ---- // ---- "\u0015",
        // ---- // ---- "\u0016",
        // ---- // ---- "\u0017",
        // ---- // ---- "\u0018",
        // ---- // ---- "\u0019",
        // ---- // ---- "\u001A",
        // ---- // ---- "\u001B",
        // ---- // ---- "\u001C",
        // ---- // ---- "\u001D",
        // ---- // ---- "\u001E",
        // ---- // ---- "\u001F",
        // ---- // ---- " ",
        "!",
        "\"",
        "#",
        "$",
        "%",
        "&",
        "\"",
        "(",
        ")",
        "*",
        "+",
        ",",
        "-",
        ".",
        "/",
        ":",
        ";",
        "<",
        "=",
        ">",
        "?",
        "@",
        "[",
        "\\",
        "]",
        "^",
        "`",
        "{",
        "|",
        "}",
        "~",
        // ---- // ---- "\u007F"
    ];

    public static readonly LanguageTokenPunctuationDelimitersSet: Set<string> =
        new Set(Utility.LanguageTokenPunctuationDelimiters);

    public static readonly LanguageTokenPunctuationReplacementDelimiters: string[] = [
        // ---- // ---- " \0 ",
        // ---- // ---- " \u0001 ",
        // ---- // ---- " \u0002 ",
        // ---- // ---- " \u0003 ",
        // ---- // ---- " \u0004 ",
        // ---- // ---- " \u0005 ",
        // ---- // ---- " \u0006 ",
        // ---- // ---- " \a ",
        // ---- // ---- " \b ",
        // ---- // ---- " \t ",
        // ---- // ---- " \n ",
        // ---- // ---- " \v ",
        // ---- // ---- " \f ",
        // ---- // ---- " \r ",
        // ---- // ---- " \u000E ",
        // ---- // ---- " \u000F ",
        // ---- // ---- " \u0010 ",
        // ---- // ---- " \u0011 ",
        // ---- // ---- " \u0012 ",
        // ---- // ---- " \u0013 ",
        // ---- // ---- " \u0014 ",
        // ---- // ---- " \u0015 ",
        // ---- // ---- " \u0016 ",
        // ---- // ---- " \u0017 ",
        // ---- // ---- " \u0018 ",
        // ---- // ---- " \u0019 ",
        // ---- // ---- " \u001A ",
        // ---- // ---- " \u001B ",
        // ---- // ---- " \u001C ",
        // ---- // ---- " \u001D ",
        // ---- // ---- " \u001E ",
        // ---- // ---- " \u001F ",
        // ---- // ---- " ",
        " ! ",
        " \" ",
        " # ",
        " $ ",
        " % ",
        " & ",
        " \" ",
        " ( ",
        " ) ",
        " * ",
        " + ",
        " , ",
        " - ",
        " . ",
        " / ",
        " : ",
        " ; ",
        " < ",
        " = ",
        " > ",
        " ? ",
        " @ ",
        " [ ",
        " \\ ",
        " ] ",
        " ^ ",
        " ` ",
        " { ",
        " | ",
        " } ",
        " ~ ",
        // ---- // ---- " \u007F "
    ];

    public static readonly LanguageTokenSpaceDelimiters: string[] = [
        "\0",
        "\u0001",
        "\u0002",
        "\u0003",
        "\u0004",
        "\u0005",
        "\u0006",
        "\a",
        "\b",
        "\t",
        "\n",
        "\v",
        "\f",
        "\r",
        "\u000E",
        "\u000F",
        "\u0010",
        "\u0011",
        "\u0012",
        "\u0013",
        "\u0014",
        "\u0015",
        "\u0016",
        "\u0017",
        "\u0018",
        "\u0019",
        "\u001A",
        "\u001B",
        "\u001C",
        "\u001D",
        "\u001E",
        "\u001F",
        " ",
        // ---- // ---- "!",
        // ---- // ---- "\"",
        // ---- // ---- "#",
        // ---- // ---- "$",
        // ---- // ---- "%",
        // ---- // ---- "&",
        // ---- // ---- "\"",
        // ---- // ---- "(",
        // ---- // ---- ")",
        // ---- // ---- "*",
        // ---- // ---- "+",
        // ---- // ---- ",",
        // ---- // ---- "-",
        // ---- // ---- ".",
        // ---- // ---- "/",
        // ---- // ---- ":",
        // ---- // ---- ";",
        // ---- // ---- "<",
        // ---- // ---- "=",
        // ---- // ---- ">",
        // ---- // ---- "?",
        // ---- // ---- "@",
        // ---- // ---- "[",
        // ---- // ---- "\\",
        // ---- // ---- "]",
        // ---- // ---- "^",
        // ---- // ---- "`",
        // ---- // ---- "{",
        // ---- // ---- "|",
        // ---- // ---- "}",
        // ---- // ---- "~",
        "\u007F",
    ];

    public static LanguageTokenSpaceDelimitersSet: Set<string> =
        new Set(Utility.LanguageTokenSpaceDelimiters);

    public static incrementKeyValueNumberMap<K>(
        keyNumberMap: Map<K, number>,
        key: K,
        value: number = 1): void {
        if (keyNumberMap.has(key)) {
            const existedValue: number = keyNumberMap.get(key) as number;
            keyNumberMap.set(key, existedValue + value);
        } else {
            keyNumberMap.set(key, value);
        }
    }
    public static addKeyValueToNumberMapSet<K>(
        keyNumberMapSet: Map<K, Set<number>>,
        key: K,
        value: number): void {
        if (keyNumberMapSet.has(key)) {
            const numberSet: Set<number> = keyNumberMapSet.get(key) as Set<number>;
            numberSet.add(value);
        } else {
            const numberSet: Set<number> = new Set<number>();
            numberSet.add(value);
            keyNumberMapSet.set(key, numberSet);
        }
    }
    public static addToNumberMapSet<K>(
        keyNumberMapSetTo: Map<K, Set<number>>,
        keyNumberMapSetFrom: Map<K, Set<number>>,
        limit: number = -1): void {
        for (const key of keyNumberMapSetFrom.keys()) {
            const valueSetFrom: Set<number> =
                keyNumberMapSetFrom.get(key) as Set<number>;
            for (const value of valueSetFrom) {
                const valueSetTo: Set<number> =
                    keyNumberMapSetTo.get(key) as Set<number>;
                if (limit >= 0) {
                    const existingNumbers: number =
                        valueSetTo.size;
                    if (existingNumbers < limit) {
                        valueSetTo.add(value);
                    }
                } else {
                    valueSetTo.add(value);
                }
            }
        }
    }
    public static addKeyValueToNumberMapArray<K>(
        keyNumberMapArray: Map<K, number[]>,
        key: K,
        value: number): void {
        if (keyNumberMapArray.has(key)) {
            const numberArray: number[] = keyNumberMapArray.get(key) as number[];
            numberArray.push(value);
        } else {
            const numberArray: number[] = [];
            numberArray.push(value);
            keyNumberMapArray.set(key, numberArray);
        }
    }
    public static addToNumberMapArray<K>(
        keyNumberMapArrayTo: Map<K, number[]>,
        keyNumberMapArrayFrom: Map<K, number[]>,
        limit: number = -1): void {
        for (const key of keyNumberMapArrayFrom.keys()) {
            const valueArrayFrom: number[] =
                keyNumberMapArrayFrom.get(key) as number[];
            for (const value of valueArrayFrom) {
                const valueArrayTo: number[] =
                    keyNumberMapArrayTo.get(key) as number[];
                if (limit >= 0) {
                    const existingNumbers: number =
                        valueArrayTo.length;
                    if (existingNumbers < limit) {
                        valueArrayTo.push(value);
                    }
                } else {
                    valueArrayTo.push(value);
                }
            }
        }
    }

    public static mapToJsonSerialization<K, V>(map: Map<K, V>): string {
        return Utility.jsonStringify([...map]);
    }
    public static jsonSerializationToMap<K, V>(jsonString: string): Map<K, V> {
        const jsonParsedObject: any = JSON.parse(jsonString);
        return new Map<K, V>(jsonParsedObject);
    }
    public static setToJsonSerialization<T>(set: Set<T>): string {
        return Utility.jsonStringify([...set]);
    }
    public static jsonSerializationToSet<T>(jsonString: string): Set<T> {
        return new Set<T>(JSON.parse(jsonString));
    }
    public static arrayToJsonSerialization<T>(set: T[]): string {
        return Utility.jsonStringify([...set]);
    }
    public static jsonSerializationToArray<T>(jsonString: string): T[] {
        return new Array<T>(JSON.parse(jsonString));
    }

    public static stringMapToObject<V>(stringMap: Map<string, V>): any {
        const obj = Object.create(null);
        for (const [key, value] of stringMap) {
            // ---- We don't escape the key '__proto__'
            // ---- which can cause problems on older engines
            obj[key] = value;
        }
        return obj;
    }
    public static objectToStringMap<V>(obj: any): Map<string, V> {
        const stringMap = new Map<string, V>();
        for (const key of Object.keys(obj)) {
            stringMap.set(key, obj[key]);
        }
        return stringMap;
    }

    public static stringMapToJson<V>(stringMap: Map<string, V>): string {
        return JSON.stringify(Utility.stringMapToObject<V>(stringMap));
    }
    public static jsonToStringMap<V>(jsonString: string): Map<string, V> {
        return Utility.objectToStringMap<V>(JSON.parse(jsonString));
    }

    public static stringMapSetToObject<V>(stringMapSet: Map<string, Set<V>>): any {
        const obj = Object.create(null);
        for (const key of stringMapSet.keys()) {
            const value: Set<V> = stringMapSet.get(key) as Set<V>;
            obj[key] = Utility.setToJsonSerialization(value);
        }
        return obj;
    }
    public static objectToStringMapSet<V>(obj: any): Map<string, Set<V>> {
        const stringMapSet = new Map<string, Set<V>>();
        for (const key of Object.keys(obj)) {
            // ---- Utility.debuggingLog(`key=${key}`);
            // ---- Utility.debuggingLog(`value=${obj[key]}`);
            const valueSet: Set<V> = Utility.jsonSerializationToSet(obj[key]);
            stringMapSet.set(key, valueSet);
        }
        return stringMapSet;
    }
    public static stringMapArrayToObject<V>(stringMapArray: Map<string, V[]>): any {
        const obj = Object.create(null);
        for (const key of stringMapArray.keys()) {
            const value: V[] = stringMapArray.get(key) as V[];
            obj[key] = Utility.arrayToJsonSerialization(value);
        }
        return obj;
    }
    public static objectToStringMapArray<V>(obj: any): Map<string, V[]> {
        const stringMapArray = new Map<string, V[]>();
        for (const key of Object.keys(obj)) {
            const valueArray: V[] = Utility.jsonSerializationToArray(obj[key]);
            stringMapArray.set(key, valueArray);
        }
        return stringMapArray;
    }

    public static stringMapSetToJson<V>(stringMapSet: Map<string, Set<V>>): string {
        return Utility.jsonStringify(Utility.stringMapSetToObject<V>(stringMapSet));
    }
    public static jsonToStringMapSet<V>(jsonString: string): Map<string, Set<V>> {
        return Utility.objectToStringMapSet<V>(JSON.parse(jsonString));
    }
    public static stringMapArrayToJson<V>(stringMapArray: Map<string, V[]>): string {
        return Utility.jsonStringify(Utility.stringMapArrayToObject<V>(stringMapArray));
    }
    public static jsonToStringMapArray<V>(jsonString: string): Map<string, V[]> {
        return Utility.objectToStringMapArray<V>(JSON.parse(jsonString));
    }

    // ---- NOTE-REFERENCE:
    // https://github.com/v8/v8/blob/085fed0fb5c3b0136827b5d7c190b4bd1c23a23e/src/base
    // /utils/random-number-generator.h#L102
    public static getXorshift128plusState0(): number {
        return Utility.xorshift128plusState0;
    }
    public static getXorshift128plusState1(): number {
        return Utility.xorshift128plusState1;
    }
    public static rngSeedXorshift128plus(
        newState0: number,
        newState1: number,
        inputRngBurninIterations: number = -1): void {
        if (inputRngBurninIterations < 0) {
            inputRngBurninIterations = Utility.rngBurninIterations;
        }
        Utility.xorshift128plusState0 = newState0;
        Utility.xorshift128plusState1 = newState1;
        for (let i: number = 0; i < inputRngBurninIterations; i++) {
            Utility.rngNextXorshift128plusDirect();
        }
        Utility.rngBurninDone = true;
    }
    public static rngNextXorshift128plusDirect(): number {
        let s1: number = Utility.xorshift128plusState0;
        const s0: number = Utility.xorshift128plusState1;
        Utility.xorshift128plusState0 = s0;
        Utility.xorshift128plusState0 %= Number.MAX_SAFE_INTEGER;
        // tslint:disable-next-line: no-bitwise
        s1 ^= s1 << 23;
        // tslint:disable-next-line: no-bitwise
        s1 ^= s1 >> 17;
        // tslint:disable-next-line: no-bitwise
        s1 ^= s0;
        // tslint:disable-next-line: no-bitwise
        s1 ^= s0 >> 26;
        Utility.xorshift128plusState1 = s1;
        Utility.xorshift128plusState1 %= Number.MAX_SAFE_INTEGER;
        let result: number = Utility.xorshift128plusState0 + Utility.xorshift128plusState1;
        result %= Number.MAX_SAFE_INTEGER;
        return result;
    }
    public static rngNextXorshift128plus(
        inputRngBurninIterations: number = -1): number {
        if (inputRngBurninIterations < 0) {
            inputRngBurninIterations = Utility.rngBurninIterations;
        }
        if (!Utility.rngBurninDone) {
            for (let i: number = 0; i < inputRngBurninIterations; i++) {
                Utility.rngNextXorshift128plusDirect();
            }
            Utility.rngBurninDone = true;
        }
        return Utility.rngNextXorshift128plusDirect();
    }
    public static rngNextXorshift128plusWithNumberStates(): number {
        if (!Utility.rngBurninDone) {
            for (let i: number = 0; i < Utility.rngBurninIterations; i++) {
                Utility.rngNextXorshift128plusDirect();
            }
            Utility.rngBurninDone = true;
        }
        return Utility.rngNextXorshift128plusDirect();
    }
    public static rngNextXorshift128plusFloatWithNumberStates(): number {
        const result: number = Utility.rngNextXorshift128plus();
        return (result / Number.MAX_SAFE_INTEGER);
    }
    public static seedRandomNumberGeneratorWithNumberStates(
        newState0: number,
        newState1: number,
        inputRngBurninIterationsForBigInt: number = -1): void {
        Utility.rngSeedXorshift128plus(
            newState0,
            newState1,
            inputRngBurninIterationsForBigInt);
    }
    public static getRandomNumberWithNumberStates(): number {
        return Utility.rngNextXorshift128plusFloatWithNumberStates();
    }

    public static getRandomIntWithNumberStates(limit: number): number {
        return Utility.getRandomIntFromIntLimitWithNumberStates(limit);
    }
    public static getRandomIntFromFloatLimitWithNumberStates(limit: number): number {
        let randomFloat: number =
            Utility.getRandomNumberWithNumberStates() * limit;
        if (randomFloat >= limit) {
            randomFloat = limit - Utility.epsilon;
        }
        const randomInt: number = Math.floor(
            randomFloat);
        return randomInt;
    }
    public static getRandomIntFromIntLimitWithNumberStates(limit: number): number {
        let randomInt: number = Math.floor(
            Utility.getRandomNumberWithNumberStates() * Math.floor(limit));
        if (randomInt >= limit) {
            randomInt = limit - 1;
        }
        return randomInt;
    }

    public static getXorshift128plusState0WithBigIntStates(): bigint {
        return Utility.xorshift128plusState0BigInt;
    }
    public static getXorshift128plusState1WithBigIntStates(): bigint {
        return Utility.xorshift128plusState1BigInt;
    }
    public static getXorshift128plusCycleWithBigIntStates(): bigint {
        return Utility.xorshift128plusCycleBigInt;
    }
    public static getXorshift128plusCycleFloatWithBigIntStates(): number {
        return Utility.xorshift128plusCycleFloatBigInt;
    }
    public static rngSeedXorshift128plusWithBigIntStatesWithNumberArguments(
        newState0: number,
        newState1: number,
        inputRngBurninIterationsForBigInt: number = -1): void {
        if (inputRngBurninIterationsForBigInt < 0) {
            inputRngBurninIterationsForBigInt = Utility.rngBurninIterationsForBigInt;
        }
        Utility.xorshift128plusState0BigInt = BigInt(newState0);
        Utility.xorshift128plusState1BigInt = BigInt(newState1);
        for (let i: number = 0; i < inputRngBurninIterationsForBigInt; i++) {
            Utility.rngNextXorshift128plusWithBigIntStatesDirect();
        }
        Utility.rngBurninDoneForBigInt = true;
    }
    public static rngSeedXorshift128plusWithBigIntStates(
        newState0BigInt: bigint,
        newState1BigInt: bigint,
        newCycleBigInt: bigint,
        inputRngBurninIterationsForBigInt: number = -1): void {
        if (inputRngBurninIterationsForBigInt < 0) {
            inputRngBurninIterationsForBigInt = Utility.rngBurninIterationsForBigInt;
        }
        Utility.xorshift128plusState0BigInt = newState0BigInt;
        Utility.xorshift128plusState1BigInt = newState1BigInt;
        Utility.xorshift128plusCycleBigInt = newCycleBigInt;
        for (let i: number = 0; i < inputRngBurninIterationsForBigInt; i++) {
            Utility.rngNextXorshift128plusWithBigIntStatesDirect();
        }
        Utility.rngBurninDoneForBigInt = true;
    }
    public static rngNextXorshift128plusWithBigIntStatesDirect(): bigint {
        let s1: bigint =
            Utility.xorshift128plusState0BigInt;
        const s0: bigint =
            Utility.xorshift128plusState1BigInt;
        Utility.xorshift128plusState0BigInt =
            s0;
        // tslint:disable-next-line: no-bitwise
        Utility.xorshift128plusState0BigInt %=
            Utility.xorshift128plusCycleBigInt;
        // tslint:disable-next-line: no-bitwise
        s1 ^= s1 << Utility.bigint23;
        // tslint:disable-next-line: no-bitwise
        s1 ^= s1 >> Utility.bigint17;
        // tslint:disable-next-line: no-bitwise
        s1 ^= s0;
        // tslint:disable-next-line: no-bitwise
        s1 ^= s0 >> Utility.bigint26;
        Utility.xorshift128plusState1BigInt =
            s1;
        // tslint:disable-next-line: no-bitwise
        Utility.xorshift128plusState1BigInt %=
            Utility.xorshift128plusCycleBigInt;
        let result: bigint =
            Utility.xorshift128plusState0BigInt + Utility.xorshift128plusState1BigInt;
        // tslint:disable-next-line: no-bitwise
        result %= Utility.xorshift128plusCycleBigInt;
        return result;
    }
    public static rngNextXorshift128plusWithBigIntStates(): bigint {
        if (!Utility.rngBurninDoneForBigInt) {
            for (let i: number = 0; i < Utility.rngBurninIterationsForBigInt; i++) {
                Utility.rngNextXorshift128plusWithBigIntStatesDirect();
            }
            Utility.rngBurninDoneForBigInt = true;
        }
        return Utility.rngNextXorshift128plusWithBigIntStatesDirect();
    }
    public static rngNextXorshift128plusFloatWithBigIntStates(): number {
        const resultBigInt: bigint = Utility.rngNextXorshift128plusWithBigIntStates();
        const resultNumber: number = Number(resultBigInt);
        return (resultNumber / Utility.xorshift128plusCycleFloatBigInt);
    }
    public static seedRandomNumberGenerator(
        newState0: number,
        newState1: number,
        inputRngBurninIterationsForBigInt: number = -1): void {
        Utility.rngSeedXorshift128plusWithBigIntStatesWithNumberArguments(
            newState0,
            newState1,
            inputRngBurninIterationsForBigInt);
    }
    public static getRandomNumber(): number {
        return Utility.rngNextXorshift128plusFloatWithBigIntStates();
    }

    public static getRandomInt(limit: number): number {
        return Utility.getRandomIntFromIntLimit(limit);
    }
    public static getRandomIntFromFloatLimit(limit: number): number {
        let randomInt: number = Math.floor(
            Utility.getRandomNumber() * limit);
        if (randomInt >= limit) {
            randomInt = limit - Utility.epsilon;
        }
        return randomInt;
    }
    public static getRandomIntFromIntLimit(limit: number): number {
        let randomInt: number = Math.floor(
            Utility.getRandomNumber() * Math.floor(limit));
        if (randomInt >= limit) {
            randomInt = limit - 1;
        }
        return randomInt;
    }

    public static shuffle<T>(array: T[]): T[] {
        let currentIndex = array.length;
        let randomIndex: number = -1;
        // ---- While there remains elements to shuffle.
        while (currentIndex > 0) {
            // ---- Pick a remaining element.
            randomIndex =
                Utility.getRandomInt(currentIndex);
            currentIndex--;
            // ---- And swap it with the current element.
            const temporaryValue: T = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    public static validateGenericArrayPairEquality<T>(
        genericArrayFirst: T[],
        genericArraySecond: T[],
        throwIfNotLegal: boolean = true): boolean {
        if ((genericArrayFirst == null) && (genericArraySecond == null)) {
            return true;
        }
        if (genericArrayFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArrayFirst==null");
            }
            return false;
        }
        if (genericArraySecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArraySecond==null");
            }
            return false;
        }
        if (genericArrayFirst.length !== genericArraySecond.length) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `genericArrayFirst.length|${genericArrayFirst.length}|` +
                    `!=genericArraySecond.length|${ genericArraySecond.length}|`);
            }
            return false;
        }
        for (let index = 0; index < genericArrayFirst.length; index++) {
            const first: T = genericArrayFirst[index];
            const second: T = genericArraySecond[index];
            if (first !== second) {
                if (throwIfNotLegal) {
                    Utility.debuggingThrow(
                        `index=${index}` +
                        `first|${first}|` +
                        `!=second|${second}|`);
                }
                return false;
            }
        }
        return true;
    }
    public static validateGenericSetPairEquality<T>(
        genericSetFirst: Set<T>,
        genericSetSecond: Set<T>,
        throwIfNotLegal: boolean = true): boolean {
        if ((genericSetFirst == null) && (genericSetSecond == null)) {
            return true;
        }
        if (genericSetFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericSetFirst==null");
            }
            return false;
        }
        if (genericSetSecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericSetSecond==null");
            }
            return false;
        }
        const genericSetFirstLength: number = Utility.getSetLength(genericSetFirst);
        const genericSetSecondLength: number = Utility.getSetLength(genericSetSecond);
        if (genericSetFirstLength !== genericSetSecondLength) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `genericSetFirstLength|${genericSetFirstLength}|` +
                    `!=genericSetSecondLength|${genericSetSecondLength}|`);
            }
            return false;
        }
        for (const key of genericSetFirst) {
            if (key) {
                if (genericSetSecond.has(key)) {
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in genericSetFirst, but not in genericSetSecond`);
                    }
                    return false;
                }
            }
        }
        for (const key of genericSetSecond) {
            if (key) {
                if (genericSetFirst.has(key)) {
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in genericSetSecond, but not in genericSetFirst`);
                    }
                    return false;
                }
            }
        }
        return true;
    }

    public static validateStringArrayPairEquality(
        stringArrayFirst: string[],
        stringArraySecond: string[],
        throwIfNotLegal: boolean = true): boolean {
        if ((stringArrayFirst == null) && (stringArraySecond == null)) {
            return true;
        }
        if (stringArrayFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringArrayFirst==null");
            }
            return false;
        }
        if (stringArraySecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringArraySecond==null");
            }
            return false;
        }
        if (stringArrayFirst.length !== stringArraySecond.length) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `stringArrayFirst.length|${stringArrayFirst.length}|` +
                    `!=stringArraySecond.length|${ stringArraySecond.length}|`);
            }
            return false;
        }
        for (let index = 0; index < stringArrayFirst.length; index++) {
            const first: string = stringArrayFirst[index];
            const second: string = stringArraySecond[index];
            if (first !== second) {
                if (throwIfNotLegal) {
                    Utility.debuggingThrow(
                        `index=${index}` +
                        `first|${first}|` +
                        `!=second|${second}|`);
                }
                return false;
            }
        }
        return true;
    }
    public static validateStringSetPairEquality(
        stringSetFirst: Set<string>,
        stringSetSecond: Set<string>,
        throwIfNotLegal: boolean = true): boolean {
        if ((stringSetFirst == null) && (stringSetSecond == null)) {
            return true;
        }
        if (stringSetFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringSetFirst==null");
            }
            return false;
        }
        if (stringSetSecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("stringSetSecond==null");
            }
            return false;
        }
        const stringSetFirstLength: number = Utility.getSetLength(stringSetFirst);
        const stringSetSecondLength: number = Utility.getSetLength(stringSetSecond);
        if (stringSetFirstLength !== stringSetSecondLength) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `stringSetFirstLength|${stringSetFirstLength}|` +
                    `!=stringSetSecondLength|${stringSetSecondLength}|`);
            }
            return false;
        }
        for (const key of stringSetFirst) {
            if (key) {
                if (stringSetSecond.has(key)) {
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in stringSetFirst, but not in stringSetSecond`);
                    }
                    return false;
                }
            }
        }
        for (const key of stringSetSecond) {
            if (key) {
                if (stringSetFirst.has(key)) {
                    continue;
                } else {
                    if (throwIfNotLegal) {
                        Utility.debuggingThrow(
                            `key|${key}| is in stringSetSecond, but not in stringSetFirst`);
                    }
                    return false;
                }
            }
        }
        return true;
    }

    public static loadLabelTextScoreFile(
        filename: string,
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        weightColumnIndex: number = -1,
        scoreColumnBeginIndex: number = 2,
        numberOfScoreColumns: number = -1,
        identifierColumnIndex: number = -1,
        predictedLabelColumnIndex: number = -1,
        revisedTextColumnIndex: number = -1,
        lineIndexToStart: number = 0,
        columnDelimiter: string = "\t",
        rowDelimiter: string = "\n",
        encoding: string = "utf8",
        lineIndexToEnd: number = -1): {
            "labels": string[],
            "texts": string[],
            "weights": number[],
            "identifiers": string[],
            "scoreArrays": number[][],
            "predictedLabels": string[],
            "revisedTexts": string[] } {
        if (encoding == null) {
            encoding = "utf8";
        }
        const fileContent: string = Utility.loadFile(
            filename,
            encoding);
        return Utility.loadLabelTextScoreContent(
            fileContent,
            labelColumnIndex,
            textColumnIndex,
            weightColumnIndex,
            scoreColumnBeginIndex,
            numberOfScoreColumns,
            identifierColumnIndex,
            predictedLabelColumnIndex,
            revisedTextColumnIndex,
            lineIndexToStart,
            columnDelimiter,
            rowDelimiter,
            lineIndexToEnd);
    }
    public static loadLabelTextScoreContent(
        fileContent: string,
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        weightColumnIndex: number = -1,
        scoreColumnBeginIndex: number = 2,
        numberOfScoreColumns: number = 0,
        identifierColumnIndex: number = -1,
        predictedLabelColumnIndex: number = -1,
        revisedTextColumnIndex: number = -1,
        lineIndexToStart: number = 0,
        columnDelimiter: string = "\t",
        rowDelimiter: string = "\n",
        lineIndexToEnd: number = -1): {
            "labels": string[],
            "texts": string[],
            "weights": number[],
            "identifiers": string[],
            "scoreArrays": number[][],
            "predictedLabels": string[],
            "revisedTexts": string[] } {
        if (labelColumnIndex < 0) {
            labelColumnIndex = 0;
        }
        if (textColumnIndex < 0) {
            textColumnIndex = 1;
        }
        if (scoreColumnBeginIndex < 0) {
            scoreColumnBeginIndex = 2;
        }
        if (lineIndexToStart < 0) {
            lineIndexToStart = 0;
        }
        if (columnDelimiter == null) {
            columnDelimiter = "\t";
        }
        if (rowDelimiter == null) {
            rowDelimiter = "\n";
        }
        const labels: string[] = [];
        const texts: string[] = [];
        const weights: number[] = [];
        const identifiers: string[] = [];
        const scoreArrays: number[][] = [];
        const predictedLabels: string[] = [];
        const revisedTexts: string[] = [];
        const fileLines: string[] = Utility.split(fileContent, rowDelimiter);
        for (let lineIndex = lineIndexToStart;
            (lineIndex < fileLines.length) && ((lineIndexToEnd < 0) || (lineIndex < lineIndexToEnd));
            lineIndex++) {
            // ---------------------------------------------------------------
            const line: string = fileLines[lineIndex].trim();
            if (Utility.isEmptyString(line)) {
                continue;
            }
            const lineColumns: string[] = Utility.split(line, columnDelimiter);
            // ---------------------------------------------------------------
            const label: string = lineColumns[labelColumnIndex];
            // ---------------------------------------------------------------
            const text: string = lineColumns[textColumnIndex];
            if (Utility.isEmptyString(label)) {
                Utility.debuggingThrow(
                    `LINE - INDEX=${lineIndex}, label is empty` +
                    `, lineColumns.length=${lineColumns.length}` +
                    `, label=$${label}$` +
                    `, text=$${text}$` +
                    `, line=$${line}$`);
            }
            // ---------------------------------------------------------------
            let weight: number = 1;
            if (weightColumnIndex >= 0) {
                weight = +lineColumns[weightColumnIndex];
            }
            // ---------------------------------------------------------------
            let identifier: string = lineIndex.toString();
            if (identifierColumnIndex >= 0) {
                identifier = lineColumns[identifierColumnIndex];
            }
            let predictedLabel: string = "";
            if (predictedLabelColumnIndex >= 0) {
                predictedLabel = lineColumns[predictedLabelColumnIndex];
            }
            let revisedText: string = "";
            if (revisedTextColumnIndex >= 0) {
                revisedText = lineColumns[revisedTextColumnIndex];
            }
            // ---------------------------------------------------------------
            if (numberOfScoreColumns <= 0) {
                numberOfScoreColumns = lineColumns.length - scoreColumnBeginIndex;
            }
            if ((numberOfScoreColumns <= 0) || (numberOfScoreColumns > (lineColumns.length - scoreColumnBeginIndex))) {
                Utility.debuggingThrow(
                    `(numberOfScoreColumns<=0)||(numberOfScoreColumns|${numberOfScoreColumns}|>lineColumns.length|${lineColumns.length}|))` +
                    `,scoreColumnBeginIndex=${scoreColumnBeginIndex}` +
                    `,line=${line}`);
            }
            const scoreArray: number[] = [];
            let scoreIndex = scoreColumnBeginIndex;
            for (let i: number = 0; i < numberOfScoreColumns; i++) {
                const score: number = +lineColumns[scoreIndex++];
                scoreArray.push(score);
            }
            // ---------------------------------------------------------------
            // {
            //     Utility.debuggingLog(
            //         `LINE - INDEX=${lineIndex}` +
            //         `, lineColumns.length=${lineColumns.length}` +
            //         `, label=$${label}$` +
            //         `, text=$${text}$` +
            //         `, line=$${line}$`);
            //
            // }
            // ---------------------------------------------------------------
            labels.push(label);
            texts.push(text);
            weights.push(weight);
            identifiers.push(identifier);
            scoreArrays.push(scoreArray);
            predictedLabels.push(predictedLabel);
            revisedTexts.push(revisedText);
            // ---------------------------------------------------------------
        }
        return { labels, texts, weights, identifiers, scoreArrays, predictedLabels, revisedTexts };
    }

    public static loadLabelUtteranceColumnarFile(
        filename: string,
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        weightColumnIndex: number = -1,
        lineIndexToStart: number = 0,
        columnDelimiter: string = "\t",
        rowDelimiter: string = "\n",
        encoding: string = "utf8",
        lineIndexToEnd: number = -1): { "intents": string[], "utterances": string[], "weights": number[] } {
            const intentsTextsWeights: { "intents": string[], "texts": string[], "weights": number[] } =
            Utility.loadLabelTextColumnarFile(
                filename,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                lineIndexToStart,
                columnDelimiter,
                rowDelimiter,
                encoding,
                lineIndexToEnd);
            const intents: string[] = intentsTextsWeights.intents;
            const utterances: string[] = intentsTextsWeights.texts;
            const weights: number[] = intentsTextsWeights.weights;
            const intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] } = {
                intents,
                utterances,
                weights };
            return intentsUtterancesWeights;
    }
    public static loadLabelTextColumnarFile(
        filename: string,
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        weightColumnIndex: number = -1,
        lineIndexToStart: number = 0,
        columnDelimiter: string = "\t",
        rowDelimiter: string = "\n",
        encoding: string = "utf8",
        lineIndexToEnd: number = -1): { "intents": string[], "texts": string[], "weights": number[] } {
        if (encoding == null) {
            encoding = "utf8";
        }
        const fileContent: string = Utility.loadFile(
            filename,
            encoding);
        return Utility.loadLabelTextColumnarContent(
            fileContent,
            labelColumnIndex,
            textColumnIndex,
            weightColumnIndex,
            lineIndexToStart,
            columnDelimiter,
            rowDelimiter,
            lineIndexToEnd);
    }
    public static loadLabelUtteranceColumnarContent(
        fileContent: string,
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        weightColumnIndex: number = -1,
        lineIndexToStart: number = 0,
        columnDelimiter: string = "\t",
        rowDelimiter: string = "\n",
        encoding: string = "utf8",
        lineIndexToEnd: number = -1): { "intents": string[], "utterances": string[], "weights": number[] } {
            const intentsTextsWeights: { "intents": string[], "texts": string[], "weights": number[] } =
            Utility.loadLabelTextColumnarContent(
                fileContent,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                lineIndexToStart,
                columnDelimiter,
                rowDelimiter,
                lineIndexToEnd);
            const intents: string[] = intentsTextsWeights.intents;
            const utterances: string[] = intentsTextsWeights.texts;
            const weights: number[] = intentsTextsWeights.weights;
            const intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] } = {
                intents,
                utterances,
                weights };
            return intentsUtterancesWeights;
    }
    public static loadLabelTextColumnarContent(
        fileContent: string,
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        weightColumnIndex: number = -1,
        lineIndexToStart: number = 0,
        columnDelimiter: string = "\t",
        rowDelimiter: string = "\n",
        lineIndexToEnd: number = -1):
        { "intents": string[], "texts": string[], "weights": number[] } {
        if (labelColumnIndex < 0) {
            labelColumnIndex = 0;
        }
        if (textColumnIndex < 0) {
            textColumnIndex = 1;
        }
        if (lineIndexToStart < 0) {
            lineIndexToStart = 0;
        }
        if (columnDelimiter == null) {
            columnDelimiter = "\t";
        }
        if (rowDelimiter == null) {
            rowDelimiter = "\n";
        }
        const intents: string[] = [];
        const texts: string[] = [];
        const weights: number[] = [];
        const fileLines: string[] = Utility.split(fileContent, rowDelimiter);
        for (let lineIndex = lineIndexToStart;
            (lineIndex < fileLines.length) && ((lineIndexToEnd < 0) || (lineIndex < lineIndexToEnd));
            lineIndex++) {
            const line: string = fileLines[lineIndex].trim();
            if (Utility.isEmptyString(line)) {
                continue;
            }
            const lineColumns: string[] = Utility.split(line, columnDelimiter);
            const intent: string = lineColumns[labelColumnIndex];
            const text: string = lineColumns[textColumnIndex];
            let weight: number = 1;
            if (weightColumnIndex >= 0) {
                weight = +lineColumns[weightColumnIndex];
            }
            if (Utility.isEmptyString(intent)) {
                Utility.debuggingThrow(
                    `LINE - INDEX=${lineIndex}, intent is empty` +
                    `, lineColumns.length=${lineColumns.length}` +
                    `, intent=$${intent}$` +
                    `, text=$${text}$` +
                    `, weight=$${weight}$` +
                    `, line=$${line}$`);
            }
            if (Utility.isEmptyString(text)) {
                Utility.debuggingThrow(
                    `LINE - INDEX=${lineIndex}, text is empty` +
                    `, lineColumns.length=${lineColumns.length}` +
                    `, intent=$${intent}$` +
                    `, text=$${text}$` +
                    `, weight=$${weight}$` +
                    `, line=$${line}$`);
            }
            // {
            //     Utility.debuggingLog(
            //         `LINE - INDEX=${lineIndex}` +
            //         `, lineColumns.length=${lineColumns.length}` +
            //         `, intent=$${intent}$` +
            //         `, text=$${text}$` +
            //         `, weight=$${weight}$` +
            //         `, line=$${line}$`);
            //
            // }
            intents.push(intent);
            texts.push(text);
            weights.push(weight);
        }
        return { intents, texts, weights };
    }

    public static processUtteranceEntityTsv(
        lines: string[],
        utterancesEntitiesMap: Map<string, Array<[string, number, number]>>,
        utterancesEntitiesPredictedMap: Map<string, Array<[string, number, number]>>,
        utteranceIndex: number = 2,
        entitiesIndex: number = 0,
        entitiesPredictedIndex: number = 1): boolean {
        if (utteranceIndex < 0) {
            Utility.debuggingThrow(`utteranceIndex|${utteranceIndex}| < 0`);
        }
        lines.forEach((line: string) => {
            const items: string[] = line.split("\t");
            if (utteranceIndex >= items.length) {
                Utility.debuggingThrow(`utteranceIndex|${utteranceIndex}| >= items.length|${items.length}|`);
            }
            let utterance: string = items[utteranceIndex] ? items[utteranceIndex] : "";
            let entities: string = "";
            if ((entitiesIndex >= 0) && (entitiesIndex < items.length)) {
                entities = items[entitiesIndex] ? items[entitiesIndex] : "";
            }
            let entitiesPredicted: string = "";
            if ((entitiesPredictedIndex >= 0) && (entitiesPredictedIndex < items.length)) {
                entitiesPredicted = items[entitiesPredictedIndex] ? items[entitiesPredictedIndex] : "";
            }
            entities = entities.trim();
            utterance = utterance.trim();
            entitiesPredicted = entitiesPredicted.trim();
            const entityArray: string[] = entities.split(",");
            for (const entityEntry of entityArray) {
                Utility.addToEntitiesUtteranceStructure(
                    utterance,
                    entityEntry.trim(),
                    utterancesEntitiesMap);
            }
            const entityPredictedArray: string[] = entitiesPredicted.split(",");
            for (const entityEntryPredicted of entityPredictedArray) {
                Utility.addToEntitiesUtteranceStructure(
                    utterance,
                    entityEntryPredicted.trim(),
                    utterancesEntitiesPredictedMap);
            }
        });
        return true;
    }
    public static addToEntitiesUtteranceStructure(
        utterance: string,
        entityEntry: string,
        utterancesEntitiesMap: Map<string, Array<[string, number, number]>>) {
        const entityComponentArray: string[] = entityEntry.split(";");
        const entity: [string, number, number] = [
            entityComponentArray[0],
            +entityComponentArray[1],
            +entityComponentArray[1]];
        if (!utterancesEntitiesMap.has(utterance)) {
            utterancesEntitiesMap.set(utterance, new Array<[string, number, number]>());
        }
        const existingEntities: Array<[string, number, number]> =
            utterancesEntitiesMap.get(utterance) as Array<[string, number, number]>;
        existingEntities.push(entity);
    }

    public static processUtteranceMultiLabelTsv(
        lines: string[],
        utteranceLabelsMap: Map<string, Set<string>>,
        utterancesLabelsPredictedMap: Map<string, Set<string>>,
        utteranceLabelDuplicateMap: Map<string, Set<string>>,
        utteranceLabelDuplicatePredictedMap: Map<string, Set<string>>,
        utteranceIndex: number = 2,
        labelsIndex: number = 0,
        labelsPredictedIndex: number = 1): boolean {
        if (utteranceIndex < 0) {
            Utility.debuggingThrow(`utteranceIndex|${utteranceIndex}| < 0`);
        }
        lines.forEach((line: string) => {
            const items: string[] = line.split("\t");
            if (utteranceIndex >= items.length) {
                Utility.debuggingThrow(`utteranceIndex|${utteranceIndex}| >= items.length|${items.length}|`);
            }
            let utterance: string = items[utteranceIndex] ? items[utteranceIndex] : "";
            let labels: string = "";
            if ((labelsIndex >= 0) && (labelsIndex < items.length)) {
                labels = items[labelsIndex] ? items[labelsIndex] : "";
            }
            let labelsPredicted: string = "";
            if ((labelsPredictedIndex >= 0) && (labelsPredictedIndex < items.length)) {
                labelsPredicted = items[labelsPredictedIndex] ? items[labelsPredictedIndex] : "";
            }
            labels = labels.trim();
            utterance = utterance.trim();
            labelsPredicted = labelsPredicted.trim();
            const labelArray: string[] = labels.split(",");
            for (const label of labelArray) {
                Utility.addToMultiLabelUtteranceStructure(
                    utterance,
                    label.trim(),
                    utteranceLabelsMap,
                    utteranceLabelDuplicateMap);
            }
            const labelPredictedArray: string[] = labelsPredicted.split(",");
            for (const labelPredicted of labelPredictedArray) {
                Utility.addToMultiLabelUtteranceStructure(
                    utterance,
                    labelPredicted.trim(),
                    utterancesLabelsPredictedMap,
                    utteranceLabelDuplicatePredictedMap);
            }
        });
        return true;
    }
    public static addToMultiLabelUtteranceStructure(
        utterance: string,
        label: string,
        utteranceLabelsMap: Map<string, Set<string>>,
        utteranceLabelDuplicateMap: Map<string, Set<string>>) {
        const existingLabels: Set<string> = utteranceLabelsMap.get(utterance) as Set<string>;
        if (existingLabels) {
            if (!Utility.addIfNewLabel(label, existingLabels)) {
                DictionaryMapUtility.insertStringPairToStringIdStringSetNativeMap(
                    utterance,
                    label,
                    utteranceLabelDuplicateMap);
            }
        } else {
            utteranceLabelsMap.set(utterance, new Set<string>([label]));
        }
    }
    public static addIfNewLabel(newLabel: string, labels: Set<string>): boolean {
        if (labels.has(newLabel)) {
            return false;
        }
        labels.add(newLabel);
        return true;
    }
    public static addIfNewLabelToArray(newLabel: string, labels: string[]): boolean {
        for (const label of labels) {
            if (label === newLabel) {
                return false;
            }
        }
        labels.push(newLabel);
        return true;
    }

    public static reverseUniqueKeyedArrayInMap(input: Map<string, Set<string>>): Map<string, Set<string>> {
        const reversed: Map<string, Set<string>> = new Map<string, Set<string>>();
        for (const key of input.keys()) {
            if (key) {
                const keyedSet: Set<string> = input.get(key) as Set<string>;
                for (const keyedSetElement of keyedSet) {
                    if (reversed.has(keyedSetElement)) {
                        (reversed.get(keyedSetElement) as Set<string>).add(key);
                    } else {
                        reversed.set(keyedSetElement, new Set<string>([key]));
                    }
                }
            }
        }
        return reversed;
    }

    public static reverseUniqueKeyedArrayInDictionary(input: {[id: string]: string[]}): {[id: string]: string[]} {
        const reversed: {[id: string]: string[]} = {};
        for (const key in input) {
            if (key) {
                const keyedArray: string[] = input[key];
                for (const keyedArrayElement of keyedArray) {
                    if (keyedArrayElement in reversed) {
                        reversed[keyedArrayElement].push(key);
                    } else {
                        reversed[keyedArrayElement] = [key];
                    }
                }
            }
        }
        return reversed;
    }

    public static storeDataArraysToTsvFile(
        outputFilename: string,
        outputEvaluationReportDataArrays: string[][],
        outputDataArraryHeaders: string[] = [],
        columnDelimiter: string = "\t",
        recordDelimiter: string = "\n",
        encoding: string = "utf8"): string {
        if (Utility.isEmptyString(outputFilename)) {
            Utility.debuggingThrow(
                "outputFilename is empty");
        }
        if (Utility.isEmptyStringArrays(outputEvaluationReportDataArrays)) {
            return "";
            // ---- Utility.debuggingThrow(
            // ----     "outputEvaluationReportDataArrays is empty");
        }
        const outputLines: string[] = [];
        if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
            const outputLine: string = outputDataArraryHeaders.join(columnDelimiter);
            outputLines.push(outputLine);
        }
        for (const outputEvaluationReportDataArray of outputEvaluationReportDataArrays) {
            const outputLine: string = outputEvaluationReportDataArray.join(columnDelimiter);
            outputLines.push(outputLine);
        }
        const outputContent: string = outputLines.join(recordDelimiter);
        try {
            return Utility.dumpFile(outputFilename, `${outputContent}${recordDelimiter}`, encoding);
        } catch (e) {
            Utility.debuggingThrow(
                `storeTsvFile() cannout create an output file: ${outputFilename}, EXCEPTION=${e}`);
            return "";
        }
    }

    public static convertDataArraysToIndexedHtmlTable(
        tableDescription: string,
        outputEvaluationReportDataArrays: any[][],
        outputDataArraryHeaders: string[] = [],
        indentCumulative: string = "  ",
        indent: string = "  "): string {
        const outputLines: string[] = [];
        if (!Utility.isEmptyString(tableDescription)) {
            outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
        }
        outputLines.push(indentCumulative + "<table class=\"table\">");
        if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
            outputLines.push(indentCumulative + indent + "<tr>");
            outputLines.push(indentCumulative + indent + indent + "<th>");
            outputLines.push(indentCumulative + indent + indent + "No");
            outputLines.push(indentCumulative + indent + indent + "</th>");
            for (const headerEntry of outputDataArraryHeaders) {
                outputLines.push(indentCumulative + indent + indent + "<th>");
                outputLines.push(indentCumulative + indent + indent + headerEntry);
                outputLines.push(indentCumulative + indent + indent + "</th>");
            }
            outputLines.push(indentCumulative + indent + "<tr>");
        }
        if (!Utility.isEmptyStringArrays(outputEvaluationReportDataArrays)) {
            let index: number = 0;
            for (const outputEvaluationReportDataArray of outputEvaluationReportDataArrays) {
                outputLines.push(indentCumulative + indent + "<tr>");
                outputLines.push(indentCumulative + indent + indent + "<td>");
                outputLines.push(indentCumulative + indent + indent + index++);
                outputLines.push(indentCumulative + indent + indent + "</td>");
                for (const dataEntry of outputEvaluationReportDataArray) {
                    outputLines.push(indentCumulative + indent + indent + "<td>");
                    outputLines.push(indentCumulative + indent + indent + dataEntry);
                    outputLines.push(indentCumulative + indent + indent + "</td>");
                }
                outputLines.push(indentCumulative + indent + "</tr>");
            }
        }
        outputLines.push(indentCumulative + "</table>");
        const outputContent: string = outputLines.join("\n");
        return outputContent;
    }
    public static convertDataArraysToHtmlTable(
        tableDescription: string,
        outputEvaluationReportDataArrays: any[][],
        outputDataArraryHeaders: string[] = [],
        indentCumulative: string = "  ",
        indent: string = "  "): string {
        const outputLines: string[] = [];
        if (!Utility.isEmptyString(tableDescription)) {
            outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
        }
        outputLines.push(indentCumulative + "<table class=\"table\">");
        if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
            outputLines.push(indentCumulative + indent + "<tr>");
            for (const headerEntry of outputDataArraryHeaders) {
                outputLines.push(indentCumulative + indent + indent + "<th>");
                outputLines.push(indentCumulative + indent + indent + headerEntry);
                outputLines.push(indentCumulative + indent + indent + "</th>");
            }
            outputLines.push(indentCumulative + indent + "<tr>");
        }
        if (Utility.isEmptyStringArrays(outputEvaluationReportDataArrays)) {
            for (const outputEvaluationReportDataArray of outputEvaluationReportDataArrays) {
                outputLines.push(indentCumulative + indent + "<tr>");
                for (const dataEntry of outputEvaluationReportDataArray) {
                    outputLines.push(indentCumulative + indent + indent + "<td>");
                    outputLines.push(indentCumulative + indent + indent + dataEntry);
                    outputLines.push(indentCumulative + indent + indent + "</td>");
                }
                outputLines.push(indentCumulative + indent + "</tr>");
            }
        }
        outputLines.push(indentCumulative + "</table>");
        const outputContent: string = outputLines.join("\n");
        return outputContent;
    }

    public static convertMapSetToHtmlTable(
        tableDescription: string,
        outputEvaluationMapSet: Map<any, Set<any>>,
        outputDataArraryHeaders: string[] = [],
        indentCumulative: string = "  ",
        indent: string = "  "): string {
        const outputLines: string[] = [];
        if (!Utility.isEmptyString(tableDescription)) {
            outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
        }
        outputLines.push(indentCumulative + "<table class=\"table\">");
        if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
          outputLines.push(indentCumulative + indent + "<tr>");
          for (const headerEntry of outputDataArraryHeaders) {
            outputLines.push(indentCumulative + indent + indent + "<th>");
            outputLines.push(indentCumulative + indent + indent + headerEntry);
            outputLines.push(indentCumulative + indent + indent + "</th>");
          }
          outputLines.push(indentCumulative + indent + "<tr>");
        }
        if (!DictionaryMapUtility.isEmptyAnyKeyGenericSetMap<any>(outputEvaluationMapSet)) {
            for (const outputEvaluationMapSetEntry of outputEvaluationMapSet) {
              const key: any = outputEvaluationMapSetEntry[0];
              for (const valueEntry of outputEvaluationMapSetEntry[1]) {
                outputLines.push(indentCumulative + indent + "<tr>");
                outputLines.push(indentCumulative + indent + indent + "<td>");
                outputLines.push(indentCumulative + indent + indent + key);
                outputLines.push(indentCumulative + indent + indent + "</td>");
                outputLines.push(indentCumulative + indent + indent + "<td>");
                outputLines.push(indentCumulative + indent + indent + valueEntry);
                outputLines.push(indentCumulative + indent + indent + "</td>");
                outputLines.push(indentCumulative + indent + "</tr>");
              }
            }
        }
        outputLines.push(indentCumulative + "</table>");
        const outputContent: string = outputLines.join("\n");
        return outputContent;
    }
    public static convertMapSetToIndexedHtmlTable(
        tableDescription: string,
        outputEvaluationMapSet: Map<any, Set<any>>,
        outputDataArraryHeaders: string[] = [],
        indentCumulative: string = "  ",
        indent: string = "  "): string {
        const outputLines: string[] = [];
        if (!Utility.isEmptyString(tableDescription)) {
        outputLines.push(indentCumulative + `<p><strong>${tableDescription}</strong></p>`);
        }
        outputLines.push(indentCumulative + "<table class=\"table\">");
        if (!Utility.isEmptyStringArray(outputDataArraryHeaders)) {
            outputLines.push(indentCumulative + indent + "<tr>");
            outputLines.push(indentCumulative + indent + indent + "<th>");
            outputLines.push(indentCumulative + indent + indent + "No");
            outputLines.push(indentCumulative + indent + indent + "</th>");
            for (const headerEntry of outputDataArraryHeaders) {
                outputLines.push(indentCumulative + indent + indent + "<th>");
                outputLines.push(indentCumulative + indent + indent + headerEntry);
                outputLines.push(indentCumulative + indent + indent + "</th>");
            }
            outputLines.push(indentCumulative + indent + "<tr>");
        }
        if (!DictionaryMapUtility.isEmptyAnyKeyGenericSetMap<any>(outputEvaluationMapSet)) {
            let index: number = 0;
            for (const outputEvaluationMapSetEntry of outputEvaluationMapSet) {
                const key: any = outputEvaluationMapSetEntry[0];
                for (const valueSetEntry of outputEvaluationMapSetEntry[1]) {
                    outputLines.push(indentCumulative + indent + "<tr>");
                    outputLines.push(indentCumulative + indent + indent + "<td>");
                    outputLines.push(indentCumulative + indent + indent + index++);
                    outputLines.push(indentCumulative + indent + indent + "</td>");
                    outputLines.push(indentCumulative + indent + indent + "<td>");
                    outputLines.push(indentCumulative + indent + indent + key);
                    outputLines.push(indentCumulative + indent + indent + "</td>");
                    outputLines.push(indentCumulative + indent + indent + "<td>");
                    outputLines.push(indentCumulative + indent + indent + valueSetEntry);
                    outputLines.push(indentCumulative + indent + indent + "</td>");
                    outputLines.push(indentCumulative + indent + "</tr>");
                }
            }
        }
        outputLines.push(indentCumulative + "</table>");
        const outputContent: string = outputLines.join("\n");
        return outputContent;
    }

    public static luUtterancesToEntityAnnotatedCorpusTypes(
        luUtterances: Array<{
            "entities": Array<{
                "entity": string,
                "startPos": number,
                "endPos": number,
                }>,
            "partOfSpeechTags": Array<{
                "partOfSpeechTag": string,
                "startPos": number,
                "endPos": number,
                }>,
            "intent": string,
            "text": string,
            "weight": number }>,
        utteranceReconstructionDelimiter: string = " ",
        defaultEntityTag: string = "O",
        defaultPartOfSpeechTag: string = "",
        useIntentForId: boolean = false): {
            "ids": string[],
            "wordArrays": string[][],
            "partOfSpeechTagArrays": string[][],
            "entityTagArrays": string[][] } {
        const ids: string[] = [];
        const wordArrays: string[][] = [];
        const partOfSpeechTagArrays: string[][] = [];
        const entityTagArrays: string[][] = [];
        const numberInstances = luUtterances.length;
        for (let index: number = 0; index < numberInstances; index++) {
            const luUtterance: {
                "entities": Array<{
                    "entity": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "partOfSpeechTags": Array<{
                    "partOfSpeechTag": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "intent": string,
                "text": string,
                "weight": number } = luUtterances[index];
            const text: string = luUtterance.text;
            const intent: string = luUtterance.intent;
            const entities: Array<{
                "entity": string,
                "startPos": number,
                "endPos": number,
                }> = luUtterance.entities;
            const partOfSpeechTags: Array<{
                "partOfSpeechTag": string,
                "startPos": number,
                "endPos": number,
                }> = luUtterance.partOfSpeechTags;
            if (useIntentForId) {
                ids.push(intent);
            } else {
                ids.push(index.toString());
            }
            const wordArray: string[] = Utility.splitByPunctuation(
                text,
                utteranceReconstructionDelimiter);
            wordArrays.push(wordArray);
            const numberWords: number = wordArrays.length;
            const entityTagArray: string[] = [];
            if (!Utility.isEmptyArray(entities)) {
                let utteranceCurrentIndex: number = 0;
                for (let wordIndex: number = 0; wordIndex < numberWords; wordIndex++) {
                    const wordCurrent: string = wordArray[wordIndex];
                    const currentWordInUtteranceIndex: number = text.substr(utteranceCurrentIndex).indexOf(wordCurrent);
                    const currentWordInUtteranceIndexEnd: number = currentWordInUtteranceIndex + wordCurrent.length;
                    let wordEntityTag: string = defaultEntityTag;
                    for (const entity of entities) {
                        const entityTag: string = entity.entity;
                        const entityStartPos: number  = entity.startPos;
                        const entityEndPos: number  = entity.endPos;
                        if ((currentWordInUtteranceIndex >= entityStartPos) &&
                            (currentWordInUtteranceIndexEnd <= entityEndPos)) {
                            wordEntityTag = entityTag;
                            break;
                        }
                    }
                    entityTagArray.push(wordEntityTag);
                    utteranceCurrentIndex = currentWordInUtteranceIndexEnd;
                }
            }
            entityTagArrays.push(entityTagArray);
            const partOfSpeechTagArray: string[] = [];
            if (!Utility.isEmptyArray(partOfSpeechTags)) {
                let utteranceCurrentIndex: number = 0;
                for (let wordIndex: number = 0; wordIndex < numberWords; wordIndex++) {
                    const wordCurrent: string = wordArray[wordIndex];
                    const currentWordInUtteranceIndex: number = text.substr(utteranceCurrentIndex).indexOf(wordCurrent);
                    const currentWordInUtteranceIndexEnd: number = currentWordInUtteranceIndex + wordCurrent.length;
                    let wordPartOfSpeechTag: string = defaultPartOfSpeechTag;
                    for (const partOfSpeechTag of partOfSpeechTags) {
                        const partOfSpeechTagString: string = partOfSpeechTag.partOfSpeechTag;
                        const partOfSpeechStartPos: number  = partOfSpeechTag.startPos;
                        const partOfSpeechEndPos: number  = partOfSpeechTag.endPos;
                        if ((currentWordInUtteranceIndex >= partOfSpeechStartPos) &&
                            (currentWordInUtteranceIndexEnd <= partOfSpeechEndPos)) {
                            wordPartOfSpeechTag = partOfSpeechTagString;
                            break;
                        }
                    }
                    partOfSpeechTagArray.push(wordPartOfSpeechTag);
                    utteranceCurrentIndex = currentWordInUtteranceIndexEnd;
                }
            }
            partOfSpeechTagArrays.push(partOfSpeechTagArray);
        }
        return {ids, wordArrays, partOfSpeechTagArrays, entityTagArrays};
    }
    public static entityAnnotatedCorpusTypesToEntityAnnotatedCorpusUtterances(
        entityAnnotatedCorpusTypes: {
            "ids": string[],
            "wordArrays": string[][],
            "partOfSpeechTagArrays": string[][],
            "entityTagArrays": string[][] },
        includePartOfSpeechTagTagAsEntities: boolean = true,
        utteranceReconstructionDelimiter: string = " ",
        defaultEntityTag: string = "O",
        useIdForIntent: boolean = true): Array<{
            "entities": Array<{
                "entity": string,
                "startPos": number,
                "endPos": number,
                }>,
            "partOfSpeechTags": Array<{
                "partOfSpeechTag": string,
                "startPos": number,
                "endPos": number,
                }>,
            "intent": string,
            "text": string,
            "weight": number }> {
        if (Utility.isEmptyString(utteranceReconstructionDelimiter)) {
            utteranceReconstructionDelimiter = " ";
        }
        const utteranceReconstructionDelimiterLength: number = utteranceReconstructionDelimiter.length;
        const ids: string[] = entityAnnotatedCorpusTypes.ids;
        const wordArrays: string[][] = entityAnnotatedCorpusTypes.wordArrays;
        const partOfSpeechTagArrays: string[][] = entityAnnotatedCorpusTypes.partOfSpeechTagArrays;
        const entityTagArrays: string[][] = entityAnnotatedCorpusTypes.entityTagArrays;
        if (Utility.isEmptyStringArray(ids)) {
            Utility.debuggingThrow("ids is empty");
        }
        if (Utility.isEmptyArray(wordArrays)) {
            Utility.debuggingThrow("wordArrays is empty");
        }
        if (includePartOfSpeechTagTagAsEntities) {
            if (Utility.isEmptyArray(partOfSpeechTagArrays)) {
                Utility.debuggingThrow("partOfSpeechTagArrays is empty");
            }
        }
        if (Utility.isEmptyArray(entityTagArrays)) {
            Utility.debuggingThrow("entityTagArrays is empty");
        }
        const numberInstances: number = ids.length;
        if (wordArrays.length !== numberInstances) {
            Utility.debuggingThrow(
                `wordArrays.length|${wordArrays.length}|!==numberInstances|${numberInstances}|`);
        }
        if (includePartOfSpeechTagTagAsEntities) {
            if (partOfSpeechTagArrays.length !== numberInstances) {
            Utility.debuggingThrow(`partOfSpeechTagArrays.length|${partOfSpeechTagArrays.length}|!==numberInstances|${numberInstances}|`);
            }
        }
        if (entityTagArrays.length !== numberInstances) {
            Utility.debuggingThrow(
                `entityTagArrays.length|${entityTagArrays.length}|!==numberInstances|${numberInstances}|`);
        }
        const weight: number = 1;
        const luUtterances: Array<{
            "entities": Array<{
                "entity": string,
                "startPos": number,
                "endPos": number,
                }>,
            "partOfSpeechTags": Array<{
                "partOfSpeechTag": string,
                "startPos": number,
                "endPos": number,
                }>,
            "intent": string,
            "text": string,
            "weight": number }> = [];
        for (let index: number = 0; index < numberInstances; index++) {
            let intent = "";
            const id: string = ids[index];
            if (useIdForIntent) {
                intent = id;
            }
            const wordArray: string[] = wordArrays[index];
            const numberWords: number = wordArray.length;
            let partOfSpeechTagArray: string[] = [];
            if (includePartOfSpeechTagTagAsEntities) {
                partOfSpeechTagArray = partOfSpeechTagArrays[index];
                if (partOfSpeechTagArray.length !== numberWords) {
                    Utility.debuggingThrow(
                        `partOfSpeechTagArray.length|${partOfSpeechTagArray.length}|!==numberWords|${numberWords}|`);
                }
            }
            const entityTagArray: string[] = entityTagArrays[index];
            if (entityTagArray.length !== numberWords) {
                Utility.debuggingThrow(
                    `entityTagArray.length|${entityTagArray.length}|!==numberWords|${numberWords}|`);
            }
            const text: string = wordArray.join(utteranceReconstructionDelimiter);
            const entities: Array<{
                "entity": string,
                "startPos": number,
                "endPos": number,
                }> = [];
            {
                let currentUtteranceBeginIndex: number = 0;
                for (let wordIndex: number = 0; wordIndex < numberWords; wordIndex++) {
                    const word: string = wordArray[wordIndex];
                    const wordLength: number = word.length;
                    const currentUtteranceEndIndex: number = currentUtteranceBeginIndex + wordLength;
                    {
                        const entityTag = entityTagArray[wordIndex];
                        if (entityTag !== defaultEntityTag) {
                            const entityStructure: {
                                "entity": string,
                                "startPos": number,
                                "endPos": number,
                                } = {
                                    entity: entityTag,
                                    startPos: currentUtteranceBeginIndex,
                                    endPos: currentUtteranceEndIndex,
                                    };
                            entities.push(entityStructure);
                        }
                    }
                    currentUtteranceBeginIndex = currentUtteranceEndIndex + utteranceReconstructionDelimiterLength;
                }
            }
            const partOfSpeechTags: Array<{
                "partOfSpeechTag": string,
                "startPos": number,
                "endPos": number,
                }> = [];
            if (includePartOfSpeechTagTagAsEntities) {
                let currentUtteranceBeginIndex: number = 0;
                for (let wordIndex: number = 0; wordIndex < numberWords; wordIndex++) {
                    const word: string = wordArray[wordIndex];
                    const wordLength: number = word.length;
                    const currentUtteranceEndIndex: number = currentUtteranceBeginIndex + wordLength;
                    const partOfSpeechTag: string = partOfSpeechTagArray[wordIndex];
                    const partOfSpeechStructure: {
                        "partOfSpeechTag": string,
                        "startPos": number,
                        "endPos": number,
                        } = {
                            partOfSpeechTag,
                            startPos: currentUtteranceBeginIndex,
                            endPos: currentUtteranceEndIndex,
                            };
                    partOfSpeechTags.push(partOfSpeechStructure);
                    currentUtteranceBeginIndex = currentUtteranceEndIndex + utteranceReconstructionDelimiterLength;
                }
            }
            const luUtterance: {
                "entities": Array<{
                    "entity": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "partOfSpeechTags": Array<{
                    "partOfSpeechTag": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "intent": string,
                "text": string,
                "weight": number } = {
                entities,
                partOfSpeechTags,
                intent,
                text,
                weight,
            };
            luUtterances.push(luUtterance);
        }
        return luUtterances;
    }

    public static loadEntityAnnotatedCorpusFile(
        filename: string,
        lineIndexToStart: number = 0,
        columnDelimiter: string = ",",
        rowDelimiter: string = "\n",
        encoding: string = "utf8",
        lineIndexToEnd: number = -1): {
            "ids": string[],
            "wordArrays": string[][],
            "partOfSpeechTagArrays": string[][],
            "entityTagArrays": string[][] } {
        if (encoding == null) {
            encoding = "utf8";
        }
        const fileContent: string = Utility.loadFile(
            filename,
            encoding);
        return Utility.loadEntityAnnotatedCorpusContent(
            fileContent,
            lineIndexToStart,
            columnDelimiter,
            rowDelimiter,
            lineIndexToEnd);
    }
    public static loadEntityAnnotatedCorpusContent(
        fileContent: string,
        lineIndexToStart: number = 1,
        columnDelimiter: string = ",",
        rowDelimiter: string = "\n",
        lineIndexToEnd: number = -1): {
            "ids": string[],
            "wordArrays": string[][],
            "partOfSpeechTagArrays": string[][],
            "entityTagArrays": string[][] } {
        if (lineIndexToStart < 0) {
            lineIndexToStart = 0;
        }
        if (columnDelimiter == null) {
            columnDelimiter = ",";
        }
        if (rowDelimiter == null) {
            rowDelimiter = "\n";
        }
        const ids: string[] = [];
        const wordArrays: string[][] = [];
        const partOfSpeechTagArrays: string[][] = [];
        const entityTagArrays: string[][] = [];
        let currentId: string = "";
        let currentWordArray: string[] = [];
        let currentPartOfSpeechTagArray: string[] = [];
        let currentTagArray: string[] = [];
        let isFirst: boolean = true;
        const fileLines: string[] = Utility.split(fileContent, rowDelimiter);
        for (let lineIndex = lineIndexToStart;
            (lineIndex < fileLines.length) && ((lineIndexToEnd < 0) || (lineIndex < lineIndexToEnd));
            lineIndex++) {
            const line: string = fileLines[lineIndex].trim();
            if (Utility.isEmptyString(line)) {
                continue;
            }
            const lineColumns: string[] = Utility.splitStringWithColumnDelimitersFilteredByQuotingDelimiters(
                line,
                columnDelimiter,
                "\"");
            if (lineColumns.length !== 4) {
                Utility.debuggingThrow(
                    `lineColumns.length|${lineColumns.length}|!=4` +
                    `,line=$${line}$` +
                    `,lineColumns=$${Utility.jsonStringify(lineColumns)}$`);
            }
            const id: string = lineColumns[0];
            const word: string  = lineColumns[1];
            const partOfSpeechTag: string  = lineColumns[2];
            const entityTag: string  = lineColumns[3];
            const isWordEmpty: boolean = Utility.isEmptyString(word);
            if (isWordEmpty) { // ---- NOTE: end of a sentence if the 'word' field is empty.
                if (!Utility.isEmptyString(currentId)) {
                    {
                        ids.push(currentId);
                        wordArrays.push(currentWordArray);
                        partOfSpeechTagArrays.push(currentPartOfSpeechTagArray);
                        entityTagArrays.push(currentTagArray);
                    }
                    currentId = "";
                }
                continue;
            }
            const isIdEmpty: boolean = Utility.isEmptyString(id);
            if (isIdEmpty) {
                currentWordArray.push(word);
                currentPartOfSpeechTagArray.push(partOfSpeechTag);
                currentTagArray.push(entityTag);
            } else {
                if (isFirst) { // ---- NOTE: the first line is header, ignore it.
                    isFirst = false;
                } else { // ---- NOTE: continue the current sentence if the 'id' field is empty.
                    ids.push(currentId);
                    wordArrays.push(currentWordArray);
                    partOfSpeechTagArrays.push(currentPartOfSpeechTagArray);
                    entityTagArrays.push(currentTagArray);
                }
                { // ---- NOTE: start a new sentence if the 'id' field is not empty.
                    currentId = id;
                    currentWordArray = [word];
                    currentPartOfSpeechTagArray = [partOfSpeechTag];
                    currentTagArray = [entityTag];
                }
            }
        }
        if (currentWordArray.length > 0) {
            if (!Utility.isEmptyString(currentId)) { // ---- NOTE: the very last sentence!
                ids.push(currentId);
                wordArrays.push(currentWordArray);
                partOfSpeechTagArrays.push(currentPartOfSpeechTagArray);
                entityTagArrays.push(currentTagArray);
            }
        }
        return {ids, wordArrays, partOfSpeechTagArrays, entityTagArrays};
    }

    public static loadBinaryFile(
        filename: string): Buffer|null {
        Utility.debuggingLog(
            `Utility.loadBinaryFile(): filename=${filename}`);
        Utility.debuggingLog(
            `Utility.loadBinaryFile(): process.cmd()=${process.cwd()}`);
        try {
            const fileContent: Buffer = fs.readFileSync(filename);
            return fileContent;
        } catch (e) {
            Utility.debuggingThrow(
                `Utility.loadBinaryFile(): filename=${filename}, exception=${e}`);
        }
        return null;
    }

    public static stringToLineArray(
        stringContent: string): string[] {
        const lineArray: string[] = Utility.split(stringContent, "\n");
        const lineTrimedArray: string[] = lineArray.map((x) => x.trim());
        return lineTrimedArray;
    }

    public static loadFile(
        filename: string,
        encoding: string = "utf8"): string {
        Utility.debuggingLog(
            `Utility.loadFile(): filename=${filename}`);
        Utility.debuggingLog(
            `Utility.loadFile(): process.cmd()=${process.cwd()}`);
        try {
            const fileContent: string = fs.readFileSync(filename, encoding);
            return fileContent;
        } catch (error) {
            Utility.debuggingThrow(
                `Utility.loadFile(): filename=${filename}, exception=${error}`);
        }
        return "";
    }
    public static dumpFile(
        filename: string,
        content: any,
        encoding: string = "utf8"): string {
        // Utility.debuggingLog(
        //     `Utility.dumpFile(): filename=${filename}`);
        try {
            fs.mkdirSync(path.dirname(filename), {recursive: true});
            fs.writeFileSync(filename, content, encoding);
        } catch (error) {
          // ---- NOTE ---- An error occurred
          Utility.debuggingThrow(`FAILED to dump a file: filename=${filename}, exception=${error}`);
          return "";
        }
        return filename;
    }
    public static exists(pathToFileSystemEntry: string): boolean {
        return fs.existsSync(pathToFileSystemEntry);
    }
    public static deleteFile(
        filename: string,
        ignoreEmptyFilename: boolean = true): string {
        // Utility.debuggingLog(
        //     `Utility.deleteFile(): filename=${filename}`);
        return Utility.unlink(filename, ignoreEmptyFilename);
    }
    public static moveFile(
        filename: string, targetDir: string): string {
        // Utility.debuggingLog(
        //     `Utility.moveFile(): filename=${filename}`);
        // Utility.debuggingLog(
        //     `Utility.moveFile(): targetDir=${targetDir}`);
        const filebasename: string = path.basename(filename);
        const destination: string = path.resolve(targetDir, filebasename);
        return Utility.rename(filename, destination);
    }

    public static unlink(
        entryname: string,
        ignoreEmptyEntryName: boolean = true): string {
        // Utility.debuggingLog(
        //     `Utility.unlink(): entryname=${entryname}`);
        try {
            if (Utility.isEmptyString(entryname)) {
                if (ignoreEmptyEntryName) {
                    return "";
                }
            }
            fs.unlinkSync(entryname);
        } catch (error) {
            // ---- NOTE ---- An error occurred
            Utility.debuggingThrow(`FAILED to unlink a entry: entryname=${entryname}, error=${error}`);
            return "";
        }
        return entryname;
    }
    public static rename(
        entryname: string, entrynameNew: string): string {
        // Utility.debuggingLog(
        //     `Utility.rename(): entryname=${entryname}`);
        // Utility.debuggingLog(
        //     `Utility.rename(): entrynameNew=${entrynameNew}`);
        try {
            fs.renameSync(entryname, entrynameNew);
        } catch (error) {
          // ---- NOTE ---- An error occurred
            Utility.debuggingThrow(`FAILED to rename a entry system entry: entryname=${entrynameNew}, entryname=${entrynameNew}, error=${error}`);
            return "";
        }
        return entryname;
    }

    public static carefullyAccessStringMap(stringMap: Map<string, number>, key: string): number {
        if (stringMap === undefined) {
            Utility.debuggingThrow(
                "stringMap === undefined");
        }
        if (!stringMap.has(key)) {
            Utility.debuggingThrow(
                `FAIL to use a key ${key} to access a stringMap ${Utility.jsonStringify(stringMap)}`);
        }
        const value: number = stringMap.get(key) as number;
        return value;
    }

    public static carefullyAccessStringDictionary(stringMap: {[id: string]: number}, key: string): number {
        if (stringMap === undefined) {
            Utility.debuggingThrow(
                "stringMap === undefined");
        }
        const value: number = stringMap[key];
        if (value === undefined) {
            Utility.debuggingThrow(
                `FAIL to use a key ${key} to access a stringMap ${Utility.jsonStringify(stringMap)}`);
        }
        return value;
    }

    public static carefullyAccessAnyArray(anyArray: any[], index: number): any {
        if (anyArray === undefined) {
            Utility.debuggingThrow(
                "anyArray === undefined");
        }
        if (index < 0) {
            Utility.debuggingThrow(
                `index ${index} not in range, anyArray.length=${anyArray.length}`);
        }
        if (index >= anyArray.length) {
            Utility.debuggingThrow(
                `index ${index} not in range, anyArray.length=${anyArray.length}`);
        }
        const value: any = anyArray[index];
        if (value === undefined) {
            Utility.debuggingThrow(
                `FAIL to use a index ${index} to access a anyArray ${Utility.jsonStringify(anyArray)}`);
        }
        return value;
    }
    public static carefullyAccessStringArray(stringArray: string[], index: number): string {
        if (stringArray === undefined) {
            Utility.debuggingThrow(
                "stringArray === undefined");
        }
        if (index < 0) {
            Utility.debuggingThrow(
                `index ${index} not in range, stringArray.length=${stringArray.length}`);
        }
        if (index >= stringArray.length) {
            Utility.debuggingThrow(
                `index ${index} not in range, stringArray.length=${stringArray.length}`);
        }
        const value: string = stringArray[index];
        if (value === undefined) {
            Utility.debuggingThrow(
                `FAIL to use a index ${index} to access a stringArray ${Utility.jsonStringify(stringArray)}`);
        }
        return value;
    }
    public static carefullyAccessNumberArray(numberArray: number[], index: number): number {
        if (numberArray === undefined) {
            Utility.debuggingThrow(
                "numberArray === undefined");
        }
        if (index < 0) {
            Utility.debuggingThrow(
                `index ${index} not in range, numberArray.length=${numberArray.length}`);
        }
        if (index >= numberArray.length) {
            Utility.debuggingThrow(
                `index ${index} not in range, numberArray.length=${numberArray.length}`);
        }
        const value: number = numberArray[index];
        if (value === undefined) {
            Utility.debuggingThrow(
                `FAIL to use a index ${index} to access a numberArray ${Utility.jsonStringify(numberArray)}`);
        }
        return value;
    }

    public static safeAccessAnyArray(anyArray: any[], index: number): any {
        if (anyArray === undefined) {
            return undefined;
        }
        if (index < 0) {
            return undefined;
        }
        if (index >= anyArray.length) {
            return undefined;
        }
        const value: any = anyArray[index];
        return value;
    }
    public static safeAccessStringArray(stringArray: string[], index: number): string|undefined {
        if (stringArray === undefined) {
            return undefined;
        }
        if (index < 0) {
            return undefined;
        }
        if (index >= stringArray.length) {
            return undefined;
        }
        const value: string = stringArray[index];
        return value;
    }
    public static safeAccessNumberArray(numberArray: number[], index: number): number|undefined {
        if (numberArray === undefined) {
            return undefined;
        }
        if (index < 0) {
            return undefined;
        }
        if (index >= numberArray.length) {
            return undefined;
        }
        const value: number = numberArray[index];
        return value;
    }

    public static canAccessAnyArray(anyArray: any[], index: number): boolean {
        if (anyArray === undefined) {
            return false;
        }
        if (index < 0) {
            return false;
        }
        if (index >= anyArray.length) {
            return false;
        }
        const value: any = anyArray[index];
        if (value === undefined) {
            return false;
        }
        return true;
    }
    public static canAccessStringArray(stringArray: string[], index: number): boolean {
        if (stringArray === undefined) {
            return false;
        }
        if (index < 0) {
            return false;
        }
        if (index >= stringArray.length) {
            return false;
        }
        const value: string = stringArray[index];
        if (value === undefined) {
            return false;
        }
        return true;
    }
    public static canAccessNumberArray(numberArray: number[], index: number): boolean {
        if (numberArray === undefined) {
            return false;
        }
        if (index < 0) {
            return false;
        }
        if (index >= numberArray.length) {
            return false;
        }
        const value: number = numberArray[index];
        if (value === undefined) {
            return false;
        }
        return true;
    }

    public static getObjectMd5Hash(objectValue: object): string|Int32Array {
        return Utility.getStringMd5Hash(Utility.jsonStringify(objectValue));
    }
    public static getStringMd5Hash(feature: string): string | Int32Array {
        return md5.Md5.hashStr(feature);
    }

    public static getPositiveObjectHashCode(objectValue: object): number {
        return Math.abs(Utility.getObjectHashCode(objectValue));
    }
    public static getObjectHashCode(objectValue: object): number {
        return Utility.getStringHashCode(Utility.jsonStringify(objectValue).toString());
    }
    public static getPositiveStringHashCode(feature: string): number {
        return Math.abs(Utility.getStringHashCode(feature));
    }
    public static getStringHashCode(feature: string): number {
        let hash: number = 0;
        if (!feature) {
            return hash;
        }
        if (feature.length === 0) {
            return hash;
        }
        for (let i: number = 0; i < feature.length; i++) {
            const char: number = feature.charCodeAt(i);
            // tslint:disable-next-line: no-bitwise
            hash = ((hash << 5) - hash) + char;
            // tslint:disable-next-line: no-bitwise
            hash |= 0; // ---- Convert to 32bit integer
        }
        return hash;
    }

    public static isEmptyValueCountPairArray(inputArray: Array<[number, number]>): boolean {
        return !(inputArray && inputArray.length > 0);
    }
    public static isEmptyNumberF32I32U8Arrays(inputArray: Float32Array[] | Int32Array[] | Uint8Array[]): boolean {
        return !(inputArray && inputArray.length > 0);
    }
    public static isEmptyNumberF32I32U8Array(inputArray: Float32Array | Int32Array | Uint8Array): boolean {
        return !(inputArray && inputArray.length > 0);
    }
    public static isEmptyGenericArrays<T>(inputArrays: boolean[][]): boolean {
        return !(inputArrays && inputArrays.length > 0);
    }
    public static isEmptyBooleanArrays(inputArrays: boolean[][]): boolean {
        return !(inputArrays && inputArrays.length > 0);
    }
    public static isEmptyNumberArrays(inputArrays: number[][]): boolean {
        return !(inputArrays && inputArrays.length > 0);
    }
    public static isEmptyStringArrays(inputArrays: string[][]): boolean {
        return !(inputArrays && inputArrays.length > 0);
    }
    public static isEmptyArrays(inputArrays: object[][]): boolean {
        return !(inputArrays && inputArrays.length > 0);
    }
    public static isEmptyGenericArray<T>(inputArray: T[]): boolean {
        return !(inputArray && inputArray.length > 0);
    }
    public static isEmptyAnyArray(inputArray: any[]): boolean {
        return !(inputArray && inputArray.length > 0);
    }
    public static isEmptyBooleanArray(inputArray: boolean[]): boolean {
        return !(inputArray && inputArray.length > 0);
    }
    public static isEmptyNumberArray(inputArray: number[]): boolean {
        return !(inputArray && inputArray.length > 0);
    }
    public static isEmptyStringArray(inputArray: string[]): boolean {
        return !(inputArray && inputArray.length > 0);
    }
    public static isEmptyArray(inputArray: object[]): boolean {
        return !(inputArray && inputArray.length > 0);
    }
    public static isEmptyString(input: string): boolean {
        return !(input && input.length > 0);
    }

    public static getSetLength<T>(set: Set<T>): number {
        return (set.size);
    }

    public static getJsonStringified(jsonObject: any, indents: number = 4): string {
        return JSON.stringify(jsonObject, null, indents);
    }

    public static writeLineToConsoleStdout(outputContents: string) {
        Utility.writeToConsoleStdout(`${outputContents}\n`);
    }
    public static writeLineToConsoleStderr(outputContents: string) {
        Utility.writeToConsoleStderr(`${outputContents}\n`);
    }

    public static writeToConsoleStdout(outputContents: string) {
        process.stdout.write(outputContents);
    }
    public static writeToConsoleStderr(outputContents: string) {
        process.stderr.write(outputContents);
    }

    public static debuggingLog(
        message: any): string {
        const dateTimeString: string = (new Date()).toISOString();
        const logMessage: string = `[${dateTimeString}] LOG-MESSAGE: ${Utility.jsonStringify(message)}`;
        if (Utility.toPrintDebuggingLogToConsole) {
        // eslint-disable-next-line no-console
        // tslint:disable-next-line: no-console
        console.log(logMessage);
        }
        return logMessage;
    }

    public static debuggingThrow(
        message: any): void {
        const dateTimeString: string = (new Date()).toISOString();
        const logMessage: string = `[${dateTimeString}] ERROR-MESSAGE: ${Utility.jsonStringify(message)}`;
        const error: Error = new Error(logMessage);
        const stackTrace: string = error.stack as string;
        Utility.debuggingLog(stackTrace);
        throw error;
    }

    public static almostEqual(first: number, second: number): boolean {
        const almostEqualPercentage: number = Utility.getAlmostEqualPercentage(first, second);
        const isAlmostEqual: boolean = almostEqualPercentage < Utility.epsilon;
        return isAlmostEqual;
    }
    public static almostEqualRough(first: number, second: number): boolean {
        const almostEqualPercentage: number = Utility.getAlmostEqualPercentage(first, second);
        const isAlmostEqual: boolean = almostEqualPercentage < Utility.epsilonRough;
        return isAlmostEqual;
    }
    public static getAlmostEqualPercentage(first: number, second: number): number {
        if (second === 0) {
            return Math.abs(first);
        }
        const almostEqualPercentage: number = Math.abs((first - second) / second);
        return almostEqualPercentage;
    }
    public static almostEqualAbsolute(first: number, second: number): boolean {
        const almostEqualAbsolute: number = Utility.getAlmostEqualAbsolute(first, second);
        const isAlmostEqualAbsolute: boolean = almostEqualAbsolute < Utility.epsilon;
        return isAlmostEqualAbsolute;
    }
    public static almostEqualAbsoluteRough(first: number, second: number): boolean {
        const almostEqualAbsolute: number = Utility.getAlmostEqualAbsolute(first, second);
        const isAlmostEqualAbsolute: boolean = almostEqualAbsolute < Utility.epsilonRough;
        return isAlmostEqualAbsolute;
    }
    public static getAlmostEqualAbsolute(first: number, second: number): number {
        const almostEqualAbsolute: number = Math.abs(first - second);
        return almostEqualAbsolute;
    }

    public static toBoolean(value: any): boolean {
        if (typeof(value) === "string") {
            value = (value as string).toLowerCase();
        }
        switch (value) {
            case true:
                return true;
            case "true":
                return true;
            case 1:
                return true;
            case "1":
                return true;
            case "on":
                return true;
            case "yes":
                return true;
            case "positive":
                return true;
            case false:
                return false;
            case "false":
                return false;
            case 0:
                return false;
            case "0":
                return false;
            case "off":
                return false;
            case "no":
                return false;
            case "negative":
                return false;
            default:
                return false;
        }
    }

    public static iterableIteratorToArray<K>(iterator: IterableIterator<K>): K[] {
        const anArray: K[] = [];
        for (const element of iterator) {
            anArray.push(element);
        }
        return anArray;
    }

    public static splitByPunctuation(
        input: string,
        splitDelimiter: string = " ",
        toRemoveEmptyElements: boolean = true,
        delimiters: string[] = Utility.LanguageTokenPunctuationDelimiters,
        replacementDelimiters: string[] = Utility.LanguageTokenPunctuationReplacementDelimiters): string[] {
        if (Utility.isEmptyStringArray(delimiters)) {
            delimiters = Utility.LanguageTokenPunctuationDelimiters;
        }
        if (Utility.isEmptyStringArray(replacementDelimiters)) {
            delimiters = Utility.LanguageTokenPunctuationReplacementDelimiters;
        }
        const numberDelimiters: number = delimiters.length;
        for (let i = 0; i < numberDelimiters; i++) {
            input = input.replace(delimiters[i], replacementDelimiters[i]);
        }
        let result: string[] = Utility.split(input, splitDelimiter);
        if (toRemoveEmptyElements) {
            result = result.filter((element: string) => {
                return (element && (element !== ""));
            });
        }
        return result;
    }

    public static splitStringWithCommaDelimitersFilteredByDoubleQuotes(input: string): string[] {
        return Utility.splitStringWithColumnDelimitersFilteredByQuotingDelimiters(
            input,
            ",",
            "\"");
        // ---- NOTE-FOR-REFERENCE ---- const splittedStrings: string[] = [];
        // ---- NOTE-FOR-REFERENCE ---- const commaIndexIndexes: number[] =
        // ---- NOTE-FOR-REFERENCE ----     Utility.getCommaIndexesFilteredByDoubleQuotes(input);
        // ---- NOTE-FOR-REFERENCE ---- let index: number = 0;
        // ---- NOTE-FOR-REFERENCE ---- for (const commaIndex of commaIndexIndexes) {
        // ---- NOTE-FOR-REFERENCE ----     splittedStrings.push(input.substring(index, commaIndex));
        // ---- NOTE-FOR-REFERENCE ----     index = commaIndex + 1;
        // ---- NOTE-FOR-REFERENCE ---- }
        // ---- NOTE-FOR-REFERENCE ---- splittedStrings.push(input.substring(index));
        // ---- NOTE-FOR-REFERENCE ---- return splittedStrings;
    }
    public static splitStringWithColumnDelimitersFilteredByQuotingDelimiters(
        input: string,
        delimiter: string,
        delimiterQuoting: string): string[] {
        const splittedStrings: string[] = [];
        const commaIndexIndexes: number[] = Utility.getColumnDelimiterIndexesFilteredByQuotingDelimiters(
            input,
            delimiter,
            delimiterQuoting);
        let index: number = 0;
        for (const commaIndex of commaIndexIndexes) {
            splittedStrings.push(input.substring(index, commaIndex));
            index = commaIndex + 1;
        }
        splittedStrings.push(input.substring(index));
        return splittedStrings;
    }

    public static getCommaIndexesFilteredByDoubleQuotes(input: string): number[] {
        return Utility.getColumnDelimiterIndexesFilteredByQuotingDelimiters(
            input,
            ",",
            "\"");
        // ---- NOTE-FOR-REFERENCE ---- const commaIndexes: number[] = Utility.getCommaIndexes(input);
        // ---- NOTE-FOR-REFERENCE ---- return Utility.filterOrderedNumberArrayFromOrderedRanges(
        // ---- NOTE-FOR-REFERENCE ----     commaIndexes,
        // ---- NOTE-FOR-REFERENCE ----     Utility.getDoubleQuoteIndexPairs(input));
    }
    public static getColumnDelimiterIndexesFilteredByQuotingDelimiters(
        input: string,
        delimiter: string,
        delimiterQuoting: string): number[] {
        const delimiterIndexes: number[] = Utility.getDelimiterIndexes(input, delimiter);
        return Utility.filterOrderedNumberArrayFromOrderedRanges(
            delimiterIndexes,
            Utility.getDelimiterIndexPairs(input, delimiterQuoting));
    }
    public static filterOrderedNumberArrayFromOrderedRanges(
        anArray: number[],
        filteringRanges: number[][]): number[] {
        const filteredArray: number[] = [];
        let indexArray: number = 0;
        const arrayLength: number = anArray.length;
        let indexfilteringRanges: number = 0;
        const filteringRangesLength: number = filteringRanges.length;
        while (indexArray < arrayLength) {
            const element: number = anArray[indexArray++];
            let filtered: boolean = false;
            while (indexfilteringRanges < filteringRangesLength) {
                const filteringRange: number[] = filteringRanges[indexfilteringRanges];
                const filteringRangeBegin: number = filteringRange[0];
                const filteringRangeEnd: number = filteringRange[1];
                if (element < filteringRangeBegin) {
                    break;
                }
                if (element < filteringRangeEnd) {
                    filtered = true;
                    break;
                }
                if (element >= filteringRangeEnd) {
                    indexfilteringRanges++;
                }
            }
            if (!filtered) {
                filteredArray.push(element);
            }
        }
        return filteredArray;
    }

    public static getDoubleQuoteIndexPairs(input: string): number[][] {
        return Utility.arrayToPairArray(Utility.getDoubleQuoteIndexes(input), input.length);
    }
    public static getDelimiterIndexPairs(input: string, delimiter: string): number[][] {
        return Utility.arrayToPairArray(Utility.getDelimiterIndexes(input, delimiter), input.length);
    }
    public static arrayToPairArray<T>(anArray: T[], lastElement: T): T[][] {
        const pairArray: T[][] = [];
        const arrayLength: number = anArray.length;
        let index: number = 0;
        while (index < arrayLength) {
            const firstElement: T = anArray[index++];
            let secondElement: T = lastElement;
            if (index < arrayLength) {
                secondElement = anArray[index++];
            }
            pairArray.push([firstElement, secondElement]);
        }
        return pairArray;
    }

    public static getCommaIndexes(input: string): number[] {
        return Utility.getDelimiterIndexes(input, ",");
    }
    public static getDoubleQuoteIndexes(input: string): number[] {
        return Utility.getDelimiterIndexes(input, "\"");
    }
    public static getDelimiterIndexes(input: string, delimiter: string): number[] {
        const delimiterIndexes: number[] = [];
        const inputLength: number = input.length;
        let inputIndex: number = 0;
        while (inputIndex < inputLength) {
            const delimiterIndex: number = input.indexOf(delimiter, inputIndex);
            if (delimiterIndex < 0) {
                break;
            }
            delimiterIndexes.push(delimiterIndex);
            inputIndex = delimiterIndex + 1;
        }
        return delimiterIndexes;
    }

    public static getFloorInteger(input: number): number {
        return Math.floor(input);
    }
    public static getRoundInteger(input: number): number {
        return Math.round(input);
    }

    public static cloneArray<T>(inputArray: T[]): T[] {
        const clonedArray  = Object.assign([], inputArray);
        return clonedArray;
    }
    public static cloneGenericObject<T>(anObject: T): T {
        const clonedObject = Object.assign({}, anObject);
        return clonedObject;
    }
    public static cloneObject(anObject: object): object {
        const clonedObject = Object.assign({}, anObject);
        return clonedObject;
    }

    public static getFileBasename(filename: string): string {
        return path.basename(filename);
    }
    public static getFileDirname(filename: string): string {
        return path.dirname(filename);
    }
    public static getFileExtname(filename: string): string {
        return path.extname(filename);
    }
    public static getFilenameWithoutExtension(filename: string): string {
        const extension: string = Utility.getFileExtname(filename);
        const filenameWithoutExtension: string = filename.substring(0, filename.length - extension.length);
        return filenameWithoutExtension;
    }

    public static stringifyArray<T>(
        anArray: T[],
        delimiter: string = ","): string {
        return "[" + anArray.join(delimiter) + "]";
    }
    public static jsonStringifyInLine(
        value: any): string {
        return Utility.jsonStringify(value, null, "");
    }
    public static jsonStringify(
        value: any,
        replacer: Array<number | string> | null = null,
        space: string | number = 4): string {
        return JSON.stringify(value, replacer, space);
    }

    public static split(input: string, delimiter: string): string[] {
        return Utility.splitRaw(input, delimiter).map((x: string) => x.trim());
    }
    public static splitRaw(input: string, delimiter: string): string[] {
        return input.split(delimiter);
    }

    public static normalizeArray<T>(array: T[], indexKey: keyof T): { [key: string]: T } {
        const normalizedObject: { [key: string]: T } = {};
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < array.length; i++) {
            const key: any = array[i][indexKey];
            normalizedObject[key] = array[i];
        }
        return normalizedObject;
    }

    public static sparseArrayPairToMap<T>(indexArray: number[], valueArray: number[]): Map<number, number> {
        const sparseIndexedMap: Map<number, number> = new Map<number, number>();
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < indexArray.length; i++) {
            const key: number = indexArray[i];
            const value: number = valueArray[i];
            sparseIndexedMap.set(key, value);
        }
        return sparseIndexedMap;
    }

    public static sortAnyArray(inputAnyArray: any[]): any[] {
        if (Utility.isEmptyAnyArray(inputAnyArray)) { return []; }
        return inputAnyArray.sort(
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
    public static sortNumberArray(inputNumberArray: number[]): number[] {
        if (Utility.isEmptyNumberArray(inputNumberArray)) { return []; }
        return inputNumberArray.sort(
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
        if (Utility.isEmptyStringArray(inputStringArray)) { return []; }
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
    public static sortValueCountPairArray(inputValueCountPairArray: Array<[number, number]>): Array<[number, number]> {
        if (Utility.isEmptyValueCountPairArray(inputValueCountPairArray)) { return []; }
        return inputValueCountPairArray.sort(
            (valueCountPair1: [number, number], valueCountPair2: [number, number]) => {
                if (valueCountPair1[0] > valueCountPair2[0]) {
                    return 1;
                }
                if (valueCountPair1[0] < valueCountPair2[0]) {
                    return -1;
                }
                return 0;
          });
    }

    public static findMedian(
        inputNumberArray: number[]): number|undefined {
        if (Utility.isEmptyNumberArray(inputNumberArray)) { return undefined; }
        const sortedNumberArray: number[] =
            Utility.sortNumberArray(inputNumberArray);
        if (Utility.isEmptyNumberArray(sortedNumberArray)) { return undefined; }
        const count: number = sortedNumberArray.length;
        let median: number;
        {
            const middleIndex: number = Math.floor(count / 2);
            if (count % 2 === 0) {
                median = (sortedNumberArray[middleIndex] + sortedNumberArray[middleIndex - 1]) / 2;
            } else {
                median = sortedNumberArray[middleIndex];
            }
        }
        return median;
    }
    public static findValueCountPairMedian(
        inputValueCountPairArray: Array<[number, number]>): number|undefined {
        if (Utility.isEmptyValueCountPairArray(inputValueCountPairArray)) { return undefined; }
        const sortedValueCountPairArray: Array<[number, number]> =
            Utility.sortValueCountPairArray(inputValueCountPairArray);
        if (Utility.isEmptyValueCountPairArray(sortedValueCountPairArray)) { return undefined; }
        const totalCount: number = sortedValueCountPairArray.reduce(
            (accumulative: number, entry: [number, number]) => accumulative + entry[1], 0);
        if (totalCount > 0) {
            const middleCount: number = Math.floor(totalCount / 2);
            const isEven: boolean = (totalCount % 2) === 0;
            let accumulativeCountPrevious: number = 0;
            let accumulativeCount: number = 0;
            // tslint:disable-next-line: prefer-for-of
            for (let index: number = 0; index < sortedValueCountPairArray.length; index++) {
                const count: number = sortedValueCountPairArray[index][1];
                accumulativeCount += count;
                if (accumulativeCount > middleCount) {
                    const value: number = sortedValueCountPairArray[index][0];
                    if (!isEven) {
                        return value;
                    }
                    if ((middleCount - accumulativeCountPrevious) > 0) {
                        return value;
                    }
                    const valuePrevious: number = sortedValueCountPairArray[index - 1][0];
                    return (value + valuePrevious) / 2;
                }
                accumulativeCountPrevious = accumulativeCount;
            }
        }
        return undefined;
    }
    public static findQuantiles(
        inputNumberArray: number[],
        quantileConfiguration: number): number[]|undefined {
        if (!quantileConfiguration || (quantileConfiguration < 2)) {
            return undefined;
        }
        if (Utility.isEmptyNumberArray(inputNumberArray)) { return undefined; }
        const sortedNumberArray: number[] =
            Utility.sortNumberArray(inputNumberArray);
        if (Utility.isEmptyNumberArray(sortedNumberArray)) { return undefined; }
        const count: number = sortedNumberArray.length;
        const step: number = count / quantileConfiguration;
        if (step < 1)  { return undefined; }
        const quantiles: number[] = [sortedNumberArray[0]];
        let currentQuantileIndex: number = 0;
        for (let quantileIndex: number = 0; quantileIndex < quantileConfiguration - 1; quantileIndex ++) {
            currentQuantileIndex += step;
            quantiles.push(sortedNumberArray[Math.floor(currentQuantileIndex)]);
        }
        quantiles.push(sortedNumberArray[sortedNumberArray.length - 1]);
        return quantiles;
    }
    public static findValueCountPairQuantiles(
        inputValueCountPairArray: Array<[number, number]>,
        quantileConfiguration: number): number[]|undefined {
        if (!quantileConfiguration || (quantileConfiguration < 2)) {
            return undefined;
        }
        if (Utility.isEmptyValueCountPairArray(inputValueCountPairArray)) { return undefined; }
        const sortedValueCountPairArray: Array<[number, number]> =
            Utility.sortValueCountPairArray(inputValueCountPairArray);
        if (Utility.isEmptyValueCountPairArray(sortedValueCountPairArray)) { return undefined; }
        const totalCount: number = sortedValueCountPairArray.reduce(
            (accumulative: number, entry: [number, number]) => accumulative + entry[1], 0);
        const step: number = totalCount / quantileConfiguration;
        if (step < 1)  { return undefined; }
        const quantiles: number[] = [sortedValueCountPairArray[0][0]];
        let currentQuantileIndex: number = 0;
        // ---- NOTE ---- the following nested-loop can be optimized.
        for (let quantileIndex: number = 0; quantileIndex < quantileConfiguration - 1; quantileIndex ++) {
            currentQuantileIndex += step;
            let accumulativeCountPrevious: number = 0;
            let accumulativeCount: number = 0;
            // tslint:disable-next-line: prefer-for-of
            for (let index: number = 0; index < sortedValueCountPairArray.length; index++) {
                const count: number = sortedValueCountPairArray[index][1];
                accumulativeCount += count;
                if (accumulativeCount > currentQuantileIndex) {
                    const value: number = sortedValueCountPairArray[index][0];
                    quantiles.push(value);
                    break;
                }
                accumulativeCountPrevious = accumulativeCount;
            }
        }
        quantiles.push(sortedValueCountPairArray[sortedValueCountPairArray.length -  1][0]);
        return quantiles;
    }

    protected static rngBurninIterations: number = 16384;
    protected static rngBurninDone: boolean = false;
    protected static xorshift128plusState0: number = 1;
    protected static xorshift128plusState1: number = 2;

    protected static rngBurninIterationsForBigInt: number = 16384;
    protected static rngBurninDoneForBigInt: boolean = false;
    protected static bigIntNegativeOne: bigint = BigInt(-1);
    protected static bigint23: bigint = BigInt(23);
    protected static bigint17: bigint = BigInt(17);
    protected static bigint26: bigint = BigInt(26);
    protected static xorshift128plusState0BigInt: bigint = BigInt(1);
    protected static xorshift128plusState1BigInt: bigint = BigInt(2);
    protected static xorshift128plusCycleBigInt: bigint =
        BigInt("0xffffffffffffffff"); // ---- NOTE: 2^64 - 1 === 18446744073709551615
    protected static xorshift128plusCycleFloatBigInt: number =
        Number(Utility.xorshift128plusCycleBigInt);

}
