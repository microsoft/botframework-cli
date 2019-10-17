export declare class Writer {
    indentSize: number;
    indentLevel: number;
    private outputStream?;
    setOutputStream(outputPath: string): Promise<void>;
    increaseIndentation(): void;
    decreaseIndentation(): void;
    write(str: string): void;
    writeLine(str?: string | string[]): void;
    writeIndented(str: string | string[]): void;
    writeLineIndented(lines: string | string[]): void;
    closeOutputStream(): Promise<void>;
}
