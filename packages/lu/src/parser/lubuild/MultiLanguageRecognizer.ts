export class MultiLanguageRecognizer {
    public recognizers: any;
    private dialogPath: string;

    constructor(dialogPath: string) {
        this.dialogPath = dialogPath;
        this.recognizers = {};
    }

    save(): string {
        let output = {
            "$type": "Microsoft.MultiLanguageRecognizer",
            "recognizers": this.recognizers
        };

        return JSON.stringify(output);
    }

    getDialogPath(): string {
        return this.dialogPath;
    }
}