export class DialogFileContent {
    public Contents: Array<Content>;

    constructor(contents: Array<Content>) {
        this.Contents = contents;
    }
}

export class Content {
    public ID: string;
    public Path: string;
    public Content: string;
    public Locale: string | undefined;
    public Name: string; // defaults to "<id>.<locale>.lu" for lu files

    constructor(id: string, path: string, content: string, locale?: string, name?: string) {
        this.ID = id;
        this.Path = path;
        this.Content = content;
        this.Locale = locale;
        if (name && name !== '') {
            this.Name = name
        } else {
            if (this.Locale) {
                if (this.Locale !== '') {
                    this.Name = id + '.' + this.Locale + '.lu';
                } else {
                    this.Name = id + '.lu';
                }
            } else {
                this.Name = this.ID;
            }
        }
    }
};

export class LUISConfig {
    public AuthoringKey: string;
    public BotName: string;
    public Culture: string = 'en-us';
    public Region: string = 'westus';
    public Endpoint: string = 'https://westus.api.cognitive.microsoft.com';
    public Suffix: string = 'development';
    public LuisSchemaVersion: string = '4.0.0';
    public GenerateDialogFileContent: boolean = false;
    public FallBackLocale: string = 'en-us';
    public LuContents: Array<Content>;
    public MultiLangRecognizerContent: Content;
    public LuisSettingsContent: Content;

    constructor(
        authoringKey: string,
        botName: string,
        culture: string,
        region: string,
        endpoint: string,
        suffix: string,
        luisSchemeVersion: string,
        generateDialogFileContent: boolean,
        fallBackLocale: string,
        luContents: Array<Content>,
        multiLangRecognizerContent: Content,
        luisSettingsContent: Content) {
        this.AuthoringKey = authoringKey,
            this.BotName = botName,
            this.Culture = culture,
            this.Region = region,
            this.Endpoint = endpoint,
            this.Suffix = suffix,
            this.LuisSchemaVersion = luisSchemeVersion,
            this.GenerateDialogFileContent = generateDialogFileContent,
            this.FallBackLocale = fallBackLocale,
            this.LuContents = luContents,
            this.MultiLangRecognizerContent = multiLangRecognizerContent,
            this.LuisSettingsContent = luisSettingsContent
    }
};