/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as crypto from "crypto";

import { Utility } from "./Utility";

export class CryptoUtility {
    public static salt: string = "secret";

    public static getNumberObfuscated(input: number, length: number = -1): number {
        let inputObfuscated: string = CryptoUtility.getStringMd5Hash(input.toString()) as string;
        if (length < 0) {
            length = 4;
        }
        if (length > inputObfuscated.length) {
            length = inputObfuscated.length;
        }
        inputObfuscated = `0x${inputObfuscated.substr(0, length)}`;
        return +inputObfuscated;
    }

    public static getObjectObfuscated(objectValue: object): string {
        return CryptoUtility.getObjectMd5Hash(objectValue) as string;
    }
    public static getStringObfuscated(input: string): string {
        return CryptoUtility.getStringMd5Hash(input) as string;
    }

    public static getObjectSha256Hash(objectValue: object): string|Int32Array {
        const hash = crypto.createHash("sha256");
        hash.update(CryptoUtility.salt);
        return hash.update(Utility.jsonStringify(objectValue)).digest("hex");
    }
    public static getStringSha256Hash(input: string): string|Int32Array {
        const hash = crypto.createHash("sha256");
        hash.update(CryptoUtility.salt);
        return hash.update(input).digest("hex");
    }

    public static getObjectSha512Hash(objectValue: object): string|Int32Array {
        const hash = crypto.createHash("sha512");
        hash.update(CryptoUtility.salt);
        return hash.update(Utility.jsonStringify(objectValue)).digest("hex");
    }
    public static getStringSha512Hash(input: string): string|Int32Array {
        const hash = crypto.createHash("sha512");
        hash.update(CryptoUtility.salt);
        return hash.update(input).digest("hex");
    }

    public static getObjectSha384Hash(objectValue: object): string|Int32Array {
        const hash = crypto.createHash("sha384");
        hash.update(CryptoUtility.salt);
        return hash.update(Utility.jsonStringify(objectValue)).digest("hex");
    }
    public static getStringSha384Hash(input: string): string|Int32Array {
        const hash = crypto.createHash("sha384");
        hash.update(CryptoUtility.salt);
        return hash.update(input).digest("hex");
    }

    public static getObjectSha1Hash(objectValue: object): string|Int32Array {
        const hash = crypto.createHash("sha1");
        hash.update(CryptoUtility.salt);
        return hash.update(Utility.jsonStringify(objectValue)).digest("hex");
    }
    public static getStringSha1Hash(input: string): string|Int32Array {
        const hash = crypto.createHash("sha1");
        hash.update(CryptoUtility.salt);
        return hash.update(input).digest("hex");
    }

    public static getCryptoHashes(): string[] {
        const hashes: string[] = crypto.getHashes();
        return hashes;
    }

    public static getObjectMd5Hash(objectValue: object): string|Int32Array {
        return Utility.getObjectMd5Hash(objectValue);
    }
    public static getStringMd5Hash(input: string): string|Int32Array {
        return Utility.getStringMd5Hash(input);
    }
}
