/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

// import { exampleFunctionUtilityWithFilename } from "../../src/utility/AppUtility";

import { Utility } from "../../src/utility/Utility";

export class UnitTestHelper {
    public static getDefaultUnitTestTimeout(): number {
        return 60000;
    }
    public static getDefaultUnitTestDebuggingLogFlag(): boolean {
        return false;
    }
}

describe("Test Suite - utility/Utility", () => {
    it("Test.0000 incrementKeyValueNumberMap()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMap: Map<string, number> = new Map<string, number>();
        stringNumberMap.set("a", 1);
        const mapInString: string = Utility.mapToJsonSerialization(stringNumberMap);
        Utility.debuggingLog(
            `mapInString=${mapInString}`);
    });
    it("Test.0101 jsonSerializationToMap()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberSet: Set<string> = new Set<string>();
        stringNumberSet.add("a");
        const setInString: string = Utility.setToJsonSerialization(stringNumberSet);
        Utility.debuggingLog(
            `setInString=${setInString}`);
    });
    it("Test.0103 jsonSerializationToSet()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberArray: string[] = [];
        stringNumberArray.push("a");
        const arrayInString: string = Utility.arrayToJsonSerialization(stringNumberArray);
        Utility.debuggingLog(
            `arrayInString=${arrayInString}`);
    });
    it("Test.0105 jsonSerializationToArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMap: Map<string, number> = new Map<string, number>();
        stringNumberMap.set("a", 1);
        const mapInObject: any = Utility.stringMapToObject(stringNumberMap);
        const mapInJsonString: string =
            JSON.stringify(mapInObject);
        Utility.debuggingLog(
            `mapInJsonString=${mapInJsonString}`);
    });
    it("Test.0201 jsonToStringMap()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMap: Map<string, number> = new Map<string, number>();
        stringNumberMap.set("a", 1);
        const mapInObject: any = Utility.stringMapToObject(stringNumberMap);
        const mapInJsonString: string =
            JSON.stringify(mapInObject);
        Utility.debuggingLog(
            `mapInJsonString=${mapInJsonString}`);
        const mapInObjectFromJsonString: Map<string, number> =
            Utility.jsonToStringMap(mapInJsonString);
        assert.ok(mapInObjectFromJsonString.get("a") === 1,
            `mapInObjectFromJsonString.get("a")=${mapInObjectFromJsonString.get("a")}`);
    });

    it("Test.0300 stringMapSetToObject()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapSet: Map<string, Set<number>> = new Map<string, Set<number>>();
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 1);
        const stringMapSetInObject: any =
            Utility.stringMapSetToObject(stringNumberMapSet);
        const mapSetInJsonString: string =
            JSON.stringify(stringMapSetInObject);
        Utility.debuggingLog(
            `mapSetInJsonString=${mapSetInJsonString}`);
    });
    it("Test.0301 objectToStringMapSet()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapSet: Map<string, Set<number>> = new Map<string, Set<number>>();
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 1);
        const stringMapSetInObject: any =
            Utility.stringMapSetToObject(stringNumberMapSet);
        const mapSetInJsonString: string =
            JSON.stringify(stringMapSetInObject);
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
            JSON.stringify(stringMapSetNewInObject);
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
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapArray: Map<string, number[]> = new Map<string, number[]>();
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 1);
        const stringMapArrayInObject: any =
            Utility.stringMapArrayToObject(stringNumberMapArray);
        const mapArrayInJsonString: string =
            JSON.stringify(stringMapArrayInObject);
        Utility.debuggingLog(
            `mapArrayInJsonString=${mapArrayInJsonString}`);
    });
    it("Test.0303 objectToStringMapArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapArray: Map<string, number[]> = new Map<string, number[]>();
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 1);
        const stringMapArrayInObject: any =
            Utility.stringMapArrayToObject(stringNumberMapArray);
        const mapArrayInJsonString: string =
            JSON.stringify(stringMapArrayInObject);
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
            JSON.stringify(stringMapArrayNewInObject);
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
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapSet: Map<string, Set<number>> = new Map<string, Set<number>>();
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 1);
        const stringMapSetInJson: string =
            Utility.stringMapSetToJson(stringNumberMapSet);
        const mapSetInJsonString: string =
            JSON.stringify(stringMapSetInJson);
        Utility.debuggingLog(
            `mapSetInJsonString=${mapSetInJsonString}`);
    });
    it("Test.0401 jsonToStringMapSet()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapSet: Map<string, Set<number>> = new Map<string, Set<number>>();
        Utility.addKeyValueToNumberMapSet(stringNumberMapSet, "a", 1);
        const stringMapSetInJson: string =
            Utility.stringMapSetToJson(stringNumberMapSet);
        const mapSetInJsonString: string =
            JSON.stringify(stringMapSetInJson);
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
            JSON.stringify(stringMapSetNewInJson);
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
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapArray: Map<string, number[]> = new Map<string, number[]>();
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 1);
        const stringMapArrayInJson: string =
            Utility.stringMapArrayToJson(stringNumberMapArray);
        const mapArrayInJsonString: string =
            JSON.stringify(stringMapArrayInJson);
        Utility.debuggingLog(
            `mapArrayInJsonString=${mapArrayInJsonString}`);
    });
    it("Test.0403 jsonToStringMapArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringNumberMapArray: Map<string, number[]> = new Map<string, number[]>();
        Utility.addKeyValueToNumberMapArray(stringNumberMapArray, "a", 1);
        const stringMapArrayInJson: string =
            Utility.stringMapArrayToJson(stringNumberMapArray);
        const mapArrayInJsonString: string =
            JSON.stringify(stringMapArrayInJson);
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
            JSON.stringify(stringMapArrayNewInJson);
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
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const xorshift128plusState0: number = Utility.getXorshift128plusState0();
        Utility.debuggingLog(
            `xorshift128plusState0=${xorshift128plusState0}`);
    });
    it("Test.0501 getXorshift128plusState1()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const xorshift128plusState1: number = Utility.getXorshift128plusState1();
        Utility.debuggingLog(
            `xorshift128plusState1=${xorshift128plusState1}`);
    });
    it("Test.0502 rngSeedXorshift128plus()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.rngSeedXorshift128plus(3, 4);
        for (let i = 0; i < 16; i++) {
            const r: number = Utility.rngNextXorshift128plus();
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
        }
    });
    it("Test.0503 rngNextXorshift128plus()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
    // ==== TODO ==== it("Test.0504 rngNextFloatXorshift128plus()", function() {
    // ==== TODO ====     Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    // ==== TODO ====     this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    // ==== TODO ====     Utility.rngSeedXorshift128plus(3, 4);
    // ==== TODO ====     const randomArray: number[] = [];
    // ==== TODO ====     for (let i = 0; i < 16; i++) {
    // ==== TODO ====         const r: number = Utility.rngNextFloatXorshift128plus();
    // ==== TODO ====         randomArray.push(r);
    // ==== TODO ====         Utility.debuggingLog(
    // ==== TODO ====             `i=${i}, r=${r}`);
    // ==== TODO ====     }
    // ==== TODO ====     Utility.rngSeedXorshift128plus(3, 4);
    // ==== TODO ====     for (let i = 0; i < 16; i++) {
    // ==== TODO ====         const r: number = Utility.rngNextXorshift128plus();
    // ==== TODO ====         Utility.debuggingLog(
    // ==== TODO ====             `i=${i}, r=${r}`);
    // ==== TODO ====         assert.ok(r === randomArray[i],
    // ==== TODO ====             `i=${i}, r=${r}, randomArray[i]=${randomArray[i]}`);
    // ==== TODO ====     }
    // ==== TODO ==== });
    it("Test.0505 getXorshift128plusState0BigInt()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const xorshift128plusState0BigInt: bigint = Utility.getXorshift128plusState0BigInt();
        Utility.debuggingLog(
            `xorshift128plusState0BigInt=${xorshift128plusState0BigInt}`);
    });
    it("Test.0506 getXorshift128plusState1BigInt()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const xorshift128plusState1BigInt: bigint = Utility.getXorshift128plusState1BigInt();
        Utility.debuggingLog(
            `xorshift128plusState1BigInt=${xorshift128plusState1BigInt}`);
    });
    it("Test.0507 getXorshift128plusCycleBigInt()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const xorshift128plusCycleBigInt: bigint = Utility.getXorshift128plusCycleBigInt();
        Utility.debuggingLog(
            `xorshift128plusCycleBigInt=${xorshift128plusCycleBigInt}`);
    });
    it("Test.0508 getXorshift128plusCycleBigIntFloat()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const xorshift128plusCycleBigIntFloat: number = Utility.getXorshift128plusCycleBigIntFloat();
        Utility.debuggingLog(
            `xorshift128plusCycleBigIntFloat=${xorshift128plusCycleBigIntFloat}`);
    });
    it("Test.0509 rngSeedXorshift128plusBigIntWithNumber()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.rngSeedXorshift128plusBigIntWithNumber(3, 4);
        for (let i = 0; i < 16; i++) {
            const r: bigint = Utility.rngNextXorshift128plusBigInt();
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
        }
    });
    it("Test.0510 rngSeedXorshift128plusBigInt()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const bigint3: bigint = BigInt(3);
        const bigint4: bigint = BigInt(4);
        const xorshift128plusCycleBigInt: bigint = Utility.getXorshift128plusCycleBigInt();
        Utility.rngSeedXorshift128plusBigInt(
            bigint3,
            bigint4,
            xorshift128plusCycleBigInt);
        for (let i = 0; i < 16; i++) {
            const r: bigint = Utility.rngNextXorshift128plusBigInt();
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
        }
    });
    it("Test.0511 rngNextXorshift128plusBigInt()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const bigint3: bigint = BigInt(3);
        const bigint4: bigint = BigInt(4);
        const xorshift128plusCycleBigInt: bigint = Utility.getXorshift128plusCycleBigInt();
        Utility.rngSeedXorshift128plusBigInt(
            bigint3,
            bigint4,
            xorshift128plusCycleBigInt);
        const randomArray: Array<bigint> = [];
        for (let i = 0; i < 16; i++) {
            const r: bigint = Utility.rngNextXorshift128plusBigInt();
            randomArray.push(r);
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
        }
        Utility.rngSeedXorshift128plusBigInt(
            bigint3,
            bigint4,
            xorshift128plusCycleBigInt);
        for (let i = 0; i < 16; i++) {
            const r: bigint = Utility.rngNextXorshift128plusBigInt();
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
            assert.ok(r === randomArray[i],
                `i=${i}, r=${r}, randomArray[i]=${randomArray[i]}`);
        }
    });
    it("Test.0512 rngNextXorshift128plusBigIntFloat()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const bigint3: bigint = BigInt(3);
        const bigint4: bigint = BigInt(4);
        const xorshift128plusCycleBigInt: bigint = Utility.getXorshift128plusCycleBigInt();
        Utility.rngSeedXorshift128plusBigInt(
            bigint3,
            bigint4,
            xorshift128plusCycleBigInt);
        const randomArray: number[] = [];
        for (let i = 0; i < 16; i++) {
            const r: number = Utility.rngNextXorshift128plusBigIntFloat();
            assert.ok(((r >= 0) && (r < 1)),
                `r=${r}`);
            randomArray.push(r);
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
        }
        Utility.rngSeedXorshift128plusBigInt(
            bigint3,
            bigint4,
            xorshift128plusCycleBigInt);
        for (let i = 0; i < 16; i++) {
            const r: number = Utility.rngNextXorshift128plusBigIntFloat();
            assert.ok(((r >= 0) && (r < 1)),
                `r=${r}`);
            Utility.debuggingLog(
                `i=${i}, r=${r}`);
            assert.ok(r === randomArray[i],
                `i=${i}, r=${r}, randomArray[i]=${randomArray[i]}`);
        }
    });
    it("Test.0513 rngNextXorshift128plusBigIntFloatUniformTest()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const sampleSize: number = 100000;
        const sampleArray: number[] = [];
        for (let i = 0; i < sampleSize; i++) {
            const r: number = Utility.rngNextXorshift128plusBigIntFloat();
            assert.ok(((r >= 0) && (r < 1)),
                `r=${r}`);
            sampleArray.push(r);
        }
        const sampleArraySum: number =
            sampleArray.reduce((accumulant, entry) => accumulant += entry, 0);
        const sampleArrayMean: number =
            sampleArraySum / sampleSize;
        const sampleArraySecondMomentSum: number =
            sampleArray.reduce((accumulant, entry) => accumulant += (entry * entry), 0);
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

    it("Test.0600 shuffle()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const array: number[] = [1, 2, 3, 4, 5];
        const arrayInJsonString: string =
            JSON.stringify(array);
        Utility.debuggingLog(
            `arrayInJsonString=${arrayInJsonString}`);
        const arrayShuffled: number[] =
            Utility.shuffle(array);
        const arrayShuffledInJsonString: string =
            JSON.stringify(arrayShuffled);
        Utility.debuggingLog(
            `arrayShuffledInJsonString=${arrayShuffledInJsonString}`);
        assert.ok(array === arrayShuffled,
            "array!==arrayShuffled");
    });
    it("Test.0601 shuffle() Consistency", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const arrayOriginal: number[] = [1, 2, 3, 4, 5];
        const arrayOriginalInJsonString: string =
            JSON.stringify(arrayOriginal);
        Utility.debuggingLog(
            `arrayOriginalInJsonString=${arrayOriginalInJsonString}`);
        Utility.rngSeedXorshift128plusBigIntWithNumber(3, 4);
        const arrayShuffled: number[] =
            Object.assign([], arrayOriginal);
        Utility.shuffle(arrayShuffled);
        const arrayShuffledInJsonString: string =
            JSON.stringify(arrayShuffled);
        Utility.debuggingLog(
            `arrayShuffledInJsonString=${arrayShuffledInJsonString}`);
        Utility.rngSeedXorshift128plusBigIntWithNumber(3, 4);
        const arrayShuffledNew: number[] =
            Object.assign([], arrayOriginal);
        Utility.shuffle(arrayShuffledNew);
        const arrayShuffledNewInJsonString: string =
            JSON.stringify(arrayShuffledNew);
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

    it("Test.0700 buildStringMapFromUniqueStringArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["b", "a", "c", "d"];
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        const stringMap: { [id: string]: number; } =
            Utility.buildStringMapFromUniqueStringArray(stringArray);
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0701 buildStringMapFromStringArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["b", "a", "b", "c", "a", "a", "b", "d"];
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        const stringArrayMap: { "stringArray": string[], "stringMap": { [id: string]: number; } } =
            Utility.buildStringMapFromStringArray(stringArray);
        const stringMappedArray: string[] =
            stringArrayMap.stringArray;
        const stringMappedMap: { [id: string]: number; } =
            stringArrayMap.stringMap;
        const stringMappedArrayInJsonString: string =
            JSON.stringify(stringMappedArray);
        Utility.debuggingLog(
            `stringMappedArrayInJsonString=${stringMappedArrayInJsonString}`);
        const stringMappedMapInJsonString: string =
            JSON.stringify(stringMappedMap);
        Utility.debuggingLog(
            `stringMappedMapInJsonString=${stringMappedMapInJsonString}`);
    });
    it("Test.0702 buildStringMapFromStringArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArrays: string[][] =
            [["b", "a", "b", "c", "a", "a", "b", "d"],
             ["b", "a", "b", "c", "a", "a", "b", "d"]];
        const stringArraysInJsonString: string =
            JSON.stringify(stringArrays);
        Utility.debuggingLog(
            `stringArraysInJsonString=${stringArraysInJsonString}`);
        const stringArrayMap: { "stringArray": string[], "stringMap": { [id: string]: number; } } =
            Utility.buildStringMapFromStringArrays(stringArrays);
        const stringMappedArray: string[] =
            stringArrayMap.stringArray;
        const stringMappedMap: { [id: string]: number; } =
            stringArrayMap.stringMap;
        const stringMappedArrayInJsonString: string =
            JSON.stringify(stringMappedArray);
        Utility.debuggingLog(
            `stringMappedArrayInJsonString=${stringMappedArrayInJsonString}`);
        const stringMappedMapInJsonString: string =
            JSON.stringify(stringMappedMap);
        Utility.debuggingLog(
            `stringMappedMapInJsonString=${stringMappedMapInJsonString}`);
    });

    it("Test.0800 validateStringArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = ["b", "a", "c", "d"];
        const stringArray1: string[] = ["b", "a", "c", "d"];
        const stringArray0InJsonString: string =
            JSON.stringify(stringArray0);
        const stringArray1InJsonString: string =
            JSON.stringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        const validation: boolean =
            Utility.validateStringArrays(stringArray0, stringArray1);
        assert.ok(validation,
            `stringArray0InJsonString=${stringArray0InJsonString}` +
            `, stringArray1InJsonString=${stringArray1InJsonString}`);
    });
    it("Test.0801 validateStringArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = [];
        const stringArray1: string[] = [];
        const stringArray0InJsonString: string =
            JSON.stringify(stringArray0);
        const stringArray1InJsonString: string =
            JSON.stringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        const validation: boolean =
            Utility.validateStringArrays(stringArray0, stringArray1);
        assert.ok(validation,
            `stringArray0InJsonString=${stringArray0InJsonString}` +
            `, stringArray1InJsonString=${stringArray1InJsonString}`);
    });
    it("Test.0802 validateStringArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = [];
        const stringArray1: string[] = ["b", "a", "c", "d"];
        const stringArray0InJsonString: string =
            JSON.stringify(stringArray0);
        const stringArray1InJsonString: string =
            JSON.stringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        const validation: boolean =
            Utility.validateStringArrays(stringArray0, stringArray1, false);
        assert.ok(!validation,
            `stringArray0InJsonString=${stringArray0InJsonString}` +
            `, stringArray1InJsonString=${stringArray1InJsonString}`);
    });
    it("Test.0803 validateStringArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = ["b", "a", "c", "d"];
        const stringArray1: string[] = [];
        const stringArray0InJsonString: string =
            JSON.stringify(stringArray0);
        const stringArray1InJsonString: string =
            JSON.stringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        const validation: boolean =
            Utility.validateStringArrays(stringArray0, stringArray1, false);
        assert.ok(!validation,
            `stringArray0InJsonString=${stringArray0InJsonString}` +
            `, stringArray1InJsonString=${stringArray1InJsonString}`);
    });
    it("Test.0804 validateStringArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = [];
        const stringArray1: string[] = ["b", "f", "c", "d"];
        const stringArray0InJsonString: string =
            JSON.stringify(stringArray0);
        const stringArray1InJsonString: string =
            JSON.stringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        assert.throws(
            () => { Utility.validateStringArrays(stringArray0, stringArray1, true); });
    });
    it("Test.0805 validateStringArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = ["b", "a", "c", "d"];
        const stringArray1: string[] = [];
        const stringArray0InJsonString: string =
            JSON.stringify(stringArray0);
        const stringArray1InJsonString: string =
            JSON.stringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        assert.throws(
            () => { Utility.validateStringArrays(stringArray0, stringArray1, true); });
    });
    it("Test.0806 validateStringArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray0: string[] = ["b", "a", "c", "d"];
        const stringArray1: string[] = ["b", "f", "c", "d"];
        const stringArray0InJsonString: string =
            JSON.stringify(stringArray0);
        const stringArray1InJsonString: string =
            JSON.stringify(stringArray1);
        Utility.debuggingLog(
            `stringArray0InJsonString=${stringArray0InJsonString}`);
        Utility.debuggingLog(
            `stringArray1InJsonString=${stringArray1InJsonString}`);
        assert.throws(
            () => { Utility.validateStringArrays(stringArray0, stringArray1, true); });
    });
    it("Test.0807 validateStringSets()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
            Utility.validateStringSets(stringSet0, stringSet1);
        assert.ok(validation,
            `stringSet0InJsonString=${stringSet0InJsonString}` +
            `, stringSet1InJsonString=${stringSet1InJsonString}`);
    });
    it("Test.0808 validateStringSets()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
            Utility.validateStringSets(stringSet0, stringSet1);
        assert.ok(validation,
            `stringSet0InJsonString=${stringSet0InJsonString}` +
            `, stringSet1InJsonString=${stringSet1InJsonString}`);
    });
    it("Test.0809 validateStringSets()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
            Utility.validateStringSets(stringSet0, stringSet1, false);
        assert.ok(!validation,
            `stringSet0InJsonString=${stringSet0InJsonString}` +
            `, stringSet1InJsonString=${stringSet1InJsonString}`);
    });
    it("Test.0810 validateStringSets()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
            Utility.validateStringSets(stringSet0, stringSet1, false);
        assert.ok(!validation,
            `stringSet0InJsonString=${stringSet0InJsonString}` +
            `, stringSet1InJsonString=${stringSet1InJsonString}`);
    });
    it("Test.0811 validateStringSets()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
            () => { Utility.validateStringSets(stringSet0, stringSet1, true); });
    });
    it("Test.0812 validateStringSets()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
            () => { Utility.validateStringSets(stringSet0, stringSet1, true); });
    });
    it("Test.0813 validateStringSets()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
            () => { Utility.validateStringSets(stringSet0, stringSet1, true); });
    });
    it("Test.0814 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: { [id: string]: number; } = { a: 1, b: 2, c: 3 };
        const stringMap1: { [id: string]: number; } = { a: 1, b: 2, c: 3 };
        const stringMap0InJsonString: string =
            JSON.stringify(stringMap0);
        const stringMap1InJsonString: string =
            JSON.stringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        const validation: boolean =
            Utility.validateStringMaps(stringMap0, stringMap1);
        assert.ok(validation,
            `stringMap0InJsonString=${stringMap0InJsonString}` +
            `, stringMap1InJsonString=${stringMap1InJsonString}`);
    });
    it("Test.0815 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: { [id: string]: number; } = {};
        const stringMap1: { [id: string]: number; } = {};
        const stringMap0InJsonString: string =
            JSON.stringify(stringMap0);
        const stringMap1InJsonString: string =
            JSON.stringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        const validation: boolean =
            Utility.validateStringMaps(stringMap0, stringMap1);
        assert.ok(validation,
            `stringMap0InJsonString=${stringMap0InJsonString}` +
            `, stringMap1InJsonString=${stringMap1InJsonString}`);
    });
    it("Test.0816 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: { [id: string]: number; } = {};
        const stringMap1: { [id: string]: number; } = { a: 1, b: 2, c: 3 };
        const stringMap0InJsonString: string =
            JSON.stringify(stringMap0);
        const stringMap1InJsonString: string =
            JSON.stringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        const validation: boolean =
            Utility.validateStringMaps(stringMap0, stringMap1, false);
        assert.ok(!validation,
            `stringMap0InJsonString=${stringMap0InJsonString}` +
            `, stringMap1InJsonString=${stringMap1InJsonString}`);
    });
    it("Test.0817 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: { [id: string]: number; } = { a: 1, b: 2, c: 3 };
        const stringMap1: { [id: string]: number; } = {};
        const stringMap0InJsonString: string =
            JSON.stringify(stringMap0);
        const stringMap1InJsonString: string =
            JSON.stringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        const validation: boolean =
            Utility.validateStringMaps(stringMap0, stringMap1, false);
        assert.ok(!validation,
            `stringMap0InJsonString=${stringMap0InJsonString}` +
            `, stringMap1InJsonString=${stringMap1InJsonString}`);
    });
    it("Test.0818 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: { [id: string]: number; } = {};
        const stringMap1: { [id: string]: number; } = { a: 1, b: 2, c: 3 };
        const stringMap0InJsonString: string =
            JSON.stringify(stringMap0);
        const stringMap1InJsonString: string =
            JSON.stringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        assert.throws(
            () => { Utility.validateStringMaps(stringMap0, stringMap1, true); });
    });
    it("Test.0819 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: { [id: string]: number; } = { a: 1, b: 2, c: 3 };
        const stringMap1: { [id: string]: number; } = {};
        const stringMap0InJsonString: string =
            JSON.stringify(stringMap0);
        const stringMap1InJsonString: string =
            JSON.stringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        assert.throws(
            () => { Utility.validateStringMaps(stringMap0, stringMap1, true); });
    });
    it("Test.0820 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringMap0: { [id: string]: number; } = { a: 1, b: 2, c: 3 };
        const stringMap1: { [id: string]: number; } = { a: 2, b: 2, c: 3 };
        const stringMap0InJsonString: string =
            JSON.stringify(stringMap0);
        const stringMap1InJsonString: string =
            JSON.stringify(stringMap1);
        Utility.debuggingLog(
            `stringMap0InJsonString=${stringMap0InJsonString}`);
        Utility.debuggingLog(
            `stringMap1InJsonString=${stringMap1InJsonString}`);
        assert.throws(
            () => { Utility.validateStringMaps(stringMap0, stringMap1, true); });
    });

    it("Test.0900 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "c"];
        const stringMap: { [id: string]: number; } = {a: 0, b: 1, c: 2};
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            Utility.validateStringMap(stringArray, stringMap);
        assert.ok(validation,
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0901 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = [];
        const stringMap: { [id: string]: number; } = {a: 0, b: 1, c: 2};
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            Utility.validateStringMap(stringArray, stringMap, false);
        assert.ok(!validation,
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0902 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "c"];
        const stringMap: { [id: string]: number; } = {};
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            Utility.validateStringMap(stringArray, stringMap, false);
        assert.ok(!validation,
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0903 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b"];
        const stringMap: { [id: string]: number; } = {a: 0, b: 1, c: 2};
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            Utility.validateStringMap(stringArray, stringMap, false);
        assert.ok(!validation,
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0904 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "d"];
        const stringMap: { [id: string]: number; } = { a: 0, b: 1, c: 2 };
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            Utility.validateStringMap(stringArray, stringMap, false);
        assert.ok(!validation,
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0905 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "c"];
        const stringMap: { [id: string]: number; } = { a: 0, b: -1, c: 2 };
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            Utility.validateStringMap(stringArray, stringMap, false);
        assert.ok(!validation,
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0906 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = [];
        const stringMap: { [id: string]: number; } = { a: 0, b: 1, c: 2 };
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { Utility.validateStringMap(stringArray, stringMap, true); },
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0907 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "c"];
        const stringMap: { [id: string]: number; } = {};
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { Utility.validateStringMap(stringArray, stringMap, true); },
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0908 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b"];
        const stringMap: { [id: string]: number; } = { a: 0, b: 1, c: 2 };
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { Utility.validateStringMap(stringArray, stringMap, true); },
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0909 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "d"];
        const stringMap: { [id: string]: number; } = { a: 0, b: 1, c: 2 };
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { Utility.validateStringMap(stringArray, stringMap, true); },
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0910 validateStringMaps()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const stringArray: string[] = ["a", "b", "c"];
        const stringMap: { [id: string]: number; } = { a: 0, b: -1, c: 2 };
        const stringArrayInJsonString: string =
            JSON.stringify(stringArray);
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `stringArrayInJsonString=${stringArrayInJsonString}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { Utility.validateStringMap(stringArray, stringMap, true); },
            `stringArrayInJsonString=${stringArrayInJsonString}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0911 validateKeyId()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const keyId: number = 1;
        const stringMap: { [id: string]: number; } = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `keyId=${keyId}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            Utility.validateKeyId(keyId, stringMap);
        assert.ok(validation,
            `keyId=${keyId}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0912 validateKeyId()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const keyId: number = -1;
        const stringMap: { [id: string]: number; } = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `keyId=${keyId}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            Utility.validateKeyId(keyId, stringMap, false);
        assert.ok(!validation,
            `keyId=${keyId}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0913 validateKeyId()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const keyId: number = 3;
        const stringMap: { [id: string]: number; } = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `keyId=${keyId}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            Utility.validateKeyId(keyId, stringMap, false);
        assert.ok(!validation,
            `keyId=${keyId}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0914 validateKeyId()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const keyId: number = -1;
        const stringMap: { [id: string]: number; } = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `keyId=${keyId}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { Utility.validateKeyId(keyId, stringMap, true); },
            `keyId=${keyId}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0915 validateKeyId()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const keyId: number = 3;
        const stringMap: { [id: string]: number; } = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `keyId=${keyId}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { Utility.validateKeyId(keyId, stringMap, true); },
            `keyId=${keyId}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0916 validateKey()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const key: string = "b";
        const stringMap: { [id: string]: number; } = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `key=${key}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            Utility.validateKey(key, stringMap);
        assert.ok(validation,
            `key=${key}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0917 validateKey()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const key: string = "d";
        const stringMap: { [id: string]: number; } = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `key=${key}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        const validation: boolean =
            Utility.validateKey(key, stringMap, false);
        assert.ok(!validation,
            `key=${key}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });
    it("Test.0918 validateKey()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const key: string = "d";
        const stringMap: { [id: string]: number; } = { a: 0, b: 1, c: 2 };
        const stringMapInJsonString: string =
            JSON.stringify(stringMap);
        Utility.debuggingLog(
            `key=${key}`);
        Utility.debuggingLog(
            `stringMapInJsonString=${stringMapInJsonString}`);
        assert.throws(
            () => { Utility.validateKey(key, stringMap, true); },
            `key=${key}` +
            `, stringMapInJsonString=${stringMapInJsonString}`);
    });

    it("Test.1000 loadLabelTextColumnarFile()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "data/Columnar/Email.tsv";
        const labelColumnIndex: number = 0;
        const textColumnIndex: number = 2;
        const lineIndexToStart: number = 1;
        const columnDelimiter: string = "\t";
        const rowDelimiter: string = "\n";
        const encoding: string = "utf8";
        const lineIndexToEnd: number = -1;
        const result: { "intents": string[], "utterances": string[] } =
            Utility.loadLabelTextColumnarFile(
                filename,
                labelColumnIndex,
                textColumnIndex,
                lineIndexToStart,
                columnDelimiter,
                rowDelimiter,
                encoding,
                lineIndexToEnd);
        const intents: string[] =
            result.intents;
        const utterances: string[] =
            result.utterances;
        assert.ok(intents.length === 601,
            `intents.length=${intents.length}`);
        assert.ok(utterances.length === 601,
            `utterances.length=${utterances.length}`);
    });
    it("Test.1001 loadLabelTextColumnarContent()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "data/Columnar/Email.tsv";
        const fileContent: string =
            Utility.loadFile(filename);
        const labelColumnIndex: number = 0;
        const textColumnIndex: number = 2;
        const lineIndexToStart: number = 1;
        const columnDelimiter: string = "\t";
        const rowDelimiter: string = "\n";
        const encoding: string = "utf8";
        const lineIndexToEnd: number = -1;
        const result: { "intents": string[], "utterances": string[] } =
            Utility.loadLabelTextColumnarContent(
                fileContent,
                labelColumnIndex,
                textColumnIndex,
                lineIndexToStart,
                columnDelimiter,
                rowDelimiter,
                encoding,
                lineIndexToEnd);
        const intents: string[] =
            result.intents;
        const utterances: string[] =
            result.utterances;
        assert.ok(intents.length === 601,
            `intents.length=${intents.length}`);
        assert.ok(utterances.length === 601,
            `utterances.length=${utterances.length}`);
    });

    it("Test.1100 loadFile()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "data/Columnar/Email.tsv";
        const fileContent: string =
            Utility.loadFile(filename);
        Utility.debuggingLog(
            `fileContent.length=${fileContent.length}`);
        assert.ok(fileContent.length === 25892,
            `fileContent.length=${fileContent.length}`);
    });
    // ---- TODO ---- it("Test.1101 dumpFile()", function() {
    // ---- TODO ----     Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    // ---- TODO ----     this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    // ---- TODO ----     Utility.debuggingLog(
    // ---- TODO ----         `process.cwd()=${process.cwd()}`);
    // ---- TODO ----     const filename: string = "data/Columnar/Email.tsv";
    // ---- TODO ----     const fileContent: string =
    // ---- TODO ----         Utility.loadFile(filename);
    // ---- TODO ----     Utility.debuggingLog(
    // ---- TODO ----         `fileContent.length=${fileContent.length}`);
    // ---- TODO ----     assert.ok(fileContent.length === 25892,
    // ---- TODO ----         `fileContent.length=${fileContent.length}`);
    // ---- TODO ---- });
    it("Test.1102 exists()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "data/Columnar/Email.tsv";
        const fileExists: boolean =
            Utility.exists(filename);
        assert.ok(fileExists,
            `filename=${filename}`);
    });
    it("Test.1103 exists()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        Utility.debuggingLog(
            `process.cwd()=${process.cwd()}`);
        const filename: string = "data/Columnar/Email.sss";
        const fileExists: boolean =
            Utility.exists(filename);
        assert.ok(!fileExists,
            `filename=${filename}`);
    });

    it("Test.1200 getObjectMd5Hash()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const message: string = "Hello, World!";
        const messageMd5Hash: string =
            Utility.getObjectMd5Hash(message as any) as string;
        Utility.debuggingLog(
            `messageMd5Hash=${messageMd5Hash}`);
        assert.ok(messageMd5Hash === "7959b2c4af2fd6d142ba32babd30ceb7",
            `messageMd5Hash=${messageMd5Hash}`);
    });
    it("Test.1201 getStringMd5Hash()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const message: string = "Hello, World!";
        const messageMd5Hash: string =
            Utility.getStringMd5Hash(message) as string;
        Utility.debuggingLog(
            `messageMd5Hash=${messageMd5Hash}`);
        assert.ok(messageMd5Hash === "65a8e27d8879283831b664bd8b7f0ad4",
            `messageMd5Hash=${messageMd5Hash}`);
    });

    it("Test.1300 getPositiveObjectHashCode()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const message: string = "Hello, World!";
        const messageMd5Hash: number =
            Utility.getPositiveObjectHashCode(message as any);
        Utility.debuggingLog(
            `messageMd5Hash=${messageMd5Hash}`);
        assert.ok(messageMd5Hash === 1064999089,
            `messageMd5Hash=${messageMd5Hash}`);
    });
    it("Test.1301 getObjectHashCode()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const message: string = "Hello, World!";
        const messageMd5Hash: number =
            Utility.getObjectHashCode(message as any);
        Utility.debuggingLog(
            `messageMd5Hash=${messageMd5Hash}`);
        assert.ok(messageMd5Hash === -1064999089,
            `messageMd5Hash=${messageMd5Hash}`);
    });
    it("Test.1302 getPositiveStringHashCode()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const message: string = "Hello, World!";
        const messageMd5Hash: number =
            Utility.getPositiveStringHashCode(message);
        Utility.debuggingLog(
            `messageMd5Hash=${messageMd5Hash}`);
        assert.ok(messageMd5Hash === 1498789909,
            `messageMd5Hash=${messageMd5Hash}`);
    });
    it("Test.1303 getStringHashCode()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const message: string = "Hello, World!";
        const messageMd5Hash: number =
            Utility.getStringHashCode(message);
        Utility.debuggingLog(
            `messageMd5Hash=${messageMd5Hash}`);
        assert.ok(messageMd5Hash === 1498789909,
            `messageMd5Hash=${messageMd5Hash}`);
    });

    it("Test.1400 isEmptyNumberF32I32U8Array()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: Float32Array = new Float32Array();
        const isEmpty: boolean =
            Utility.isEmptyNumberF32I32U8Array(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1401 isEmptyNumberF32I32U8Array()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: Float32Array = new Float32Array(1);
        const isEmpty: boolean =
            Utility.isEmptyNumberF32I32U8Array(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1402 isEmptyBooleanArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: boolean[][] = [];
        const isEmpty: boolean =
            Utility.isEmptyBooleanArrays(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1403 isEmptyBooleanArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: boolean[][] = [[false]];
        const isEmpty: boolean =
            Utility.isEmptyBooleanArrays(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1404 isEmptyNumberArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: number[][] = [];
        const isEmpty: boolean =
            Utility.isEmptyNumberArrays(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1405 isEmptyNumberArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: number[][] = [[0]];
        const isEmpty: boolean =
            Utility.isEmptyNumberArrays(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1406 isEmptyArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: object[][] = [];
        const isEmpty: boolean =
            Utility.isEmptyArrays(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1407 isEmptyArrays()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: object[][] = [["0" as any]];
        const isEmpty: boolean =
            Utility.isEmptyArrays(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1408 isEmptyBooleanArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: boolean[] = [];
        const isEmpty: boolean =
            Utility.isEmptyBooleanArray(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1409 isEmptyBooleanArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: boolean[] = [false];
        const isEmpty: boolean =
            Utility.isEmptyBooleanArray(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1410 isEmptyNumberArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: number[] = [];
        const isEmpty: boolean =
            Utility.isEmptyNumberArray(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1411 isEmptyNumberArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: number[] = [0];
        const isEmpty: boolean =
            Utility.isEmptyNumberArray(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1412 isEmptyArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: object[] = [];
        const isEmpty: boolean =
            Utility.isEmptyArray(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1413 isEmptyArray()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: object[] = ["0" as any];
        const isEmpty: boolean =
            Utility.isEmptyArray(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });
    it("Test.1414 isEmptyString()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string = "";
        const isEmpty: boolean =
            Utility.isEmptyString(input);
        assert.ok(isEmpty,
            `input=${input}`);
    });
    it("Test.1415 isEmptyString()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string = "0";
        const isEmpty: boolean =
            Utility.isEmptyString(input);
        assert.ok(!isEmpty,
            `input=${input}`);
    });

    it("Test.1500 getSetLength()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: Set<string> = new Set<string>(["0"]);
        const length: number =
            Utility.getSetLength(input);
        assert.ok(length === 1,
            `input=${input}`);
    });
    it("Test.1501 getMapLength()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: { [id: string]: number } = {a: 0};
        const length: number =
            Utility.getMapLength(input);
        assert.ok(length === 1,
            `input=${input}`);
    });

    it("Test.1600 getJsonStringified()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string[] = ["a"];
        const jsonStringified: string =
            Utility.getJsonStringified(input);
        Utility.debuggingLog(
            `jsonStringified=${jsonStringified}`);
        assert.ok(true,
            `jsonStringified=${jsonStringified}`);
    });

    it("Test.1700 debuggingLog()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string[] = ["a"];
        const jsonStringified: string =
            Utility.getJsonStringified(input);
        Utility.debuggingLog(
            `jsonStringified=${jsonStringified}`);
        assert.ok(true,
            `jsonStringified=${jsonStringified}`);
    });

    it("Test.1800 debuggingThrow()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.throws(
            () => {
                Utility.debuggingThrow(
                    `exception`);
            });
    });

    it("Test.1900 almostEqual()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
    it("Test.1901 almostEqual()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
    it("Test.1902 almostEqualRough()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
    it("Test.1903 almostEqualRough()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
    it("Test.1904 getAlmostEqualPercentage()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
    it("Test.1905 almostEqualAbsolute()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
    it("Test.1906 almostEqualAbsolute()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
    it("Test.1907 almostEqualAbsoluteRough()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
    it("Test.1908 almostEqualAbsoluteRough()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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
    it("Test.1909 getAlmostEqualAbsolute()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
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

    it("Test.2000 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean(true));
    });
    it("Test.2001 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean("true"));
    });
    it("Test.2002 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean(1));
    });
    it("Test.2003 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean("1"));
    });
    it("Test.2004 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean("on"));
    });
    it("Test.2005 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean("yes"));
    });
    it("Test.2006 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean("positive"));
    });
    it("Test.2007 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean(false));
    });
    it("Test.2008 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean("false"));
    });
    it("Test.2009 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean(0));
    });
    it("Test.2010 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean("0"));
    });
    it("Test.2011 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean("off"));
    });
    it("Test.2012 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean("no"));
    });
    it("Test.2013 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean("negative"));
    });
    it("Test.2014 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(Utility.toBoolean("TRUE"));
    });
    it("Test.2015 toBoolean()", function() {
        Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        assert.ok(!Utility.toBoolean("FALSE"));
    });
});
