/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { CryptoUtility } from "../../src/utility/CryptoUtility";

import { Utility } from "../../src/utility/Utility";

import { UnitTestHelper } from "./Utility.test";

describe("Test Suite - utility/CryptoUtility", () => {
    it("Test.0000 getStringMdgetCryptoHashes5Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const cryptoHashes: string[] = CryptoUtility.getCryptoHashes();
        Utility.debuggingLog(`cryptoHashes="${cryptoHashes}""`);
    });
    /*
    cryptoHashes=
    RSA-MD4,
    RSA-MD5,
    RSA-MDC2,
    RSA-RIPEMD160,
    RSA-SHA1,
    RSA-SHA1-2,
    RSA-SHA224,
    RSA-SHA256,
    RSA-SHA3-224,
    RSA-SHA3-256,
    RSA-SHA3-384,
    SA-SHA3-512,
    RSA-SHA384,
    RSA-SHA512,
    RSA-SHA512/224,
    RSA-SHA512/256,
    RSA-SM3,
    blake2b512,
    blake2s256,
    id-rsassa-pkcs1-v1_5-with-sha3-224,
    id-rsassa-pkcs1-v1_5-with-sha3-256,
    id-rsassa-pkcs1-v1_5-with-sha3-384,
    id-rsassa-pkcs1-v1_5-with-sha3-512,
    md4,md4WithRSAEncryption,
    md5,
    md5-sha1,
    md5WithRSAEncryption,
    mdc2,
    mdc2WithRSA,
    ripemd,
    ripemd160,
    ripemd160WithRSA,
    rmd160,
    sha1,
    sha1WithRSAEncryption,
    sha224,
    sha224WithRSAEncryption,
    sha256,
    sha256WithRSAEncryption,
    sha3-224,
    sha3-256,
    sha3-384,
    sha3-512,
    sha384,
    sha384WithRSAEncryption,
    sha512,
    sha512-224,
    sha512-224WithRSAEncryption,
    sha512-256,
    sha512-256WithRSAEncryption,
    sha512WithRSAEncryption,
    shake128,
    shake256,
    sm3,
    sm3WithRSAEncryption,
    ssl3-md5,
    ssl3-sha1,
    whirlpool
    */

    it("Test.0100 getStringMd5Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string = "Hello, World!";
        const inputMd5: string = CryptoUtility.getStringMd5Hash(input) as string;
        Utility.debuggingLog(`Utility.jsonStringify(input)="${Utility.jsonStringify(input)}", inputMd5="${inputMd5}"`);
    });
    it("Test.0200 getObjectMd5Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string[] = ["Hello, World!"];
        const inputMd5: string = CryptoUtility.getObjectMd5Hash(input) as string;
        Utility.debuggingLog(`Utility.jsonStringify(input)="${Utility.jsonStringify(input)}", inputMd5="${inputMd5}"`);
    });

    it("Test.0300 getStringSha256Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string = "Hello, World!";
        const inputSha256: string = CryptoUtility.getStringSha256Hash(input) as string;
        Utility.debuggingLog(`Utility.jsonStringify(input)="${Utility.jsonStringify(input)}", inputSha256="${inputSha256}"`);
    });
    it("Test.0400 getObjectSha256Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string[] = ["Hello, World!"];
        const inputSha256: string = CryptoUtility.getObjectSha256Hash(input) as string;
        Utility.debuggingLog(`Utility.jsonStringify(input)="${Utility.jsonStringify(input)}", inputSha256="${inputSha256}"`);
    });

    it("Test.0500 getStringSha512Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string = "Hello, World!";
        const inputSha512: string = CryptoUtility.getStringSha512Hash(input) as string;
        Utility.debuggingLog(`Utility.jsonStringify(input)="${Utility.jsonStringify(input)}", inputSha512="${inputSha512}"`);
    });
    it("Test.0600 getObjectSha512Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string[] = ["Hello, World!"];
        const inputSha512: string = CryptoUtility.getObjectSha512Hash(input) as string;
        Utility.debuggingLog(`Utility.jsonStringify(input)="${Utility.jsonStringify(input)}", inputSha512="${inputSha512}"`);
    });

    it("Test.0700 getStringSha384Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string = "Hello, World!";
        const inputSha384: string = CryptoUtility.getStringSha384Hash(input) as string;
        Utility.debuggingLog(`Utility.jsonStringify(input)="${Utility.jsonStringify(input)}", inputSha384="${inputSha384}"`);
    });
    it("Test.0800 getObjectSha384Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string[] = ["Hello, World!"];
        const inputSha384: string = CryptoUtility.getObjectSha384Hash(input) as string;
        Utility.debuggingLog(`Utility.jsonStringify(input)="${Utility.jsonStringify(input)}", inputSha384="${inputSha384}"`);
    });

    it("Test.0900 getStringSha1Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string = "Hello, World!";
        const inputSha1: string = CryptoUtility.getStringSha1Hash(input) as string;
        // tslint:disable-next-line: max-line-length
        Utility.debuggingLog(`Utility.jsonStringify(input)="${Utility.jsonStringify(input)}", inputSha1="${inputSha1}"`);
    });
    it("Test.1000 getObjectSha1Hash()", function() {
        Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const input: string[] = ["Hello, World!"];
        const inputSha1: string = CryptoUtility.getObjectSha1Hash(input) as string;
        // tslint:disable-next-line: max-line-length
        Utility.debuggingLog(`Utility.jsonStringify(input)="${Utility.jsonStringify(input)}", inputSha1="${inputSha1}"`);
    });
});
