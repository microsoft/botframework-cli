/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-async-promise-executor */

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const fixBuffer: any = function (fileBuffer) {
  if (fileBuffer) {
    // If the data starts with BOM, we know it is UTF
    if (fileBuffer[0] === 0xEF && fileBuffer[1] === 0xBB && fileBuffer[2] === 0xBF) {
      // EF BB BF  UTF-8 with BOM
      fileBuffer = fileBuffer.slice(3);
    } else if (fileBuffer[0] === 0xFF && fileBuffer[1] === 0xFE && fileBuffer[2] === 0x00 && fileBuffer[3] === 0x00) {
      // FF FE 00 00  UTF-32, little-endian BOM
      fileBuffer = fileBuffer.slice(4);
    } else if (fileBuffer[0] === 0x00 && fileBuffer[1] === 0x00 && fileBuffer[2] === 0xFE && fileBuffer[3] === 0xFF) {
      // 00 00 FE FF  UTF-32, big-endian BOM
      fileBuffer = fileBuffer.slice(4);
    } else if (fileBuffer[0] === 0xFE && fileBuffer[1] === 0xFF && fileBuffer[2] === 0x00 && fileBuffer[3] === 0x00) {
      // FE FF 00 00  UCS-4, unusual octet order BOM (3412)
      fileBuffer = fileBuffer.slice(4);
    } else if (fileBuffer[0] === 0x00 && fileBuffer[1] === 0x00 && fileBuffer[2] === 0xFF && fileBuffer[3] === 0xFE) {
      // 00 00 FF FE  UCS-4, unusual octet order BOM (2143)
      fileBuffer = fileBuffer.slice(4);
    } else if (fileBuffer[0] === 0xFF && fileBuffer[1] === 0xFE) {
      // FF FE  UTF-16, little endian BOM
      fileBuffer = fileBuffer.slice(2);
    } else if (fileBuffer[0] === 0xFE && fileBuffer[1] === 0xFF) {
      // FE FF  UTF-16, big endian BOM
      fileBuffer = fileBuffer.slice(2);
    }
  }
  return fileBuffer.toString('utf8').replace(/\0/g, '');
};

async function readTextFile(file: any): Promise<string> {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      if (!fs.existsSync(file)) {
        return reject('ENOENT: no such file or directory, ' + file);
      }

      const readFile: any = util.promisify(fs.readFile);
      const fileBuffer: any = await readFile(file);
      return resolve(fixBuffer(fileBuffer));
    } catch (error) {
      if (error.message.match(/ENOENT: no such file or directory/)) {
        return reject(new Error(error.message));
      }

      return reject(`Invalid Input. Sorry, unable to parse file: ${error}`);
    }
  });
}

export async function getContentFromFile(file: string) {
  // catch if input file is a folder
  if (fs.lstatSync(file).isDirectory()) {
    throw new Error(`Sorry ${file} does not exist`);
  }
  if (!fs.existsSync(path.resolve(file))) {
    throw new Error(`Sorry ${file} does not exist`);
  }

  let fileContent: string;
  try {
    fileContent = await readTextFile(file);
  } catch (error) {
    throw (new Error('Sorry, error reading file: ' + file));
  }

  return fileContent;
}
