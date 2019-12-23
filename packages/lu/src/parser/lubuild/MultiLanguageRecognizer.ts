export class MultiLanguageRecognizer {
    public recognizers: any
    private dialogPath: string

    constructor(dialogPath: string, recognizers: any) {
        this.dialogPath = dialogPath
        this.recognizers = recognizers
    }

    save(): string {
        let output = {
            "$type": "Microsoft.MultiLanguageRecognizer",
            "recognizers": this.recognizers
        }

        return JSON.stringify(output, null, 4)
    }

    getDialogPath(): string {
        return this.dialogPath
    }
}