export class LuisRecognizer {
    private appId: string;
    private dialogPath: string | undefined;

    constructor(private luFile: string, targetFileName: string) {
        this.appId = '';
        this.applicationId = `{settings.luis.${targetFileName.split('.').join('_')}}`;
        this.endpoint = `{settings.luis.endpoint}`;
        this.endpointKey = "{settings.luis.endpointKey}";
        this.versionId = '0.1';
    }

    static load(luFile: string, targetFileName: string, dialogPath: string): LuisRecognizer {
        var recognizer = new LuisRecognizer(luFile, targetFileName);
        recognizer.dialogPath = dialogPath;
        return recognizer;
    }

    save(): string {
        let output = {
            "$type": 'Microsoft.LuisRecognizer',
            applicationId: this.applicationId,
            endpoint: this.endpoint,
            endpointKey: this.endpointKey
        };

        return JSON.stringify(output, null, 4);
    }

    getAppId(): string {
        return this.appId;
    }

    setAppId(appId: string) {
        this.appId = appId;
    }

    getDialogPath(): string {
        return <string>this.dialogPath;
    }

    getLuPath() {
        return this.luFile;
    }

    versionId: string;
    readonly applicationId: string | undefined;
    readonly endpoint: string | undefined;
    readonly endpointKey: string | undefined;
}