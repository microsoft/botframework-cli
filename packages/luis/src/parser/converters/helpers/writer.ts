import {createWriteStream, WriteStream} from 'fs'
import {Writable} from 'stream'

export class Writer {
  public indentSize = 4
  public indentLevel = 0
  private outputStream?: Writable = undefined

  public async setOutputStream(outputPath: string): Promise<void> {
    const ConsoleStream = require('console-stream')
    const stream: Writable = outputPath ? createWriteStream(outputPath) : ConsoleStream()
    return new Promise((resolve: any) => {
      if (stream instanceof WriteStream) {
        stream.once('ready', (_fd: number) => {
          this.outputStream = stream
          resolve()
        })
      } else {
        this.outputStream = stream
        resolve()
      }
    })
  }

  public increaseIndentation(): void {
    this.indentLevel += this.indentSize
  }

  public decreaseIndentation(): void {
    this.indentLevel -= this.indentSize
  }

  public write(str: string): void {
    this.outputStream!.write(str)
  }

  public writeLine(str: string | string[] = ''): void {
    if (typeof str === 'string') {
      this.outputStream!.write(str + '\n')
    } else {
      str.forEach(line => {
        this.outputStream!.write(line + '\n')
      })
    }
  }

  public writeIndented(str: string | string[]): void {
    let writeFunction = (text: string) => {
      for (let index = 0; index < this.indentLevel; index++) {
        this.outputStream!.write(' ')
      }
      this.outputStream!.write(text)
    }

    writeFunction.bind(this)

    if (typeof str === 'string') {
      writeFunction(str)
    } else {
      str.forEach(line => {
        writeFunction(line)
      })
    }
  }

  public writeLineIndented(lines: string | string[]): void {
    if (typeof lines === 'string') {
      this.writeIndented(lines + '\n')
    } else {
      lines.forEach(line => {
        this.writeIndented(line + '\n')
      })
    }
  }

  public async closeOutputStream(): Promise<void> {
    this.outputStream!.end()
    return new Promise((resolve: any) => {
      if (this.outputStream instanceof WriteStream) {
        this.outputStream!.on('finish', (_fd: number) => {
          resolve()
        })
      } else {
        resolve()
      }
    })
  }
}
