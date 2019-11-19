# Lubuild -> bf luis:make

Lubuild is a preview CLI tool available in [botbuilder-tools repository][1]. As part of the migration of botbuilder-tools to BF-CLI, the **core** functionality of the existing lubuild tool will be brought forward to BF-CLI as

- [P0] library that can be used by bot framework composer and/ or other tools that need such capability
- [P0] exposed as a CLI command under the `luis:` command group as part of BF-CLI.

## Functional requirements
1. Given an .lu files that describes one luis application and a [luis-configuration](#LUIS-configuration),
    - (a) Find a matching LUIS application. 
    - (b) If found uploads new model definition (as defined in .lu file) as new version.
    - (c) Else Create a new LUIS application with the model definition (as defined in .lu file. This is the functional equivalent of `import application` command.
    - (d) Train and publish the new application.
2. Given a collection of .lu files that describe one luis application across one or more supported [luis locales][2] and a [luis-configuration](#LUIS-configuration),
    - For each locale, do 1.a - 1.d
3. LUIS supports up to 5 concurrent authoring API calls and up to 5 calls per second to the service per authoring key. The library should leverage this capability as a performance optimization and parallelize calls up to 5 applications (each .lu content is an application). Note that for each .lu content, we might need to do either create/ import followed by train and then publish. We cannot parallelize calls within that workflow but can parallelize across applications.
    - Failures on any calls to LUIS should automatically initiate a wait-retry loop for up to 5 times. Repeat failures should be reported back with the actual error message from the service and the corresponding LU content (file name/ content itself).
4. To determine if an application exists, we should use the following order of precedence. This is applicable for #1.a-c above to determine if an application exists already or we should create a new application - 
    - (a) If the .lu file has a @app.name property, we should use that as the app name to find. **.OR.**
    - (b) Find an application with the following naming convention - \<BotName>(\<environment>)-\<luFileNameOrId>.\<locale>.lu
5. To determine if a new version needs to be created, we will
    - (a) Get the latest published application version (to either PRODCUTION or STAGING) via call to [Get application info][3]
    - (b) export the version via call to [Export application version][4]
    - (c) [Transform][5] and perform a diff against the current LU JSON .vs. what's in latest version. Create a new version if the content is different or no content exists.
6. If [luis-configuration](#LUIS-configuration) requests .dialog files be generated, then generate .dialog files with the newly created/ updated LUIS application information. See [dialog-files](#dialog-files) to learn more about the logic for creating .dialog and related files. 

## Locale naming conventions
When the CLI route is attempting to infer the locale from the file name, we should expect the file names to be in this convention - 
\<fileName>.\<locale>.lu

\<locale> must be one of the supported [luis locales][2].

## Version naming conventions
- When creating a new application, version the application as `0.1`
- When creating a new version, use the following order of precedence - 
    - use @app.versionId if present in the LU content.
    - increment the application minor version by 1. So versions would be named as 0.1, 0.2, 0.3, 0.4, ...
    - If the prior version is not a number, then add -0.1, -0.2, -0.3 ... as a **suffix**. E.g. Initial version - `myversion` -> `myversion-0.1` -> `myversion-0.2` -> ...

## LUIS configuration
1. Location of the .lu file (absolute or relative path or file content via stdin for CLI)
2. LUIS authoring key to use
3. Bot name (text property that can be set to e.g. `WeatherBot`, `HRBot` etc). 
4. [Optional] Default language - identifies .lu file's base language when a lang code is not explicitly included.
4. [Optional] LUIS authoring region to use. Defaults to `westus`
5. [Optional] environment name (text property that can be set to e.g. `dev`, `staging`, `production`). Defaults to `development`
6. [Optional] Output folder name to write out .dialog files generated. Defaults to `cwd()`
7. [Optional] --dialog field to request that .dilog files be written out. Defaults to `false`

## CLI Command

`bf luis:make`

| Parameters        | Description                                                                                                             |
|-------------------|-------------------------------------------------------------------------------------------------------------------------|
| --in              | lu file or folder                                                                                                       |
| --force           | force write                                                                                                             |
| --authoringkey    | LUIS authoring key                                                                                                      |
| --botname         | bot name                                                                                                                |
| --out             | [Optional] output location                                                                                              |
| --culture         | [Optional] culture code for the content. Infer from .lu if available. Defaults to `en-us`                               |
| --authoringregion | [Optional] LUIS authoring region                                                                                        |
| --environmentname | [Optional] nvironment name to include in LUIS app name                                                                  |
| --dialog          | [Optional] write out .dialog files                                                                                      |
| --fallbacklocale  | [Optional] locale to be used at the fall back if no locale specific recognizer is found. Only valid if --dialog is set. |


## Writing out .dialog files
All up:luis.settings.<environmentname>.<region>.json
```json
{
    "luis": {
        "<lufilename>_<locale>_lu": "<LUIS app id>"
    }
}
```
For each LU file: 
<lufilename>_<locale>.dialog
```json
{
    "$type": "Microsoft.LuisRecognizer",
    "applicationId": "{settings.luis.Main_en-us_lu}",
    "endpoint": "{settings.luis.endpoint}",
    "endpointKey": "{settings.luis.endpointKey}"
}
```

<lufilename>.lu.dialog
```json
{
    "$type": "Microsoft.MultiLanguageRecognizer",
    "recognizers": {
        "<locale>": "<lufilename>.<locale>.lu",
        "": "<lufilename>.<fallbacklocale>.lu"
    }
}
```

## Interfaces

```ts
export class LuBuild {
    public luConfig:LUISConfig;

    public static async CreateOrUpdateApplication(luConfig:LUISConfig, delegate:(ID:string) : Content) : Promise<List<LUISApps>> {
        return new Array<LuBuildResult>();
    }

    public async GenerateDeclarativeAssets(LuisAppList:List<LUISApps>):Promise<DialogFileContent>;
};

export class DialogFileContent {
    public LuisSettingsContent:string;
    public PerLUFileContent:Array<Content>;
}

export class LUISApps {
    public srcID:string;
    public LuisAppId:string;
    public LuisVersionId:string;
    public LuisLocale:string;
}

export class Content {
    public id:string; 
    public content:string;
    public locale:string;
    public name:string; // defaults to "<id>.<locale>.lu"
};

export class LUISConfig {
    public AuthoringKey:string;
    public BotName:string;
    public Culture:string = 'en-us';
    public AuthoringRegion:string = 'westus';
    public EnvironmentName:string = 'dev';
    public GenerateDialogFileContent:boolean = false;
    public FallBackLocale:string = 'en-us';
    public IDs:List<string>;
    public Content:List<Content>;
};
```

[1]:https://github.com/microsoft/botbuilder-tools/tree/V.Future/packages/lubuild
[2]:https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-language-support#languages-supported
[3]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c37
[4]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c40
[5]:https://github.com/microsoft/botframework-cli/blob/787b11503cfaaaf40e254b7030db242cc1269729/packages/lu/src/parser/lufile/helpers.js#L156