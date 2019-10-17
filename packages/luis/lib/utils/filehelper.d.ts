export declare function getLuObjects(stdin: string, input: string | undefined, recurse: boolean | undefined, extType: string | undefined): Promise<any>;
export declare function getContentFromFile(file: string): Promise<unknown>;
export declare function generateNewFilePath(outFileName: string, inputfile: string, isLu: boolean, prefix?: string): Promise<string>;
export declare function generateNewTranslatedFilePath(fileName: string, translatedLanguage: string, output: string): Promise<string>;
export declare function validatePath(outputPath: string, defaultFileName: string, forceWrite?: boolean): string;
export declare function detectLuContent(stdin: string, input: string): Promise<boolean>;
