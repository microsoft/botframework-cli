export class LuisSettings  {
    public luis: any;
    private settingsPath: string;

    constructor(settingsPath: string) {
        this.settingsPath = settingsPath;
        this.luis = {};
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
