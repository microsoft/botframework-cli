import {createWriteStream, WriteStream} from 'fs'

export class Writer {
  public indentSize = 4
  public indentLevel = 0
  private outputStream?: WriteStream = undefined

  public async setOutputStream(outputPath: string): Promise<void> {
    return new Promise(() => {
      const stream = createWriteStream(outputPath)
      stream.once('ready', (_fd: number) => {
        this.outputStream = stream
      })
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

  public writeLine(str = ''): void {
    this.outputStream!.write(str + '\n')
  }

  public writeIndented(str: string): void {
    for (let index = 0; index < this.indentLevel; index++) {
      this.outputStream!.write(' ')
    }
    this.outputStream!.write(str)
  }

  public writeLineIndented(str: string): void {
    this.writeIndented(str + '\n')
  }

  public async closeOutputStream(): Promise<void> {
    return new Promise(() => {
      this.outputStream!.close()
    })
  }
}
