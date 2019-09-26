import {createWriteStream, WriteStream} from 'fs'
import {Writable} from 'stream'

export class Writer {
  public indentSize = 4
  public indentLevel = 0
  private outputStream?: Writable = undefined

  public async setOutputStream(outputPath: string): Promise<void> {
    const ConsoleStream = require('console-stream')
    const stream: Writable = outputPath ? createWriteStream(outputPath) : ConsoleStream()
    const streamPromise = new Promise((resolve: any) => {
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

    const timeoutPromise = new Promise((resolve: (...args: any) => void) => {
      setTimeout(resolve, 2000)
      this.outputStream = stream
    })

    return Promise.race([streamPromise, timeoutPromise]).then(() => {
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
      this.write(str + '\n')
    } else {
      str.forEach(line => {
        this.write(line + '\n')
      })
    }
  }

  public writeIndented(str: string | string[]): void {
    let writeFunction = (text: string) => {
      for (let index = 0; index < this.indentLevel; index++) {
        this.write(' ')
      }
      this.write(text)
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
    const streamPromise = new Promise((resolve: any) => {
      if (this.outputStream instanceof WriteStream) {
        this.outputStream!.on('finish', (_fd: number) => {
          resolve()
        })
      } else {
        resolve()
      }
    })

    const timeoutPromise = new Promise((resolve: (...args: any) => void) => {
      setTimeout(resolve, 1000)
    })

    return Promise.race([streamPromise, timeoutPromise]).then(() => {
    })
  }
}
