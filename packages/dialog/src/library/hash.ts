/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as crypto from 'crypto'
import * as fs from 'fs-extra'
import * as os from 'os'
import * as ppath from 'path'

export function computeHash(val: string): string {
    return crypto.createHash('md5').update(val).digest('hex')
}

// Normalize to OS line endings
function normalizeEOL(val: string): string {
    if (val.startsWith('#!/')) {
        // For linux shell scripts want line feed only
        val = val.replace(/\r/g, '')
    } else if (os.EOL === '\r\n') {
        val = val.replace(/(^|[^\r])\n/g, `$1${os.EOL}`)
    } else {
        val = val.replace(/\r\n/g, os.EOL)
    }
    return val
}

// Stringify JSON with optional replacer
export function stringify(val: any, replacer?: any): string {
    if (typeof val === 'object') {
        val = normalizeEOL(JSON.stringify(val, replacer, '  '))
    }
    return val
}

export function computeJSONHash(json: any): string {
    return computeHash(stringify(json))
}

const CommentHashExtensions = ['.lg', '.lu', '.qna']
const JSONHashExtensions = ['.dialog']
const HashPattern = /\r?\n> Imported: ([a-zA-Z0-9]+)/
const ReplaceHashPattern = /\r?\n> Imported: ([a-zA-Z0-9]+)/g

/**
 * Add approriate hash to file contents if a known file type and return it.
 * @param path Path to file.
 */
export async function addHash(path: string): Promise<string> {
    let val = await fs.readFile(path, 'utf-8')
    let ext = ppath.extname(path)
    if (CommentHashExtensions.includes(ext)) {
        val = val.replace(ReplaceHashPattern, '')
        if (!val.endsWith(os.EOL)) {
            val += os.EOL
        }
        val += `${os.EOL}> Imported: ${computeHash(val)}`
    } else if (JSONHashExtensions.includes(ext)) {
        let json = JSON.parse(val)
        delete json.$Imported
        json.$Imported = computeJSONHash(json)
        val = stringify(json)
    }
    return val
}

/**
 * Check to see if the contents of a file have changed since hash was computed.
 * @param path Path to file to check.
 */
export async function isUnchanged(path: string): Promise<boolean> {
    let result = false
    let ext = ppath.extname(path)
    let file = await fs.readFile(path, 'utf8')
    if (CommentHashExtensions.includes(ext)) {
        let match = file.match(HashPattern)
        if (match) {
            let oldHash = match[1]
            file = file.replace(HashPattern, '')
            let hash = computeHash(file)
            result = oldHash === hash
        }
    } else if (JSONHashExtensions.includes(ext)) {
        let json = JSON.parse(file)
        let oldHash = json.$Imported
        if (oldHash) {
            delete json.$Imported
            let hash = computeJSONHash(json)
            result = oldHash === hash
        }
    }
    return result
}
