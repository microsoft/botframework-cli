# qnamaker:build

Lubuild is a preview CLI tool available in [botbuilder-tools repository][1]. 

This specification outlines requirements to do something similar to this related [luis:build specification][30] but for QnAMaker.

- [P0] library that can be used by bot framework composer and/ or other tools that need such capability
- [P0] exposed as a CLI command under the `qnamaker:` command group as part of BF-CLI.

## Functional requirements
1. Given one or more .qna files that describes one QnA Maker KB and a [qnamaker-configuration](#QnAMaker-configuration),
    - (a) Find a matching QnA Maker KB. 
    - (b) If found, replaces current new KB definition with new KB content (as defined in .qna file).
    - (c) Else Create a new QnA Maker KB with the definition (as defined in .qna file)
    - (d) Train and publish the new KB.
2. Given a collection of .qna files that describe one KB across one or more supported [QnA Maker locales][2] and a [qnamaker-configuration](#QnAMaker-configuration),
    - For each locale, do 1.a - 1.d
3. To determine if an KB exists, we should use the following order of precedence. This is applicable for #1.a-c above to determine if a KB exists already or we should create a new KB - 
    - (a) If the .qna file has a @kb.name property, we should use that as the KB name to find. **.OR.**
    - (b) Find an application with the following naming convention - \<BotName>(\<environment>)-\<qnaFileNameOrId>.\<locale>.qna
4. To determine if a new version needs to be created, we will
    - (a) Finds the KB information using the subscription key provided via call to []
    - (b) Get the latest published KB version (to either TEST or PROD) via call to [Export KB][3]
    - (c) [Transform][5] and perform a diff against the current QNA JSON .vs. what's in latest version. Create a new version if the content is different or no content exists.
5. If [qnamaker-configuration](#QnAMaker-configuration) requests .dialog files be generated, then generate .dialog files with the newly created/ updated QnA Maker KB information. See [dialog-files](#dialog-files) to learn more about the logic for creating .dialog and related files. 

## Locale naming conventions
When the CLI route is attempting to infer the locale from the file name, we should expect the file names to be in this convention - 
\<fileName>.\<locale>.qna

\<locale> must be one of the supported [qnamaker locales][2].

## QnAMaker configuration
1. Location of the .qna file (absolute or relative path or file content via stdin for CLI)
2. QnA Maker subscription key to use
3. QnA Maker host endpoint to use
4. Bot name (text property that can be set to e.g. `WeatherBot`, `HRBot` etc). 
5. [Optional] Default language - identifies .qna file's base language when a lang code is not explicitly included.
6. [Optional] environment name (text property that can be set to e.g. `dev`, `staging`, `production`). Defaults to `development`
7. [Optional] Output folder name to write out .dialog files generated. Defaults to `cwd()`
8. [Optional] --dialog field to request that .dilog files be written out. Defaults to `false`

## CLI Command

`bf qnamaker:build`

| Parameters        | Description                                                                                                             |
|-------------------|-------------------------------------------------------------------------------------------------------------------------|
| --in              | lu file or folder                                                                                                       |
| --force           | [optional] force write                                                                                                  |
| --subscriptionkey | QnAMaker subscription key                                                                                               |
| --hostname        | QnA Maker host name                                                                                                     |
| --botname         | bot name                                                                                                                |
| --out             | [Optional] output location                                                                                              |
| --culture         | [Optional] culture code for the content. Infer from .qna if available. Defaults to `en-us`                              |
| --suffix          | [Optional] environment name as a suffix identifier to include in LUIS app name                                          |
| --dialog          | [Optional] write out .dialog files                                                                                      |
| --fallbacklocale  | [Optional] locale to be used at the fall back if no locale specific recognizer is found. Only valid if --dialog is set. |


<a id="dialog-files"></a>

## Writing out .dialog files
All up:qnamaker.settings.\<environmentname>.\<region>.json
```json
{
    "qnamaker": {
        "<qnafilename>_<locale>_qna": "<QnA KB id>"
    }
}
```
For each QnA file: 
\<QNAfilename>_\<locale>.dialog
```json
{
    "$type": "Microsoft.QnAMakerRecognizer",
    "KnowledgeBaseId": "{settings.qna.<dialogName>_<localeName>_qna}",
    "endpoint": "{settings.qna.hostname}",
    "endpointKey": "{settings.qna.endpointKey}"
}
```

\<qnafilename>.qna.dialog
```json
{
    "$type": "Microsoft.MultiLanguageRecognizer",
    "recognizers": {
        "<locale>": "<qnafilename>.<locale>.lu",
        "": "<qnafilename>.<fallbacklocale>.lu"
    }
}
```

[1]:https://github.com/microsoft/botbuilder-tools/tree/V.Future/packages/lubuild
[2]:https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/overview/language-support#languages-supported
[3]:https://docs.microsoft.com/en-us/rest/api/cognitiveservices/qnamaker/knowledgebase/download
[4]:https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c40
[5]:https://github.com/microsoft/botframework-cli/blob/787b11503cfaaaf40e254b7030db242cc1269729/packages/lu/src/parser/lufile/helpers.js#L156
[30]:https://github.com/microsoft/botframework-cli/blob/master/specs/LUIS-MAKE.md