export class LuisSettings  {
    public luis: any;
    private settingsPath: string;

    constructor(settingsPath: string, luis: any) {
        this.settingsPath = settingsPath;
        this.luis = luis;
    }

    save(): string {
        let output = {
            "luis": this.luis
        };

        return JSON.stringify(output);
    }

    getSettingsPath(): string {
        return this.settingsPath;
    }
}
