/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { IEntityAnnotationObject } from "../../src/data/IEntityAnnotationObject";
// import { IEntityObjectByPosition } from "../../src/data/IEntityObjectByPosition";
// import { IPartOfSpeechTagObjectByPosition } from "../../src/data/IPartOfSpeechTagObjectByPosition";
// import { ITextIntentSequenceLabelObjectByPosition} from "../../src/data/ITextIntentSequenceLabelObjectByPosition";

import { IDictionaryStringIdGenericArray } from "../../src/data_structure/IDictionaryStringIdGenericArray";
import { IDictionaryStringIdGenericValue } from "../../src/data_structure/IDictionaryStringIdGenericValue";

import { DictionaryMapUtility } from "../../src/data_structure/DictionaryMapUtility";

import { StructValueCount } from "../../src/label_structure/StructValueCount";

import { TMapStringKeyGenericArray } from "../../src/data_structure/TMapStringKeyGenericArray";
import { TMapStringKeyGenericValue } from "../../src/data_structure/TMapStringKeyGenericValue";

import { Utility } from "../../src/utility/Utility";

export class UnitTestHelper {

    public static getDefaultFunctionalTestTimeout(): number {
        return 3000000;
    }
    public static getDefaultUnitTestTimeout(): number {
        return 100000;
    }
    public static getDefaultUnitTestDebuggingLogFlag(): boolean {
        return false;
    }
    public static getDefaultUnitTestCleanUpFlag(): boolean {
        return true;
    }
    public static getIgnoreFlag(): boolean {
        return false;
    }
}

describe("Test Suite - utility/Utility", () => {
    it("Test.0000 incrementKeyValueNumberMap()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMap: Map<string, number> = new Map<string, number>();
        Utility.incrementKeyValueNumberMap(stringNumberMap, "a");
        Utility.debuggingLog(
            `stringNumberMap.get("a")=${stringNumberMap.get("a")}`);
        Utility.incrementKeyValueNumberMap(stringNumberMap, "a");
        Utility.debuggingLog(
            `stringNumberMap.get("a")=${stringNumberMap.get("a")}`);
        assert.ok(stringNumberMap.get("a") === 2,
            `stringNumberMap.get("a")=${stringNumberMap.get("a")}`);
    });
    it("Test.0001 addKeyValueToNumberMapSet()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapSet: Map<string, Set<number>> = new Map<string, Set<number>>();
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 1);
        Utility.debuggingLog(
            `stringNumberMapSet.get("a")=${stringNumberMapSet.get("a")}`);
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 2);
        Utility.debuggingLog(
            `stringNumberMapSet.get("a")=${stringNumberMapSet.get("a")}`);
        assert.ok((stringNumberMapSet.get("a") as Set<number>).size === 2,
            `(stringNumberMapSet.get("a") as Set<number>).size=${(stringNumberMapSet.get("a") as Set<number>).size}`);
    });
    it("Test.0002 addToNumberMapSet()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapSet: Map<string, Set<number>> = new Map<string, Set<number>>();
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 1);
        Utility.debuggingLog(
            `stringNumberMapSet.get("a")=${stringNumberMapSet.get("a")}`);
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 2);
        Utility.debuggingLog(
            `stringNumberMapSet.get("a")=${stringNumberMapSet.get("a")}`);
        const stringNumberMapSetAddedTo: Map<string, Set<number>> = new Map<string, Set<number>>();
        Utility.addKeyValueToNumberMapSet(stringNumberMapSetAddedTo, "a", 1);
        Utility.debuggingLog(
            `stringNumberMapSet.get("a")=${stringNumberMapSetAddedTo.get("a")}`);
        Utility.addKeyValueToNumberMapSet(stringNumberMapSetAddedTo, "a", 3);
        Utility.debuggingLog(
            `stringNumberMapSet.get("a")=${stringNumberMapSetAddedTo.get("a")}`);
        Utility.addToNumberMapSet(
            stringNumberMapSetAddedTo,
            stringNumberMapSet);
        assert.ok((stringNumberMapSetAddedTo.get("a") as Set<number>).size === 3,
            `(stringNumberMapSet.get("a") as Set<number>).size=${(stringNumberMapSetAddedTo.get("a") as Set<number>).size}`);
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 4);
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 5);
        Utility.addToNumberMapSet(
            stringNumberMapSetAddedTo,
            stringNumberMapSet,
            4);
        assert.ok((stringNumberMapSetAddedTo.get("a") as Set<number>).size === 4,
            `(stringNumberMapSet.get("a") as Set<number>).size=${(stringNumberMapSetAddedTo.get("a") as Set<number>).size}`);
        Utility.addToNumberMapSet(
            stringNumberMapSetAddedTo,
            stringNumberMapSet);
        assert.ok((stringNumberMapSetAddedTo.get("a") as Set<number>).size === 5,
            `(stringNumberMapSet.get("a") as Set<number>).size=${(stringNumberMapSetAddedTo.get("a") as Set<number>).size}`);
    });
    it("Test.0003 addKeyValueToNumberMapArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapArray: Map<string, number[]> = new Map<string, number[]>();
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 1);
        Utility.debuggingLog(
            `stringNumberMapArray.get("a")=${stringNumberMapArray.get("a")}`);
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 2);
        Utility.debuggingLog(
            `stringNumberMapArray.get("a")=${stringNumberMapArray.get("a")}`);
        assert.ok((stringNumberMapArray.get("a") as number[]).length === 2,
            `(stringNumberMapArray.get("a") as number[]).length=${(stringNumberMapArray.get("a") as number[]).length}`);
    });
    it("Test.0004 addToNumberMapSet()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapArray: Map<string, number[]> = new Map<string, number[]>();
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 1);
        Utility.debuggingLog(
            `stringNumberMapArray.get("a")=${stringNumberMapArray.get("a")}`);
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 2);
        Utility.debuggingLog(
            `stringNumberMapArray.get("a")=${stringNumberMapArray.get("a")}`);
        const stringNumberMapArrayAddedTo: Map<string, number[]> = new Map<string, number[]>();
        Utility.addKeyValueToNumberMapArray(stringNumberMapArrayAddedTo, "a", 1);
        Utility.debuggingLog(
            `stringNumberMapArray.get("a")=${stringNumberMapArrayAddedTo.get("a")}`);
        Utility.addKeyValueToNumberMapArray(stringNumberMapArrayAddedTo, "a", 3);
        Utility.debuggingLog(
            `stringNumberMapArray.get("a")=${stringNumberMapArrayAddedTo.get("a")}`);
        Utility.addToNumberMapArray(
            stringNumberMapArrayAddedTo,
            stringNumberMapArray);
        assert.ok((stringNumberMapArrayAddedTo.get("a") as number[]).length === 4,
            `A: (stringNumberMapArray.get("a") as number[]).length=${(stringNumberMapArrayAddedTo.get("a") as number[]).length}`);
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 4);
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 5);
        Utility.addToNumberMapArray(
            stringNumberMapArrayAddedTo,
            stringNumberMapArray,
            4);
        assert.ok((stringNumberMapArrayAddedTo.get("a") as number[]).length === 4,
            `B: (stringNumberMapArray.get("a") as number[]).length=${(stringNumberMapArrayAddedTo.get("a") as number[]).length}`);
        Utility.addToNumberMapArray(
            stringNumberMapArrayAddedTo,
            stringNumberMapArray);
        assert.ok((stringNumberMapArrayAddedTo.get("a") as number[]).length === 8,
            `C: (stringNumberMapArray.get("a") as number[]).length=${(stringNumberMapArrayAddedTo.get("a") as number[]).length}`);
    });

    it("Test.0100 mapToJsonSerialization()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMap: Map<string, number> = new Map<string, number>();
        stringNumberMap.set("a", 1);
        const mapInString: string = Utility.mapToJsonSerialization(stringNumberMap);
        Utility.debuggingLog(
            `mapInString=${mapInString}`);
    });
    it("Test.0101 jsonSerializationToMap()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMap: Map<string, number> = new Map<string, number>();
        stringNumberMap.set("a", 1);
        const mapInString: string = Utility.mapToJsonSerialization(stringNumberMap);
        Utility.debuggingLog(
            `mapInString=${mapInString}`);
        const stringNumberMapNew: Map<string, number> = Utility.jsonSerializationToMap(mapInString);
        assert.ok(stringNumberMapNew.get("a") === 1,
            `stringNumberMapNew.get("a")=${stringNumberMapNew.get("a")}`);
    });
    it("Test.0102 setToJsonSerialization()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberSet: Set<string> = new Set<string>();
        stringNumberSet.add("a");
        const setInString: string = Utility.setToJsonSerialization(stringNumberSet);
        Utility.debuggingLog(
            `setInString=${setInString}`);
    });
    it("Test.0103 jsonSerializationToSet()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberSet: Set<string> = new Set<string>();
        stringNumberSet.add("a");
        const setInString: string = Utility.setToJsonSerialization(stringNumberSet);
        Utility.debuggingLog(
            `setInString=${setInString}`);
        const stringNumberSetNew: Set<string> = Utility.jsonSerializationToSet(setInString);
        assert.ok(stringNumberSetNew.size === 1,
            `stringNumberSetNew.size=${stringNumberSetNew.size}`);
        assert.ok(stringNumberSetNew.has("a"),
            `stringNumberSetNew.has("a")=${stringNumberSetNew.has("a")}`);
    });
    it("Test.0104 arrayToJsonSerialization()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberArray: string[] = [];
        stringNumberArray.push("a");
        const arrayInString: string = Utility.arrayToJsonSerialization(stringNumberArray);
        Utility.debuggingLog(
            `arrayInString=${arrayInString}`);
    });
    it("Test.0105 jsonSerializationToArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberArray: string[] = [];
        stringNumberArray.push("a");
        const arrayInString: string = Utility.arrayToJsonSerialization(stringNumberArray);
        Utility.debuggingLog(
            `arrayInString=${arrayInString}`);
        const stringNumberArrayNew: string[] = Utility.jsonSerializationToArray(arrayInString);
        assert.ok(stringNumberArrayNew.length === 1,
            `stringNumberArrayNew.length=${stringNumberArrayNew.length}`);
        // tslint:disable-next-line: triple-equals
        assert.ok(stringNumberArrayNew[0] == "a", // ---- NOTE: === will fail!
            `stringNumberArrayNew[0]=${stringNumberArrayNew[0]}`);
    });

    it("Test.0200 stringMapToObject()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMap: Map<string, number> = new Map<string, number>();
        stringNumberMap.set("a", 1);
        const mapInObject: any = Utility.stringMapToObject(stringNumberMap);
        const mapInJsonString: string =
            Utility.jsonStringify(mapInObject);
        Utility.debuggingLog(
            `mapInJsonString=${mapInJsonString}`);
    });
    it("Test.0201 jsonToStringMap()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMap: Map<string, number> = new Map<string, number>();
        stringNumberMap.set("a", 1);
        const mapInObject: any = Utility.stringMapToObject(stringNumberMap);
        const mapInJsonString: string =
            Utility.jsonStringify(mapInObject);
        Utility.debuggingLog(
            `mapInJsonString=${mapInJsonString}`);
        const mapInObjectFromJsonString: Map<string, number> =
            Utility.jsonToStringMap(mapInJsonString);
        assert.ok(mapInObjectFromJsonString.get("a") === 1,
            `mapInObjectFromJsonString.get("a")=${mapInObjectFromJsonString.get("a")}`);
    });

    it("Test.0300 stringMapSetToObject()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapSet: Map<string, Set<number>> = new Map<string, Set<number>>();
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 1);
        const stringMapSetInObject: any =
            Utility.stringMapSetToObject(stringNumberMapSet);
        const mapSetInJsonString: string =
            Utility.jsonStringify(stringMapSetInObject);
        Utility.debuggingLog(
            `mapSetInJsonString=${mapSetInJsonString}`);
    });
    it("Test.0301 objectToStringMapSet()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapSet: Map<string, Set<number>> = new Map<string, Set<number>>();
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 1);
        const stringMapSetInObject: any =
            Utility.stringMapSetToObject(stringNumberMapSet);
        const mapSetInJsonString: string =
            Utility.jsonStringify(stringMapSetInObject);
        Utility.debuggingLog(
            `mapSetInJsonString=${mapSetInJsonString}`);
        const stringNumberMapSetNew: Map<string, Set<number>> =
            Utility.objectToStringMapSet(stringMapSetInObject);
        Utility.debuggingLog(
            `(stringNumberMapSetNew.get("a") as Set<number>).size=` +
            `${(stringNumberMapSetNew.get("a") as Set<number>).size}`);
        const stringMapSetNewInObject: any =
            Utility.stringMapSetToObject(stringNumberMapSetNew);
        const mapSetNewInJsonString: string =
            Utility.jsonStringify(stringMapSetNewInObject);
        Utility.debuggingLog(
            `mapSetNewInJsonString=${mapSetNewInJsonString}`);
        assert.ok((stringNumberMapSetNew.get("a") as Set<number>).size === 1,
            `(stringNumberMapSetNew.get("a") as Set<number>).size=` +
            `${(stringNumberMapSetNew.get("a") as Set<number>).size}`);
        assert.ok((stringNumberMapSetNew.get("a") as Set<number>).has(1),
            `(stringNumberMapSetNew.get("a") as Set<number>).has(1)=` +
            `${(stringNumberMapSetNew.get("a") as Set<number>).has(1)}`);
    });
    it("Test.0302 stringMapArrayToObject()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapArray: Map<string, number[]> = new Map<string, number[]>();
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 1);
        const stringMapArrayInObject: any =
            Utility.stringMapArrayToObject(stringNumberMapArray);
        const mapArrayInJsonString: string =
            Utility.jsonStringify(stringMapArrayInObject);
        Utility.debuggingLog(
            `mapArrayInJsonString=${mapArrayInJsonString}`);
    });
    it("Test.0303 objectToStringMapArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapArray: Map<string, number[]> = new Map<string, number[]>();
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 1);
        const stringMapArrayInObject: any =
            Utility.stringMapArrayToObject(stringNumberMapArray);
        const mapArrayInJsonString: string =
            Utility.jsonStringify(stringMapArrayInObject);
        Utility.debuggingLog(
            `mapArrayInJsonString=${mapArrayInJsonString}`);
        const stringNumberMapArrayNew: Map<string, number[]> =
            Utility.objectToStringMapArray(stringMapArrayInObject);
        Utility.debuggingLog(
            `(stringNumberMapArrayNew.get("a") as number[]).size=` +
            `${(stringNumberMapArrayNew.get("a") as number[]).length}`);
        const stringMapArrayNewInObject: any =
            Utility.stringMapArrayToObject(stringNumberMapArrayNew);
        const mapArrayNewInJsonString: string =
            Utility.jsonStringify(stringMapArrayNewInObject);
        Utility.debuggingLog(
            `mapArrayNewInJsonString=${mapArrayNewInJsonString}`);
        assert.ok((stringNumberMapArrayNew.get("a") as number[]).length === 1,
            `(stringNumberMapArrayNew.get("a") as number[]).length=` +
            `${(stringNumberMapArrayNew.get("a") as number[]).length}`);
        // tslint:disable-next-line: triple-equals
        assert.ok((stringNumberMapArrayNew.get("a") as number[])[0] == 1, // ---- NOTE: === will fail!
            `((stringNumberMapArrayNew.get("a") as number[])[0]==1)=` +
            `${(stringNumberMapArrayNew.get("a") as number[])[0] === 1}`);
    });

    it("Test.0400 stringMapSetToJson()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapSet: Map<string, Set<number>> = new Map<string, Set<number>>();
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 1);
        const stringMapSetInJson: string =
            Utility.stringMapSetToJson(stringNumberMapSet);
        const mapSetInJsonString: string =
            Utility.jsonStringify(stringMapSetInJson);
        Utility.debuggingLog(
            `mapSetInJsonString=${mapSetInJsonString}`);
    });
    it("Test.0401 jsonToStringMapSet()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapSet: Map<string, Set<number>> = new Map<string, Set<number>>();
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 1);
        const stringMapSetInJson: string =
            Utility.stringMapSetToJson(stringNumberMapSet);
        const mapSetInJsonString: string =
            Utility.jsonStringify(stringMapSetInJson);
        Utility.debuggingLog(
            `mapSetInJsonString=${mapSetInJsonString}`);
        const stringNumberMapSetNew: Map<string, Set<number>> =
            Utility.jsonToStringMapSet(stringMapSetInJson);
        Utility.debuggingLog(
            `(stringNumberMapSetNew.get("a") as Set<number>).size=` +
            `${(stringNumberMapSetNew.get("a") as Set<number>).size}`);
        const stringMapSetNewInJson: string =
            Utility.stringMapSetToJson(stringNumberMapSetNew);
        const mapSetNewInJsonString: string =
            Utility.jsonStringify(stringMapSetNewInJson);
        Utility.debuggingLog(
            `mapSetNewInJsonString=${mapSetNewInJsonString}`);
        assert.ok((stringNumberMapSetNew.get("a") as Set<number>).size === 1,
            `(stringNumberMapSetNew.get("a") as Set<number>).size=` +
            `${(stringNumberMapSetNew.get("a") as Set<number>).size}`);
        assert.ok((stringNumberMapSetNew.get("a") as Set<number>).has(1),
            `(stringNumberMapSetNew.get("a") as Set<number>).has(1)=` +
            `${(stringNumberMapSetNew.get("a") as Set<number>).has(1)}`);
    });
    it("Test.0402 stringMapArrayToJson()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapArray: Map<string, number[]> = new Map<string, number[]>();
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 1);
        const stringMapArrayInJson: string =
            Utility.stringMapArrayToJson(stringNumberMapArray);
        const mapArrayInJsonString: string =
            Utility.jsonStringify(stringMapArrayInJson);
        Utility.debuggingLog(
            `mapArrayInJsonString=${mapArrayInJsonString}`);
    });
    it("Test.0403 jsonToStringMapArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapArray: Map<string, number[]> = new Map<string, number[]>();
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 1);
        const stringMapArrayInJson: string =
            Utility.stringMapArrayToJson(stringNumberMapArray);
        const mapArrayInJsonString: string =
            Utility.jsonStringify(stringMapArrayInJson);
        Utility.debuggingLog(
            `mapArrayInJsonString=${mapArrayInJsonString}`);
        const stringNumberMapArrayNew: Map<string, number[]> =
            Utility.jsonToStringMapArray(stringMapArrayInJson);
        Utility.debuggingLog(
            `(stringNumberMapArrayNew.get("a") as number[]).size=` +
            `${(stringNumberMapArrayNew.get("a") as number[]).length}`);
        const stringMapArrayNewInJson: string =
            Utility.stringMapArrayToJson(stringNumberMapArrayNew);
        const mapArrayNewInJsonString: string =
            Utility.jsonStringify(stringMapArrayNewInJson);
        Utility.debuggingLog(
            `mapArrayNewInJsonString=${mapArrayNewInJsonString}`);
        assert.ok((stringNumberMapArrayNew.get("a") as number[]).length === 1,
            `(stringNumberMapArrayNew.get("a") as number[]).length=` +
            `${(stringNumberMapArrayNew.get("a") as number[]).length}`);
        // tslint:disable-next-line: triple-equals
        assert.ok((stringNumberMapArrayNew.get("a") as number[])[0] == 1, // ---- NOTE: === will fail!
            `((stringNumberMapArrayNew.get("a") as number[])[0]==1)=` +
            `${(stringNumberMapArrayNew.get("a") as number[])[0] === 1}`);
    });

    it("Test.0500 getXorshift128plusState0()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const xorshift128plusState0: number = Utility.getXorshift128plusState0();
        Utility.debuggingLog(
            `xorshift128plusState0=${xorshift128plusState0}`);
    });
    it("Test.0501 getXorshift128plusState1()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const xorshift128plusState1: number = Utility.getXorshift128plusState1();
        Utility.debuggingLog(
            `xorshift128plusState1=${xorshift128plusState1}`);
    });
    it("Test.0502 rngSeedXorshift128plus()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.rngSeedXorshift128plus(3, 4);
        for (let i = 0; i < 16; i++) {
            const r: number = Utility.rngNextXorshift128plus();
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
        }
    });
    it("Test.0503 rngNextXorshift128plus()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.rngSeedXorshift128plus(3, 4);
        const randomArray: number[] = [];
        for (let i = 0; i < 16; i++) {
            const r: number = Utility.rngNextXorshift128plus();
            randomArray.push(r);
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
        }
        Utility.rngSeedXorshift128plus(3, 4);
        for (let i = 0; i < 16; i++) {
            const r: number = Utility.rngNextXorshift128plus();
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
            assert.ok(r === randomArray[i],
                `i=${i}, r=${r}, randomArray[i]=${randomArray[i]}`);
        }
    });
    it("Test.0504 getXorshift128plusState0WithBigIntStates()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const xorshift128plusState0BigInt: bigint = Utility.getXorshift128plusState0WithBigIntStates();
        Utility.debuggingLog(
            `xorshift128plusState0BigInt=${xorshift128plusState0BigInt}`);
    });
    it("Test.0505 getXorshift128plusState1WithBigIntStates()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const xorshift128plusState1BigInt: bigint = Utility.getXorshift128plusState1WithBigIntStates();
        Utility.debuggingLog(
            `xorshift128plusState1BigInt=${xorshift128plusState1BigInt}`);
    });
    it("Test.0506 getXorshift128plusCycleWithBigIntStates()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const xorshift128plusCycleBigInt: bigint = Utility.getXorshift128plusCycleWithBigIntStates();
        Utility.debuggingLog(
            `xorshift128plusCycleBigInt=${xorshift128plusCycleBigInt}`);
    });
    it("Test.0507 getXorshift128plusCycleFloatWithBigIntStates()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const xorshift128plusCycleBigIntFloat: number = Utility.getXorshift128plusCycleFloatWithBigIntStates();
        Utility.debuggingLog(
            `xorshift128plusCycleBigIntFloat=${xorshift128plusCycleBigIntFloat}`);
    });
    it("Test.0508 rngSeedXorshift128plusWithBigIntStatesWithNumberArguments()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.rngSeedXorshift128plusWithBigIntStatesWithNumberArguments(3, 4);
        for (let i = 0; i < 16; i++) {
            const r: bigint = Utility.rngNextXorshift128plusWithBigIntStates();
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
        }
    });
    it("Test.0509 getXorshift128plusCycleWithBigIntStates()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const bigint3: bigint = BigInt(3);
        const bigint4: bigint = BigInt(4);
        const xorshift128plusCycleBigInt: bigint = Utility.getXorshift128plusCycleWithBigIntStates();
        Utility.rngSeedXorshift128plusWithBigIntStates(
            bigint3,
            bigint4,
            xorshift128plusCycleBigInt);
        for (let i = 0; i < 16; i++) {
            const r: bigint = Utility.rngNextXorshift128plusWithBigIntStates();
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
        }
    });
    it("Test.0510 rngNextXorshift128plusWithBigIntStates()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const bigint3: bigint = BigInt(3);
        const bigint4: bigint = BigInt(4);
        const xorshift128plusCycleBigInt: bigint = Utility.getXorshift128plusCycleWithBigIntStates();
        Utility.rngSeedXorshift128plusWithBigIntStates(
            bigint3,
            bigint4,
            xorshift128plusCycleBigInt);
        const randomArray: Array<bigint> = [];
        for (let i = 0; i < 16; i++) {
            const r: bigint = Utility.rngNextXorshift128plusWithBigIntStates();
            randomArray.push(r);
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
        }
        Utility.rngSeedXorshift128plusWithBigIntStates(
            bigint3,
            bigint4,
            xorshift128plusCycleBigInt);
        for (let i = 0; i < 16; i++) {
            const r: bigint = Utility.rngNextXorshift128plusWithBigIntStates();
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
            assert.ok(r === randomArray[i],
                `i=${i}, r=${r}, randomArray[i]=${randomArray[i]}`);
        }
    });
    it("Test.0511 rngNextXorshift128plusFloatWithBigIntStates()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const bigint3: bigint = BigInt(3);
        const bigint4: bigint = BigInt(4);
        const xorshift128plusCycleBigInt: bigint = Utility.getXorshift128plusCycleWithBigIntStates();
        Utility.rngSeedXorshift128plusWithBigIntStates(
            bigint3,
            bigint4,
            xorshift128plusCycleBigInt);
        const randomArray: number[] = [];
        for (let i = 0; i < 16; i++) {
            const r: number = Utility.rngNextXorshift128plusFloatWithBigIntStates();
            assert.ok(((r >= 0) && (r < 1)),
                `r=${r}`);
            randomArray.push(r);
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
        }
        Utility.rngSeedXorshift128plusWithBigIntStates(
            bigint3,
            bigint4,
            xorshift128plusCycleBigInt);
        for (let i = 0; i < 16; i++) {
            const r: number = Utility.rngNextXorshift128plusFloatWithBigIntStates();
            assert.ok(((r >= 0) && (r < 1)),
                `r=${r}`);
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
            assert.ok(r === randomArray[i],
                `i=${i}, r=${r}, randomArray[i]=${randomArray[i]}`);
        }
    });
    it("Test.0512 rngNextXorshift128plusFloatWithBigIntStatesUniformTest()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampleSize: number = 100000;
        const sampleArray: number[] = [];
        for (let i = 0; i < sampleSize; i++) {
            const r: number = Utility.rngNextXorshift128plusFloatWithBigIntStates();
            assert.ok(((r >= 0) && (r < 1)),
                `r=${r}`);
            sampleArray.push(r);
        }
        const sampleArraySum: number =
            sampleArray.reduce((accumulant: number, entry: number) => accumulant += entry, 0);
        const sampleArrayMean: number =
            sampleArraySum / sampleSize;
        const sampleArraySecondMomentSum: number =
            sampleArray.reduce((accumulant: number, entry: number) => accumulant += (entry * entry), 0);
        const sampleArraySecondMoment: number =
            sampleArraySecondMomentSum / sampleSize;
        const theoreticMean: number = 0.5;
        const theoreticSecondMoment: number = 1 / 3;
        const theoreticVariance: number = 1 / 12;
        Utility.debuggingLog(
            `sampleSize=${sampleSize}` +
            `, sampleArrayMean=${sampleArrayMean}` +
            `, sampleArraySecondMoment=${sampleArraySecondMoment}` +
            `, theoreticMean=${theoreticMean}` +
            `, theoreticSecondMoment=${theoreticSecondMoment}` +
            `, theoreticVariance=${theoreticVariance}`);
        assert.ok(Utility.almostEqualRough(sampleArrayMean, theoreticMean),
            `sampleSize=${sampleSize}` +
            `, sampleArrayMean=${sampleArrayMean}` +
            `, sampleArraySecondMoment=${sampleArraySecondMoment}` +
            `, theoreticMean=${theoreticMean}` +
            `, theoreticSecondMoment=${theoreticSecondMoment}` +
            `, theoreticVariance=${theoreticVariance}`);
        assert.ok(Utility.almostEqualRough(sampleArraySecondMoment, theoreticSecondMoment),
            `sampleSize=${sampleSize}` +
            `, sampleArrayMean=${sampleArrayMean}` +
            `, sampleArraySecondMoment=${sampleArraySecondMoment}` +
            `, theoreticMean=${theoreticMean}` +
            `, theoreticSecondMoment=${theoreticSecondMoment}` +
            `, theoreticVariance=${theoreticVariance}`);
    });

    it("Test.0513 getRandomInt()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const randomInt: number = Utility.getRandomInt(3);
        Utility.debuggingLog(
            `randomInt=${randomInt}`);
        assert.ok(((randomInt >= 0) && (randomInt < 3)),
            `randomInt=${randomInt}`);
    });
    it("Test.0514 getRandomIntFromFloatLimit()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const randomInt: number = Utility.getRandomIntFromFloatLimit(3.14);
        Utility.debuggingLog(
            `randomInt=${randomInt}`);
        assert.ok(((randomInt >= 0) && (randomInt < 3.14)),
            `randomInt=${randomInt}`);
    });
    it("Test.0515 getRandomIntFromIntLimit()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const randomInt: number = Utility.getRandomIntFromIntLimit(3.14);
        Utility.debuggingLog(
            `randomInt=${randomInt}`);
        assert.ok(((randomInt >= 0) && (randomInt < 3)),
            `randomInt=${randomInt}`);
    });

    it("Test.0600 shuffle()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const array: number[] = [1, 2, 3, 4, 5];
        const arrayInJsonString: string =
            Utility.jsonStringify(array);
        Utility.debuggingLog(
            `arrayInJsonString=${arrayInJsonString}`);
        const arrayShuffled: number[] =
            Utility.shuffle(array);
        const arrayShuffledInJsonString: string =
            Utility.jsonStringify(arrayShuffled);
        Utility.debuggingLog(
            `arrayShuffledInJsonString=${arrayShuffledInJsonString}`);
        assert.ok(array === arrayShuffled,
            "array!==arrayShuffled");
    });
    it("Test.0601 shuffle() Consistency", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const arrayOriginal: number[] = [1, 2, 3, 4, 5];
        const arrayOriginalInJsonString: string =
            Utility.jsonStringify(arrayOriginal);
        Utility.debuggingLog(
            `arrayOriginalInJsonString=${arrayOriginalInJsonString}`);
        Utility.rngSeedXorshift128plusWithBigIntStatesWithNumberArguments(3, 4);
        const arrayShuffled: number[] =
            Object.assign([], arrayOriginal);
        Utility.shuffle(arrayShuffled);
        const arrayShuffledInJsonString: string =
            Utility.jsonStringify(arrayShuffled);
        Utility.debuggingLog(
            `arrayShuffledInJsonString=${arrayShuffledInJsonString}`);
        Utility.rngSeedXorshift128plusWithBigIntStatesWithNumberArguments(3, 4);
        const arrayShuffledNew: number[] =
            Object.assign([], arrayOriginal);
        Utility.shuffle(arrayShuffledNew);
        const arrayShuffledNewInJsonString: string =
            Utility.jsonStringify(arrayShuffledNew);
        Utility.debuggingLog(
            `arrayShuffledNewInJsonString=${arrayShuffledNewInJsonString}`);
        assert.ok(arrayOriginal.length === arrayShuffled.length,
            `arrayOriginal.length=${arrayOriginal.length}, arrayShuffled.length=${arrayShuffled.length}`);
        assert.ok(arrayOriginal.length === arrayShuffledNew.length,
            `arrayOriginal.length=${arrayOriginal.length}, arrayShuffledNew.length=${arrayShuffledNew.length}`);
        for (let i: number = 0; i < arrayShuffled.length; i++) {
            assert.ok(arrayShuffled[i] === arrayShuffledNew[i],
                `i=${i}, arrayShuffled[i]=${arrayShuffled[i]}, arrayShuffledNew[i]=${arrayShuffledNew[i]}`);
        }
    });

    it("Test.0700 buildStringIdNumberValueDictionaryFromUniqueStringArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["b", "a", "c", "d"];
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        const stringMap: IDictionaryStringIdGenericValue<number> =
            DictionaryMapUtility.buildStringIdNumberValueDictionaryFromUniqueStringArray(stringArray);
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0701 buildStringIdNumberValueDictionaryFromStringArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["b", "a", "b", "c", "a", "a", "b", "d"];
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        const stringArrayMap: { "stringArray": string[], "stringMap": IDictionaryStringIdGenericValue<number> } =
            DictionaryMapUtility.buildStringIdNumberValueDictionaryFromStringArray(stringArray);
        const stringMappedArray: string[] =
            stringArrayMap.stringArray;
        const stringMappedMap: IDictionaryStringIdGenericValue<number> =
            stringArrayMap.stringMap;
        const stringMappedArrayInJsonString: string =
            Utility.jsonStringify(stringMappedArray);
        Utility.debuggingLog(
            `stringMappedArrayInJsonString=${stringMappedArrayInJsonString}`);
        const stringMappedMapInJsonString: string =
            Utility.jsonStringify(stringMappedMap);
        Utility.debuggingLog(
            `stringMappedMapInJsonString=${stringMappedMapInJsonString}`);
    });
    it("Test.0702 buildStringIdNumberValueDictionaryFromStringArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArrays: string[][] =
            [["b", "a", "b", "c", "a", "a", "b", "d"],
             ["b", "a", "b", "c", "a", "a", "b", "d"]];
        const stringArraysInJsonString: string =
            Utility.jsonStringify(stringArrays);
        Utility.debuggingLog(
            `stringArraysInJsonString=${stringArraysInJsonString}`);
        const stringArrayMap: { "stringArray": string[], "stringMap": IDictionaryStringIdGenericValue<number> } =
            DictionaryMapUtility.buildStringIdNumberValueDictionaryFromStringArrays(stringArrays);
        const stringMappedArray: string[] =
            stringArrayMap.stringArray;
        const stringMappedMap: IDictionaryStringIdGenericValue<number> =
            stringArrayMap.stringMap;
        const stringMappedArrayInJsonString: string =
            Utility.jsonStringify(stringMappedArray);
        Utility.debuggingLog(
            `stringMappedArrayInJsonString=${stringMappedArrayInJsonString}`);
        const stringMappedMapInJsonString: string =
            Utility.jsonStringify(stringMappedMap);
        Utility.debuggingLog(
            `stringMappedMapInJsonString=${stringMappedMapInJsonString}`);
    });

    it("Test.0800 validateStringArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = ["b", "a", "c", "d"];
        const stringArray1: string[] = ["b", "a", "c", "d"];
        const stringArray0InJsonString: string =
            Utility.jsonStringify(stringArray0);
        const stringArray1InJsonString: string =
            Utility.jsonStringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        const validation: boolean =
            Utility.validateStringArrayPairEquality(stringArray0, stringArray1);
        assert.ok(validation,
            `stringArray0InJsonString=${stringArray0InJsonString}` +
            `, stringArray1InJsonString=${stringArray1InJsonString}`);
    });
    it("Test.0801 validateStringArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = [];
        const stringArray1: string[] = [];
        const stringArray0InJsonString: string =
            Utility.jsonStringify(stringArray0);
        const stringArray1InJsonString: string =
            Utility.jsonStringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        const validation: boolean =
            Utility.validateStringArrayPairEquality(stringArray0, stringArray1);
        assert.ok(validation,
            `stringArray0InJsonString=${stringArray0InJsonString}` +
            `, stringArray1InJsonString=${stringArray1InJsonString}`);
    });
    it("Test.0802 validateStringArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = [];
        const stringArray1: string[] = ["b", "a", "c", "d"];
        const stringArray0InJsonString: string =
            Utility.jsonStringify(stringArray0);
        const stringArray1InJsonString: string =
            Utility.jsonStringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        const validation: boolean =
            Utility.validateStringArrayPairEquality(stringArray0, stringArray1, false);
        assert.ok(!validation,
            `stringArray0InJsonString=${stringArray0InJsonString}` +
            `, stringArray1InJsonString=${stringArray1InJsonString}`);
    });
    it("Test.0803 validateStringArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = ["b", "a", "c", "d"];
        const stringArray1: string[] = [];
        const stringArray0InJsonString: string =
            Utility.jsonStringify(stringArray0);
        const stringArray1InJsonString: string =
            Utility.jsonStringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        const validation: boolean =
            Utility.validateStringArrayPairEquality(stringArray0, stringArray1, false);
        assert.ok(!validation,
            `stringArray0InJsonString=${stringArray0InJsonString}` +
            `, stringArray1InJsonString=${stringArray1InJsonString}`);
    });
    it("Test.0804 validateStringArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = [];
        const stringArray1: string[] = ["b", "f", "c", "d"];
        const stringArray0InJsonString: string =
            Utility.jsonStringify(stringArray0);
        const stringArray1InJsonString: string =
            Utility.jsonStringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        assert.throws(
            () => { Utility.validateStringArrayPairEquality(stringArray0, stringArray1, true); });
    });
    it("Test.0805 validateStringArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = ["b", "a", "c", "d"];
        const stringArray1: string[] = [];
        const stringArray0InJsonString: string =
            Utility.jsonStringify(stringArray0);
        const stringArray1InJsonString: string =
            Utility.jsonStringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        assert.throws(
            () => { Utility.validateStringArrayPairEquality(stringArray0, stringArray1, true); });
    });
    it("Test.0806 validateStringArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = ["b", "a", "c", "d"];
        const stringArray1: string[] = ["b", "f", "c", "d"];
        const stringArray0InJsonString: string =
            Utility.jsonStringify(stringArray0);
        const stringArray1InJsonString: string =
            Utility.jsonStringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        assert.throws(
            () => { Utility.validateStringArrayPairEquality(stringArray0, stringArray1, true); });
    });
    it("Test.0807 validateStringSets()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringSet0: Set<string> = new Set<string>(["a", "b", "c"]);
        const stringSet1: Set<string> = new Set<string>(["a", "b", "c"]);
        const stringSet0InJsonString: string =
            Utility.setToJsonSerialization(stringSet0);
        const stringSet1InJsonString: string =
            Utility.setToJsonSerialization(stringSet1);
        Utility.debuggingLog(
            `stringSet0InJsonString=${stringSet0InJsonString}`);
        Utility.debuggingLog(
            `stringSet1InJsonString=${stringSet1InJsonString}`);
        const validation: boolean =
            Utility.validateStringSetPairEquality(stringSet0, stringSet1);
        assert.ok(validation,
            `stringSet0InJsonString=${stringSet0InJsonString}` +
            `, stringSet1InJsonString=${stringSet1InJsonString}`);
    });
    it("Test.0808 validateStringSets()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringSet0: Set<string> = new Set<string>();
        const stringSet1: Set<string> = new Set<string>();
        const stringSet0InJsonString: string =
            Utility.setToJsonSerialization(stringSet0);
        const stringSet1InJsonString: string =
            Utility.setToJsonSerialization(stringSet1);
        Utility.debuggingLog(
            `stringSet0InJsonString=${stringSet0InJsonString}`);
        Utility.debuggingLog(
            `stringSet1InJsonString=${stringSet1InJsonString}`);
        const validation: boolean =
            Utility.validateStringSetPairEquality(stringSet0, stringSet1);
        assert.ok(validation,
            `stringSet0InJsonString=${stringSet0InJsonString}` +
            `, stringSet1InJsonString=${stringSet1InJsonString}`);
    });
    it("Test.0809 validateStringSets()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringSet0: Set<string> = new Set<string>();
        const stringSet1: Set<string> = new Set<string>(["a", "b", "c"]);
        const stringSet0InJsonString: string =
            Utility.setToJsonSerialization(stringSet0);
        const stringSet1InJsonString: string =
            Utility.setToJsonSerialization(stringSet1);
        Utility.debuggingLog(
            `stringSet0InJsonString=${stringSet0InJsonString}`);
        Utility.debuggingLog(
            `stringSet1InJsonString=${stringSet1InJsonString}`);
        const validation: boolean =
            Utility.validateStringSetPairEquality(stringSet0, stringSet1, false);
        assert.ok(!validation,
            `stringSet0InJsonString=${stringSet0InJsonString}` +
            `, stringSet1InJsonString=${stringSet1InJsonString}`);
    });
    it("Test.0810 validateStringSets()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringSet0: Set<string> = new Set<string>(["a", "b", "c"]);
        const stringSet1: Set<string> = new Set<string>();
        const stringSet0InJsonString: string =
            Utility.setToJsonSerialization(stringSet0);
        const stringSet1InJsonString: string =
            Utility.setToJsonSerialization(stringSet1);
        Utility.debuggingLog(
            `stringSet0InJsonString=${stringSet0InJsonString}`);
        Utility.debuggingLog(
            `stringSet1InJsonString=${stringSet1InJsonString}`);
        const validation: boolean =
            Utility.validateStringSetPairEquality(stringSet0, stringSet1, false);
        assert.ok(!validation,
            `stringSet0InJsonString=${stringSet0InJsonString}` +
            `, stringSet1InJsonString=${stringSet1InJsonString}`);
    });
    it("Test.0811 validateStringSets()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringSet0: Set<string> = new Set<string>();
        const stringSet1: Set<string> = new Set<string>(["a", "b", "c"]);
        const stringSet0InJsonString: string =
            Utility.setToJsonSerialization(stringSet0);
        const stringSet1InJsonString: string =
            Utility.setToJsonSerialization(stringSet1);
        Utility.debuggingLog(
            `stringSet0InJsonString=${stringSet0InJsonString}`);
        Utility.debuggingLog(
            `stringSet1InJsonString=${stringSet1InJsonString}`);
        assert.throws(
            () => { Utility.validateStringSetPairEquality(stringSet0, stringSet1, true); });
    });
    it("Test.0812 validateStringSets()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringSet0: Set<string> = new Set<string>(["a", "b", "c"]);
        const stringSet1: Set<string> = new Set<string>();
        const stringSet0InJsonString: string =
            Utility.setToJsonSerialization(stringSet0);
        const stringSet1InJsonString: string =
            Utility.setToJsonSerialization(stringSet1);
        Utility.debuggingLog(
            `stringSet0InJsonString=${stringSet0InJsonString}`);
        Utility.debuggingLog(
            `stringSet1InJsonString=${stringSet1InJsonString}`);
        assert.throws(
            () => { Utility.validateStringSetPairEquality(stringSet0, stringSet1, true); });
    });
    it("Test.0813 validateStringSets()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringSet0: Set<string> = new Set<string>(["a", "b", "c"]);
        const stringSet1: Set<string> = new Set<string>(["a", "b", "d"]);
        const stringSet0InJsonString: string =
            Utility.setToJsonSerialization(stringSet0);
        const stringSet1InJsonString: string =
            Utility.setToJsonSerialization(stringSet1);
        Utility.debuggingLog(
            `stringSet0InJsonString=${stringSet0InJsonString}`);
        Utility.debuggingLog(
            `stringSet1InJsonString=${stringSet1InJsonString}`);
        assert.throws(
            () => { Utility.validateStringSetPairEquality(stringSet0, stringSet1, true); });
    });
    it("Test.0814 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: IDictionaryStringIdGenericValue<number> = { a: 1, b: 2, c: 3 };
        const stringMap1: IDictionaryStringIdGenericValue<number> = { a: 1, b: 2, c: 3 };
        const stringMap0InJsonString: string =
            Utility.jsonStringify(stringMap0);
        const stringMap1InJsonString: string =
            Utility.jsonStringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateStringIdNumberValueDictionaryPair(stringMap0, stringMap1);
        assert.ok(validation,
            `stringMap0InJsonString=${stringMap0InJsonString}` +
            `, stringMap1InJsonString=${stringMap1InJsonString}`);
    });
    it("Test.0815 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: IDictionaryStringIdGenericValue<number> = {};
        const stringMap1: IDictionaryStringIdGenericValue<number> = {};
        const stringMap0InJsonString: string =
            Utility.jsonStringify(stringMap0);
        const stringMap1InJsonString: string =
            Utility.jsonStringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateStringIdNumberValueDictionaryPair(stringMap0, stringMap1);
        assert.ok(validation,
            `stringMap0InJsonString=${stringMap0InJsonString}` +
            `, stringMap1InJsonString=${stringMap1InJsonString}`);
    });
    it("Test.0816 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: IDictionaryStringIdGenericValue<number> = {};
        const stringMap1: IDictionaryStringIdGenericValue<number> = { a: 1, b: 2, c: 3 };
        const stringMap0InJsonString: string =
            Utility.jsonStringify(stringMap0);
        const stringMap1InJsonString: string =
            Utility.jsonStringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateStringIdNumberValueDictionaryPair(stringMap0, stringMap1, false);
        assert.ok(!validation,
            `stringMap0InJsonString=${stringMap0InJsonString}` +
            `, stringMap1InJsonString=${stringMap1InJsonString}`);
    });
    it("Test.0817 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: IDictionaryStringIdGenericValue<number> = { a: 1, b: 2, c: 3 };
        const stringMap1: IDictionaryStringIdGenericValue<number> = {};
        const stringMap0InJsonString: string =
            Utility.jsonStringify(stringMap0);
        const stringMap1InJsonString: string =
            Utility.jsonStringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateStringIdNumberValueDictionaryPair(stringMap0, stringMap1, false);
        assert.ok(!validation,
            `stringMap0InJsonString=${stringMap0InJsonString}` +
            `, stringMap1InJsonString=${stringMap1InJsonString}`);
    });
    it("Test.0818 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: IDictionaryStringIdGenericValue<number> = {};
        const stringMap1: IDictionaryStringIdGenericValue<number> = { a: 1, b: 2, c: 3 };
        const stringMap0InJsonString: string =
            Utility.jsonStringify(stringMap0);
        const stringMap1InJsonString: string =
            Utility.jsonStringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        assert.throws(
            () => { DictionaryMapUtility.validateStringIdNumberValueDictionaryPair(stringMap0, stringMap1, true); });
    });
    it("Test.0819 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: IDictionaryStringIdGenericValue<number> = { a: 1, b: 2, c: 3 };
        const stringMap1: IDictionaryStringIdGenericValue<number> = {};
        const stringMap0InJsonString: string =
            Utility.jsonStringify(stringMap0);
        const stringMap1InJsonString: string =
            Utility.jsonStringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        assert.throws(
            () => { DictionaryMapUtility.validateStringIdNumberValueDictionaryPair(stringMap0, stringMap1, true); });
    });
    it("Test.0820 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: IDictionaryStringIdGenericValue<number> = { a: 1, b: 2, c: 3 };
        const stringMap1: IDictionaryStringIdGenericValue<number> = { a: 2, b: 2, c: 3 };
        const stringMap0InJsonString: string =
            Utility.jsonStringify(stringMap0);
        const stringMap1InJsonString: string =
            Utility.jsonStringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        assert.throws(
            () => { DictionaryMapUtility.validateStringIdNumberValueDictionaryPair(stringMap0, stringMap1, true); });
    });

    it("Test.0900 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "c"];
        const stringMap: IDictionaryStringIdGenericValue<number> = {a: 0, b: 1, c: 2};
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(stringArray, stringMap);
        assert.ok(validation,
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0901 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = [];
        const stringMap: IDictionaryStringIdGenericValue<number> = {a: 0, b: 1, c: 2};
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(stringArray, stringMap, false);
        assert.ok(!validation,
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0902 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "c"];
        const stringMap: IDictionaryStringIdGenericValue<number> = {};
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(stringArray, stringMap, false);
        assert.ok(!validation,
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0903 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b"];
        const stringMap: IDictionaryStringIdGenericValue<number> = {a: 0, b: 1, c: 2};
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(stringArray, stringMap, false);
        assert.ok(!validation,
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0904 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "d"];
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: 1, c: 2 };
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(stringArray, stringMap, false);
        assert.ok(!validation,
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0905 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "c"];
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: -1, c: 2 };
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(stringArray, stringMap, false);
        assert.ok(!validation,
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0906 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = [];
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: 1, c: 2 };
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(
                stringArray, stringMap, true); },
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0907 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "c"];
        const stringMap: IDictionaryStringIdGenericValue<number> = {};
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(
                stringArray, stringMap, true); },
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0908 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b"];
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: 1, c: 2 };
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(
                stringArray, stringMap, true); },
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0909 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "d"];
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: 1, c: 2 };
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(
                stringArray, stringMap, true); },
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0910 validateStringMaps()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "c"];
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: -1, c: 2 };
        const stringArrayInJsonString: string =
            Utility.jsonStringify(stringArray);
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(
                stringArray, stringMap, true); },
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0911 validateKeyId()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const keyId: number = 1;
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `keyId=${keyId}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateNumberKeyIdInStringIdNumberValueDictionary(keyId, stringMap);
        assert.ok(validation,
            `keyId=${keyId}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0912 validateKeyId()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const keyId: number = -1;
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `keyId=${keyId}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateNumberKeyIdInStringIdNumberValueDictionary(keyId, stringMap, false);
        assert.ok(!validation,
            `keyId=${keyId}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0913 validateKeyId()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const keyId: number = 3;
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `keyId=${keyId}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateNumberKeyIdInStringIdNumberValueDictionary(keyId, stringMap, false);
        assert.ok(!validation,
            `keyId=${keyId}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0914 validateKeyId()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const keyId: number = -1;
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `keyId=${keyId}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { DictionaryMapUtility.validateNumberKeyIdInStringIdNumberValueDictionary(keyId, stringMap, true); },
            `keyId=${keyId}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0915 validateKeyId()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const keyId: number = 3;
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `keyId=${keyId}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { DictionaryMapUtility.validateNumberKeyIdInStringIdNumberValueDictionary(keyId, stringMap, true); },
            `keyId=${keyId}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0916 validateKey()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const key: string = "b";
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `key=${key}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateStringKeyInStringIdNumberValueDictionary(key, stringMap);
        assert.ok(validation,
            `key=${key}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0917 validateKey()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const key: string = "d";
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `key=${key}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            DictionaryMapUtility.validateStringKeyInStringIdNumberValueDictionary(key, stringMap, false);
        assert.ok(!validation,
            `key=${key}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0918 validateKey()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const key: string = "d";
        const stringMap: IDictionaryStringIdGenericValue<number> = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            Utility.jsonStringify(stringMap);
        Utility.debuggingLog(
            `key=${key}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { DictionaryMapUtility.validateStringKeyInStringIdNumberValueDictionary(key, stringMap, true); },
            `key=${key}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });

    it("Test.1000 loadLabelTextColumnarFile()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "resources/data/Columnar/Email.tsv";
        const labelColumnIndex: number = 0;
        const textColumnIndex: number = 2;
        const weightColumnIndex: number = 1;
        const lineIndexToStart: number = 1;
        const columnDelimiter: string = "\t";
        const rowDelimiter: string = "\n";
        const encoding: string = "utf8";
        const lineIndexToEnd: number = -1;
        const result: { "intents": string[], "texts": string[], "weights": number[] } =
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
        const intents: string[] =
            result.intents;
        const texts: string[] =
            result.texts;
        assert.ok(intents.length === 601,
            `intents.length=${intents.length}`);
        assert.ok(texts.length === 601,
            `utterances.length=${texts.length}`);
    });
    it("Test.1001 loadLabelTextColumnarContent()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "resources/data/Columnar/Email.tsv";
        const fileContent: string =
            Utility.loadFile(filename);
        const labelColumnIndex: number = 0;
        const textColumnIndex: number = 2;
        const weightColumnIndex: number = 1;
        const lineIndexToStart: number = 1;
        const columnDelimiter: string = "\t";
        const rowDelimiter: string = "\n";
        const lineIndexToEnd: number = -1;
        const result: { "intents": string[], "texts": string[], "weights": number[] } =
            Utility.loadLabelTextColumnarContent(
                fileContent,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                lineIndexToStart,
                columnDelimiter,
                rowDelimiter,
                lineIndexToEnd);
        const intents: string[] =
            result.intents;
        const texts: string[] =
            result.texts;
        const weights: number[] =
            result.weights;
        assert.ok(intents.length === 601,
            `intents.length=${intents.length}`);
        assert.ok(texts.length === 601,
            `texts.length=${texts.length}`);
        assert.ok(weights.length === 601,
            `weights.length=${weights.length}`);
    });

    it("Test.1100 loadEntityAnnotatedCorpusFile()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "resources/data/EntityAnnotatedCorpus/ner_dataset.eac";
        const lineIndexToStart: number = 1;
        const columnDelimiter: string = ",";
        const rowDelimiter: string = "\n";
        const encoding: string = "utf8";
        const lineIndexToEnd: number = -1;
        const result: IEntityAnnotationObject = Utility.loadEntityAnnotatedCorpusFile(
            filename,
            lineIndexToStart,
            columnDelimiter,
            rowDelimiter,
            encoding,
            lineIndexToEnd);
        const ids: string[] =
            result.ids;
        const wordArrays: string[][] =
            result.wordArrays;
        const partOfSpeechTagArrays: string[][] =
            result.partOfSpeechTagArrays;
        const entityTagArrays: string[][] =
            result.entityTagArrays;
        Utility.debuggingLog(
            `ids.length=${ids.length}`);
        assert.ok(ids.length === 47959,
            `ids.length=${ids.length}`);
        assert.ok(wordArrays.length === 47959,
            `wordArrays.length=${wordArrays.length}`);
        assert.ok(partOfSpeechTagArrays.length === 47959,
            `partOfSpeechTagArrays.length=${partOfSpeechTagArrays.length}`);
        assert.ok(entityTagArrays.length === 47959,
            `entityTagArrays.length=${entityTagArrays.length}`);
    });
    it("Test.1101 loadEntityAnnotatedCorpusContent()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "resources/data/EntityAnnotatedCorpus/ner_dataset.eac";
        const fileContent: string =
            Utility.loadFile(filename);
        const lineIndexToStart: number = 1;
        const columnDelimiter: string = ",";
        const rowDelimiter: string = "\n";
        const lineIndexToEnd: number = -1;
        const result: IEntityAnnotationObject = Utility.loadEntityAnnotatedCorpusContent(
            fileContent,
            lineIndexToStart,
            columnDelimiter,
            rowDelimiter,
            lineIndexToEnd);
        const ids: string[] =
            result.ids;
        const wordArrays: string[][] =
            result.wordArrays;
        const partOfSpeechTagArrays: string[][] =
            result.partOfSpeechTagArrays;
        const entityTagArrays: string[][] =
            result.entityTagArrays;
        Utility.debuggingLog(
            `ids.length=${ids.length}`);
        assert.ok(ids.length === 47959,
            `ids.length=${ids.length}`);
        assert.ok(wordArrays.length === 47959,
            `wordArrays.length=${wordArrays.length}`);
        assert.ok(partOfSpeechTagArrays.length === 47959,
            `partOfSpeechTagArrays.length=${partOfSpeechTagArrays.length}`);
        assert.ok(entityTagArrays.length === 47959,
            `entityTagArrays.length=${entityTagArrays.length}`);
    });

    it("Test.1200 loadFile()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "resources/data/Columnar/Email.tsv";
        const fileContent: string =
            Utility.loadFile(filename);
        Utility.debuggingLog(
            `fileContent.length=${fileContent.length}`);
        const lineArray: string[] =
            Utility.stringToLineArray(fileContent);
        const fileContentReCombined: string =
            lineArray.reduce((accumulant: string, entry: string) => accumulant += (entry + "\n"), "");
        assert.ok(lineArray.length === 603,
            `lineArray.length=${lineArray.length}`);
        assert.ok(fileContentReCombined.length === 25291, // ---- NOTE ---- Windows file length: 25892,
            `fileContentReCombined.length=${fileContentReCombined.length}`);
    });
    it("Test.1201 dumpFile()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "resources/data/Columnar/Email.tsv";
        const fileContent: string =
            Utility.loadFile(filename);
        Utility.debuggingLog(
            `fileContent.length=${fileContent.length}`);
        const lineArray: string[] =
            Utility.stringToLineArray(fileContent);
        const fileContentReCombined: string =
            lineArray.reduce((accumulant: string, entry: string) => accumulant += (entry + "\n"), "");
        assert.ok(lineArray.length === 603,
            `lineArray.length=${lineArray.length}`);
        assert.ok(fileContentReCombined.length === 25291, // ---- NOTE ---- Windows file length: 25892,
            `fileContentReCombined.length=${fileContentReCombined.length}`);
        let filenameOuput: string = "resources/data/Columnar/Email_UtilityUnitTest_1201.tsv";
        filenameOuput = Utility.dumpFile(filenameOuput, fileContent);
        const toCleanUpAfterUnitTest: boolean = UnitTestHelper.getDefaultUnitTestCleanUpFlag();
        if (toCleanUpAfterUnitTest) {
            Utility.deleteFile(filenameOuput);
        }
    });
    it("Test.1202 exists()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "resources/data/Columnar/Email.tsv";
        const fileExists: boolean =
            Utility.exists(filename);
        assert.ok(fileExists,
            `filename=${filename}`);
    });
    it("Test.1203 exists()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "resources/data/Columnar/Email.sss";
        const fileExists: boolean =
            Utility.exists(filename);
        assert.ok(!fileExists,
            `filename=${filename}`);
    });

    it("Test.1300 getObjectMd5Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const message: string = "Hello, World!";
        const messageMd5Hash: string =
            Utility.getObjectMd5Hash(message as any) as string;
        Utility.debuggingLog(
            `messageMd5Hash=${messageMd5Hash}`);
        assert.ok(messageMd5Hash === "7959b2c4af2fd6d142ba32babd30ceb7",
            `messageMd5Hash=${messageMd5Hash}`);
    });
    it("Test.1301 getStringMd5Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const message: string = "Hello, World!";
        const messageMd5Hash: string =
            Utility.getStringMd5Hash(message) as string;
        Utility.debuggingLog(
            `messageMd5Hash=${messageMd5Hash}`);
        assert.ok(messageMd5Hash === "65a8e27d8879283831b664bd8b7f0ad4",
            `messageMd5Hash=${messageMd5Hash}`);
    });

    it("Test.1400 getPositiveObjectHashCode()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const message: string = "Hello, World!";
        const messageMd5Hash: number =
            Utility.getPositiveObjectHashCode(message as any);
        Utility.debuggingLog(
            `messageMd5Hash=${messageMd5Hash}`);
        assert.ok(messageMd5Hash === 1064999089,
            `messageMd5Hash=${messageMd5Hash}`);
    });
    it("Test.1401 getObjectHashCode()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const message: string = "Hello, World!";
        const messageMd5Hash: number =
            Utility.getObjectHashCode(message as any);
        Utility.debuggingLog(
            `messageMd5Hash=${messageMd5Hash}`);
        assert.ok(messageMd5Hash === -1064999089,
            `messageMd5Hash=${messageMd5Hash}`);
    });
    it("Test.1402 getPositiveStringHashCode()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const message: string = "Hello, World!";
        const messageMd5Hash: number =
            Utility.getPositiveStringHashCode(message);
        Utility.debuggingLog(
            `messageMd5Hash=${messageMd5Hash}`);
        assert.ok(messageMd5Hash === 1498789909,
            `messageMd5Hash=${messageMd5Hash}`);
    });
    it("Test.1403 getStringHashCode()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const message: string = "Hello, World!";
        const messageMd5Hash: number =
            Utility.getStringHashCode(message);
        Utility.debuggingLog(
            `messageMd5Hash=${messageMd5Hash}`);
        assert.ok(messageMd5Hash === 1498789909,
            `messageMd5Hash=${messageMd5Hash}`);
    });

    it("Test.1500 isEmptyNumberF32I32U8Array()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: Float32Array = new Float32Array();
        const isEmpty: boolean =
            Utility.isEmptyNumberF32I32U8Array(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1501 isEmptyNumberF32I32U8Array()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: Float32Array = new Float32Array(1);
        const isEmpty: boolean =
            Utility.isEmptyNumberF32I32U8Array(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1502 isEmptyBooleanArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: boolean[][] = [];
        const isEmpty: boolean =
            Utility.isEmptyBooleanArrays(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1503 isEmptyBooleanArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: boolean[][] = [[false]];
        const isEmpty: boolean =
            Utility.isEmptyBooleanArrays(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1504 isEmptyNumberArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: number[][] = [];
        const isEmpty: boolean =
            Utility.isEmptyNumberArrays(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1505 isEmptyNumberArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: number[][] = [[0]];
        const isEmpty: boolean =
            Utility.isEmptyNumberArrays(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1506 isEmptyArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: object[][] = [];
        const isEmpty: boolean =
            Utility.isEmptyArrays(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1507 isEmptyArrays()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: object[][] = [["0" as any]];
        const isEmpty: boolean =
            Utility.isEmptyArrays(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1508 isEmptyBooleanArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: boolean[] = [];
        const isEmpty: boolean =
            Utility.isEmptyBooleanArray(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1509 isEmptyBooleanArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: boolean[] = [false];
        const isEmpty: boolean =
            Utility.isEmptyBooleanArray(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1510 isEmptyNumberArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: number[] = [];
        const isEmpty: boolean =
            Utility.isEmptyNumberArray(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1511 isEmptyNumberArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: number[] = [0];
        const isEmpty: boolean =
            Utility.isEmptyNumberArray(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1512 isEmptyArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: object[] = [];
        const isEmpty: boolean =
            Utility.isEmptyArray(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1513 isEmptyArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: object[] = ["0" as any];
        const isEmpty: boolean =
            Utility.isEmptyArray(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1514 isEmptyStringArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string[] = [];
        const isEmpty: boolean =
            Utility.isEmptyStringArray(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1515 isEmptyStringArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string[] = ["0"];
        const isEmpty: boolean =
            Utility.isEmptyStringArray(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1516 isEmptyString()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string = "";
        const isEmpty: boolean =
            Utility.isEmptyString(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1517 isEmptyString()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string = "0";
        const isEmpty: boolean =
            Utility.isEmptyString(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });

    it("Test.1600 getSetLength()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: Set<string> =
            new Set<string>(["0"]);
        const length: number =
            Utility.getSetLength(input);
        assert.ok(length === 1,
            `input=${input}, length=${length}`);
        input.add("1");
        const length2: number =
            Utility.getSetLength(input);
        assert.ok(length2 === 2,
            `input=${input}, length2=${length2}`);
        input.add("0");
        const length20: number =
            Utility.getSetLength(input);
        assert.ok(length20 === 2,
            `input=${input}, length20=${length20}`);
        });
    it("Test.1601 getMapLength()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: IDictionaryStringIdGenericValue<number> = {
            a: 0 };
        const length: number =
            DictionaryMapUtility.getStringIdGenericValueDictionaryLength(input);
        input.b = 1;
        assert.ok(length === 1,
            `input=${input}, length=${length}`);
        const length2: number =
            DictionaryMapUtility.getStringIdGenericValueDictionaryLength(input);
        assert.ok(length2 === 2,
            `input=${input}, length2=${length2}`);
        input.a = 0;
        const length20: number =
            DictionaryMapUtility.getStringIdGenericValueDictionaryLength(input);
        assert.ok(length20 === 2,
           `input=${input}, length20=${length20}`);
        });
    it("Test.1602 getKeyMapLength()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: TMapStringKeyGenericValue<number> =
            DictionaryMapUtility.newTMapStringKeyGenericValue<number>();
        input.set("a", 0);
        const length: number =
            DictionaryMapUtility.getStringKeyGenericValueMapLength(input);
        assert.ok(length === 1,
            `input=${Utility.mapToJsonSerialization(input)}, length=${length}`);
        input.set("b", 1);
        const length2: number =
            DictionaryMapUtility.getStringKeyGenericValueMapLength(input);
        assert.ok(length2 === 2,
            `input=${Utility.mapToJsonSerialization(input)}, length2=${length2}`);
        input.set("a", 0);
        const length20: number =
            DictionaryMapUtility.getStringKeyGenericValueMapLength(input);
        assert.ok(length20 === 2,
            `input=${Utility.mapToJsonSerialization(input)}, length20=${length20}`);
        });

    it("Test.1700 getJsonStringified()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string[] = ["a"];
        const jsonStringified: string =
            Utility.getJsonStringified(input);
        Utility.debuggingLog(
            `jsonStringified=${jsonStringified}`);
        assert.ok(true,
            `jsonStringified=${jsonStringified}`);
    });

    it("Test.1800 debuggingLog()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string[] = ["a"];
        const jsonStringified: string =
            Utility.getJsonStringified(input);
        Utility.debuggingLog(
            `jsonStringified=${jsonStringified}`);
        assert.ok(true,
            `jsonStringified=${jsonStringified}`);
    });

    it("Test.1900 debuggingThrow()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.throws(
            () => {
                Utility.debuggingThrow(
                    `exception`);
            });
    });

    it("Test.2000 almostEqual()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const number0: number = 1.0001;
        const number1: number = 1.0002;
        Utility.debuggingLog(
            `Utility.epsilon=${Utility.epsilon}, Utility.epsilonRough=${Utility.epsilonRough}`);
        Utility.debuggingLog(
            `Utility.getAlmostEqualPercentage(number0, number1)=${Utility.getAlmostEqualPercentage(number0, number1)}`);
        assert.ok(Utility.almostEqual(number0, number1),
            `number0=${number0}, number1=${number1}`);
    });
    it("Test.2001 almostEqual()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const number0: number = 1.001;
        const number1: number = 1.002;
        Utility.debuggingLog(
            `Utility.epsilon=${Utility.epsilon}, Utility.epsilonRough=${Utility.epsilonRough}`);
        Utility.debuggingLog(
            `Utility.getAlmostEqualPercentage(number0, number1)=${Utility.getAlmostEqualPercentage(number0, number1)}`);
        assert.ok(!Utility.almostEqual(number0, number1),
            `number0=${number0}, number1=${number1}`);
    });
    it("Test.2002 almostEqualRough()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const number0: number = 1.01;
        const number1: number = 1.02;
        Utility.debuggingLog(
            `Utility.epsilon=${Utility.epsilon}, Utility.epsilonRough=${Utility.epsilonRough}`);
        Utility.debuggingLog(
            `Utility.getAlmostEqualPercentage(number0, number1)=${Utility.getAlmostEqualPercentage(number0, number1)}`);
        assert.ok(Utility.almostEqualRough(number0, number1),
            `number0=${number0}, number1=${number1}`);
    });
    it("Test.2003 almostEqualRough()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const number0: number = 1.1;
        const number1: number = 1.2;
        Utility.debuggingLog(
            `Utility.epsilon=${Utility.epsilon}, Utility.epsilonRough=${Utility.epsilonRough}`);
        Utility.debuggingLog(
            `Utility.getAlmostEqualPercentage(number0, number1)=${Utility.getAlmostEqualPercentage(number0, number1)}`);
        assert.ok(!Utility.almostEqualRough(number0, number1),
            `number0=${number0}, number1=${number1}`);
    });
    it("Test.2004 getAlmostEqualPercentage()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const number0: number = 1.0001;
        const number1: number = 1.0002;
        Utility.debuggingLog(
            `Utility.epsilon=${Utility.epsilon}, Utility.epsilonRough=${Utility.epsilonRough}`);
        const almostEuqalPercentage: number =
            Utility.getAlmostEqualPercentage(number0, number1);
        Utility.debuggingLog(
            `almostEuqalPercentage=${almostEuqalPercentage}`);
        assert.ok(Utility.almostEqual(almostEuqalPercentage, 0.00009998000399918915),
            `number0=${number0}, number1=${number1}`);
    });
    it("Test.2005 almostEqualAbsolute()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const number0: number = 1.0001;
        const number1: number = 1.0002;
        Utility.debuggingLog(
            `Utility.epsilon=${Utility.epsilon}, Utility.epsilonRough=${Utility.epsilonRough}`);
        Utility.debuggingLog(
            `Utility.getAlmostEqualAbsolute(number0, number1)=${Utility.getAlmostEqualAbsolute(number0, number1)}`);
        assert.ok(Utility.almostEqualAbsolute(number0, number1),
            `number0=${number0}, number1=${number1}`);
    });
    it("Test.2006 almostEqualAbsolute()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const number0: number = 1.001;
        const number1: number = 1.002;
        Utility.debuggingLog(
            `Utility.epsilon=${Utility.epsilon}, Utility.epsilonRough=${Utility.epsilonRough}`);
        Utility.debuggingLog(
            `Utility.getAlmostEqualAbsolute(number0, number1)=${Utility.getAlmostEqualAbsolute(number0, number1)}`);
        assert.ok(!Utility.almostEqualAbsolute(number0, number1),
            `number0=${number0}, number1=${number1}`);
    });
    it("Test.2007 almostEqualAbsoluteRough()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const number0: number = 1.001;
        const number1: number = 1.002;
        Utility.debuggingLog(
            `Utility.epsilon=${Utility.epsilon}, Utility.epsilonRough=${Utility.epsilonRough}`);
        Utility.debuggingLog(
            `Utility.getAlmostEqualAbsolute(number0, number1)=${Utility.getAlmostEqualAbsolute(number0, number1)}`);
        assert.ok(Utility.almostEqualAbsoluteRough(number0, number1),
            `number0=${number0}, number1=${number1}`);
    });
    it("Test.2008 almostEqualAbsoluteRough()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const number0: number = 1.01;
        const number1: number = 1.02;
        Utility.debuggingLog(
            `Utility.epsilon=${Utility.epsilon}, Utility.epsilonRough=${Utility.epsilonRough}`);
        Utility.debuggingLog(
            `Utility.getAlmostEqualAbsolute(number0, number1)=${Utility.getAlmostEqualAbsolute(number0, number1)}`);
        assert.ok(!Utility.almostEqualAbsoluteRough(number0, number1),
            `number0=${number0}, number1=${number1}`);
    });
    it("Test.2009 getAlmostEqualAbsolute()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const number0: number = 1.0001;
        const number1: number = 1.0002;
        Utility.debuggingLog(
            `Utility.epsilon=${Utility.epsilon}, Utility.epsilonRough=${Utility.epsilonRough}`);
        const almostEuqalAbsolute: number =
            Utility.getAlmostEqualAbsolute(number0, number1);
        Utility.debuggingLog(
            `almostEuqalAbsolute=${almostEuqalAbsolute}`);
        assert.ok(Utility.almostEqualAbsolute(almostEuqalAbsolute, 0.00009999999999998899),
            `number0=${number0}, number1=${number1}`);
    });

    it("Test.2100 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean(true));
    });
    it("Test.2101 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean("true"));
    });
    it("Test.2102 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean(1));
    });
    it("Test.2103 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean("1"));
    });
    it("Test.2104 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean("on"));
    });
    it("Test.2105 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean("yes"));
    });
    it("Test.2106 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean("positive"));
    });
    it("Test.2107 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean(false));
    });
    it("Test.2108 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean("false"));
    });
    it("Test.2109 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean(0));
    });
    it("Test.2110 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean("0"));
    });
    it("Test.2111 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean("off"));
    });
    it("Test.2112 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean("no"));
    });
    it("Test.2113 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean("negative"));
    });
    it("Test.2114 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean("TRUE"));
    });
    it("Test.2115 toBoolean()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean("FALSE"));
    });

    it("Test.2200 iterableIteratorToArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const aMap: Map<string, string> = new Map<string, string>();
        aMap.set("a", "0");
        aMap.set("b", "0");
        aMap.set("a", "0");
        aMap.set("c", "0");
        const anIterableIterator: IterableIterator<string> = aMap.keys();
        const anArray: string[] = Utility.iterableIteratorToArray(anIterableIterator);
        assert.ok(anArray.length === 3, `anArray.length=${anArray.length}`);
    });

    it("Test.2300 splitByPunctuation()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string = "Hello, World";
        const output: string[] = Utility.splitByPunctuation(input);
        Utility.debuggingLog(
            `output=${output}`);
        assert.ok(output.length === 3);
        assert.ok(output[0] === "Hello");
        assert.ok(output[1] === ",");
        assert.ok(output[2] === "World");
    });

    it("Test.2400 splitStringWithCommaDelimitersFilteredByDoubleQuotes()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string = "1,\"Hello, World\",Adam";
        const output: string[] = Utility.splitStringWithCommaDelimitersFilteredByDoubleQuotes(input);
        Utility.debuggingLog(
            `output=${output}`);
        Utility.debuggingLog(
            `output[0]=${output[0]}`);
        Utility.debuggingLog(
            `output[1]=${output[1]}`);
        Utility.debuggingLog(
            `output[2]=${output[2]}`);
        assert.ok(output.length === 3);
        assert.ok(output[0] === "1");
        assert.ok(output[1] === "\"Hello, World\"");
        assert.ok(output[2] === "Adam");
    });

    it("Test.2500 sortAnyArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const inputArray: string[] = ["4", "1", "3", "9", "2"];
        const sortedArray: string[] = Utility.sortAnyArray(inputArray);
        Utility.debuggingLog(
            `sortedArray[0]=${sortedArray[0]}`);
        assert.ok(sortedArray.length === 5);
        assert.ok(sortedArray[0] === "1");
        assert.ok(sortedArray[sortedArray.length - 1] === "9");
    });
    it("Test.2501 sortNumberArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const inputArray: number[] = [4, 1, 3, 9, 2];
        const sortedArray: number[] = Utility.sortNumberArray(inputArray);
        Utility.debuggingLog(
            `sortedArray[0]=${sortedArray[0]}`);
        assert.ok(sortedArray.length === 5);
        assert.ok(sortedArray[0] === 1);
        assert.ok(sortedArray[sortedArray.length - 1] === 9);
    });
    it("Test.2502 sortStringArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const inputArray: string[] = ["4", "1", "3", "9", "2"];
        const sortedArray: string[] = Utility.sortStringArray(inputArray);
        Utility.debuggingLog(
            `sortedArray[0]=${sortedArray[0]}`);
        assert.ok(sortedArray.length === 5);
        assert.ok(sortedArray[0] === "1");
        assert.ok(sortedArray[sortedArray.length - 1] === "9");
    });
    it("Test.2503 sortValueCountPairArray()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const inputArray: StructValueCount[] = [
            new StructValueCount(4, 5),
            new StructValueCount(1, 3),
            new StructValueCount(3, 2),
            new StructValueCount(9, 1),
            new StructValueCount(2, 5)
        ];
        const sortedArray: StructValueCount[] = Utility.sortValueCountPairArray(inputArray);
        Utility.debuggingLog(
            `sortedArray[0]=${sortedArray[0]}`);
        assert.ok(sortedArray.length === 5);
        assert.ok(sortedArray[0].value === 1);
        assert.ok(sortedArray[sortedArray.length - 1].value === 9);
    });

    it("Test.2600 findMedian()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const inputArray: number[] = [4, 1, 3, 9, 2];
        const median = Utility.findMedian(inputArray);
        Utility.debuggingLog(
            `median=${median}`);
        assert.ok(median === 3, `median=${median}`);
    });
    it("Test.2601 findValueCountPairMedian()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const inputArray: StructValueCount[] = [
            new StructValueCount(4, 5),
            new StructValueCount(1, 3),
            new StructValueCount(3, 2),
            new StructValueCount(9, 1),
            new StructValueCount(2, 5)
        ];
        const median: number = Utility.findValueCountPairMedian(inputArray) as number;
        Utility.debuggingLog(
            `median=${median}`);
        assert.ok(median === 2.5, `median=${median}`);
    });

    it("Test.2700 findQuantiles()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const inputArray: number[] = [4, 1, 3, 9, 2];
        const quantiles: number[] = Utility.findQuantiles(inputArray, 4) as number[];
        Utility.debuggingLog(
            `quantiles=${quantiles}`);
        assert.ok(quantiles[1] === 2, `quantiles[1]=${quantiles[1]}`);
    });
    it("Test.2701 findValueCountPairQuantiles()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const inputArray: StructValueCount[] = [
            new StructValueCount(4, 5),
            new StructValueCount(1, 3),
            new StructValueCount(3, 2),
            new StructValueCount(9, 1),
            new StructValueCount(2, 5)
        ];
        const quantiles: number[] = Utility.findValueCountPairQuantiles(inputArray, 4) as number[];
        Utility.debuggingLog(
            `quantiles=${quantiles}`);
        assert.ok(quantiles[1] === 2, `quantiles[1]=${quantiles[1]}`);
    });
});
