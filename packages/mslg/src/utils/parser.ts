import * as fs from 'fs-extra';
import { helpers, ErrorType } from './helpers';
import * as path from 'path';
import * as txtfile from 'read-text-file';
import * as chalk from 'chalk';
import { MSLGTool } from 'botbuilder-lg';

const readlineSync = require('readline-sync');

export class Parser {
    private tool: MSLGTool = new MSLGTool();

    public Parser(flags: any) {
        let filesToParse: any[] = [];
        let folderStat: any;
        if (flags.in) {
            filesToParse.push(flags.in);
        }

        if (flags.lg_folder) {
            try {
                folderStat = fs.statSync(flags.lg_folder);
            } catch (err) {
                throw new Error(flags.lg_folder + ' is not a folder or does not exist');
            }
            if (!folderStat.isDirectory()) {
                throw new Error(flags.lg_folder + ' is not a folder or does not exist');
            }
            if (flags.subfolder) {
                filesToParse = helpers.findLGFiles(flags.lg_folder, true);
            } else {
                filesToParse = helpers.findLGFiles(flags.lg_folder, false);
            }
            if (filesToParse.length === 0) {
                throw new Error('no .lg files found in the specified folder.');
            }
        }

        let errors: string[] = [];

        while (filesToParse.length > 0) {
            let file = filesToParse[0];
            const parseRes = this.parseFile(file, flags.verbose);
            errors = errors.concat(parseRes);
            filesToParse.splice(0, 1);
        }

        if (flags.stdin) {
            let parsedJsonFromStdin;
            try {
                let value = readlineSync.question(`Please enter the lg file content: `);
                parsedJsonFromStdin = JSON.parse(value);
            } catch (err) {
                throw new Error(`unable to parse stdin as JSON! \n\n ${JSON.stringify(err, null, 2)}\n\n`);
            }

            errors = errors.concat(this.parseStream(parsedJsonFromStdin, flags.verbose));
        }

        if (errors.filter(error => error.startsWith(ErrorType.Error)).length > 0) {
            throw new Error("parsing lg files failed.");
        }

        let fileName: string;
        if (flags.out) {
            fileName = flags.out + '_mslg.lg';
        } else if (flags.in) {
            if (!path.isAbsolute(flags.in)) {
                fileName = path.resolve('', flags.in);
            }
            else {
                fileName = flags.in;
            }

           
            let fileNameSegment = fileName.split('\\').pop()
            fileName = fileNameSegment
              ? fileNameSegment.replace('.lg', '') + '_mslg.lg'
              : ''
        } else {
            if (!path.isAbsolute(flags.lg_folder)) {
                fileName = path.resolve('', flags.lg_folder);
            }
            else {
                fileName = flags.lg_folder;
            }

            fileName = fileName.split('\\').pop() + '_mslg.lg'
        }

        let outFolder: string = process.cwd();
        if (flags.out_folder) {
            if (path.isAbsolute(flags.out_folder)) {
                outFolder = flags.out_folder;
            } else {
                outFolder = path.resolve('', flags.out_folder);
            }

            if (!fs.existsSync(outFolder)) {
                throw new Error('output folder ' + outFolder + ' does not exist');
            }
        }

        if (this.tool.CollationMessages.length > 0) {
            this.tool.CollationMessages.forEach(error => {
                if (error.startsWith(ErrorType.Error)) {
                    process.stderr.write(chalk.default.redBright(error + '\n'));
                } else {
                    process.stdout.write(chalk.default.yellowBright(error + '\n'));
                }
            });

            throw new Error("collating lg files failed." + '\n');
        } else {
            if (flags.collate === undefined && this.tool.NameCollisions.length > 0) {
                throw new Error('below template names are defined in multiple files: ' + this.tool.NameCollisions.toString());
            } else {
                const mergedLgFileContent = this.tool.CollateTemplates();
                if (mergedLgFileContent === undefined || mergedLgFileContent === '') {
                    throw new Error(`generating collated lg file failed.`);
                }
                const filePath = outFolder + '\\' + fileName;
                if (fs.existsSync(filePath)) {
                    throw new Error(`a file named ${fileName} already exists in the folder ${outFolder}.`);
                } else {
                    if (flags.stdout) {
                        process.stdout.write(chalk.default.whiteBright(mergedLgFileContent));
                    } else {
                        fs.writeFileSync(filePath, mergedLgFileContent);
                        process.stdout.write(chalk.default.whiteBright(`Collated lg file is generated here: ${filePath}.\n`));
                    }
                }
            }
        }
    }

    private parseFile(fileName: string, verbose: boolean): string[] {
        if (!fs.existsSync(path.resolve(fileName))) {
            throw new Error('unable to open file: ' + fileName);
        }

        let fileContent = txtfile.readSync(fileName);
        if (!fileContent) {
            throw new Error('unable to read file: ' + fileName);
        }

        if (verbose) process.stdout.write(chalk.default.whiteBright('Parsing file: ' + fileName + '\n'));

        const errors: string[] = this.tool.ValidateFile(fileContent, path.resolve(fileName));
        if (errors.length > 0) {
            errors.forEach(error => {
                if (error.startsWith(ErrorType.Error)) {
                    process.stderr.write(chalk.default.redBright(error + '\n'));
                } else {
                    process.stdout.write(chalk.default.yellowBright(error + '\n'));
                }
            });
        }

        return errors;
    }

    private parseStream(fileContent: string, verbose: boolean): string[] {
        if (verbose) process.stdout.write(chalk.default.whiteBright('Parsing from stdin.\n'));

        const errors: string[] = this.tool.ValidateFile(fileContent, path.resolve('./'));
        if (errors.length > 0) {
            errors.forEach(error => {
                process.stderr.write(chalk.default.redBright(error + '\n'));
            });
        }

        return errors;
    }
}