import {CLIError} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const path = require('path')
const helpers = require('./../../parser/lufile/helpers')

export async function getLuFiles(input: string | undefined, recurse = false): Promise<Array<any>> {
    let filesToParse = []
    let fileStat = fs.stat(input)
    if (fileStat.isFile()) {
        filesToParse.push(input)
        return filesToParse
    }

    if (!fileStat.isDirectory()) {
        throw new CLIError('Sorry, ' + input + ' is not a folder or does not exist')
    }

    filesToParse = helpers.findLUFiles(input, recurse)

    if (filesToParse.length === 0) {
        throw new CLIError('Sorry, no .lu files found in the specified folder.')
    }
    return filesToParse
}


export async function generateNewFilePath(input: string, output: string, extension = ''): Promise<string> {
    let outputStat = await fs.stat(output)
    if (outputStat.isFile()) {
        return path.join(process.cwd(), output)
    }
    let inputStat = await fs.stat(input)
    let base = path.join(process.cwd(), output)
    await fs.mkdirp(base)
    if (inputStat.isFile()) {
        return path.basename(input, path.extname(input)) + extension
    }

    return path.join(base, 'file'+extension)
}
