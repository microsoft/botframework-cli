/**
 * @module @microsoft/bf-lg-cli
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {expect} from '@oclif/test'
import * as fs from 'fs-extra'
import * as path from 'path'

export class TestUtil {
  public static async compareFiles(file1: string, file2: string): Promise<void> {
    let result = (await fs.readFile(path.join(__dirname, file1))).toString()
    let fixtureFile = (await fs.readFile(path.join(__dirname, file2))).toString()
    result = result.replace(/\r\n/g, '\n').trim()
    fixtureFile = fixtureFile.replace(/\r\n/g, '\n').trim()
    expect(result).to.deep.equal(fixtureFile)
  }
}
