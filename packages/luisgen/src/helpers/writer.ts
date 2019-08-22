import { WriteStream, createWriteStream } from "fs";

export class Writer {
  public indentSize: number = 4;
  public indentLevel: number = 0;
  private outputStream?: WriteStream = undefined;

  public async setOutputStream(outputPath: string): Promise<void> {
    return new Promise(() => {
      const stream = createWriteStream(outputPath);
      stream.once("ready", (_fd: number) => {
        this.outputStream = stream;
      });
    });
  }

  public increaseIndentation(): void {
    this.indentLevel += this.indentSize;
  }

  public decreaseIndentation(): void {
    this.indentLevel -= this.indentSize;
  }

  public write(str: string): void {
    try {
      this.outputStream!.write(str);
    } catch (err) {
      console.error(err);
    }
  }

  public writeLine(str: string = ""): void {
    try {
      this.outputStream!.write(str + "\n");
    } catch (err) {
      console.error(err);
    }
  }

  public writeIndented(str: string): void {
    try {
      for (let index = 0; index < this.indentLevel; index++) {
        this.outputStream!.write(" ");
      }
      this.outputStream!.write(str);
    } catch (err) {
      console.error(err);
    }
  }

  public writeLineIndented(str: string): void {
    try {
      this.writeIndented(str + "\n");
    } catch (err) {
      console.error(err);
    }
  }

  public async closeOutputStream(): Promise<void> {
    return new Promise(() => {
      try {
        this.outputStream!.close();
      } catch (err) {
        console.error(err);
      }
    });
  }
}
