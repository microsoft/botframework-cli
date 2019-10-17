"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class Writer {
    constructor() {
        this.indentSize = 4;
        this.indentLevel = 0;
        this.outputStream = undefined;
    }
    async setOutputStream(outputPath) {
        const ConsoleStream = require('console-stream');
        const stream = outputPath ? fs_1.createWriteStream(outputPath) : ConsoleStream();
        const streamPromise = new Promise((resolve) => {
            if (stream instanceof fs_1.WriteStream) {
                stream.once('ready', (_fd) => {
                    this.outputStream = stream;
                    resolve();
                });
            }
            else {
                this.outputStream = stream;
                resolve();
            }
        });
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(resolve, 2000);
            this.outputStream = stream;
        });
        return Promise.race([streamPromise, timeoutPromise]).then(() => {
        });
    }
    increaseIndentation() {
        this.indentLevel += this.indentSize;
    }
    decreaseIndentation() {
        this.indentLevel -= this.indentSize;
    }
    write(str) {
        this.outputStream.write(str);
    }
    writeLine(str = '') {
        if (typeof str === 'string') {
            this.write(str + '\n');
        }
        else {
            str.forEach(line => {
                this.write(line + '\n');
            });
        }
    }
    writeIndented(str) {
        let writeFunction = (text) => {
            for (let index = 0; index < this.indentLevel; index++) {
                this.write(' ');
            }
            this.write(text);
        };
        writeFunction.bind(this);
        if (typeof str === 'string') {
            writeFunction(str);
        }
        else {
            str.forEach(line => {
                writeFunction(line);
            });
        }
    }
    writeLineIndented(lines) {
        if (typeof lines === 'string') {
            this.writeIndented(lines + '\n');
        }
        else {
            lines.forEach(line => {
                this.writeIndented(line + '\n');
            });
        }
    }
    async closeOutputStream() {
        this.outputStream.end();
        const streamPromise = new Promise((resolve) => {
            if (this.outputStream instanceof fs_1.WriteStream) {
                this.outputStream.on('finish', (_fd) => {
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
        return Promise.race([streamPromise, timeoutPromise]).then(() => {
            this.outputStream = undefined;
        });
    }
}
exports.Writer = Writer;
