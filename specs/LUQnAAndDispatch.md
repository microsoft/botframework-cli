# [SPEC] Ludown, LuisGen, Dispatch in BF

## Summary
This specification details how language understanding and QnA concepts will be brought forward into BF CLI.

## Tools being consolidated
The following botbuilder-tools CLI that perform local file transformations will be brought forward under one converged LU command group in BF CLI.
- [ludown][1]
- [luisgen][2]

[Dispatch][3] CLI has two modes of operation 
1. Ability to work directly with LUIS and QnA maker models deployed in the cloud
2. Ability to work with local LUIS and QnA model definition files. 

\#2 above in particular will be brought fowrard under the converged LU command group in BF CLI.

## Command group mappings

| Current CLI | Command      | Functionality                                            | BF command group                    | 
|-------------|--------------|----------------------------------------------------------|-------------------------------------|
| Ludown      | parse toluis | Convert .lu file(s) to LUIS JSON model                   | BF LUIS transform                   |
|             | parse toqna  | Convert .lu file(s) to QnA JSON model                    | BF QnA transform                    |
|             | translate    | Machine translate .lu file(s)                            | BF [LUIS\|QnA] translate           |
|             | refresh      | Convert LUIS or QnA JSON model to .lu file               | BF [LUIS\|QnA] transform           |
| LuisGen     | N/A          | Convert LUIS JSON model to a strong typed C# or TS class | BF LUIS transform                   |
| Dispatch    | Init         | Initialize .dispatchrc file                              | BF Dispatch Init                    |
|             | Add          | Add input sources. LUIS or QnA Maker models, files       | BF Dispatch Add                     |
|             | Remove       | Removes one or more dispatch source                      | BF Dispatch Remove                  |
|             | Create       | Creates a dispatch LUIS application                      | BF Dispatch Create                  |
|             | Eval         | Cross validation evaluate and summary results            | BF Dispatch Eval                    |
|             | Test         | Test dispatch model against a test set                   | BF Dispatch Test                    |
|             | Predict      | Run predictions against dispatch model                   | BF Dispatch Predict                 |
|             | List         | Prints current dispatch configuration                    | BF Dispatch List                    |
|             | Refresh      | Train and publish dispatch model after modification      | BF Dispatch Refresh                 |

## Requirements
Provide ability for bot developers to
- Use a text file based representation of their bot's LU and QnA assets
- Transform .lu file to LUIS application JSON model
- Transform .lu (or .qna) file to QnA KB JSON model
- Machine translate .lu or .qna file(s) to one or more target languages
- Transform LUIS application JSON model to .lu file
- Transform QnA KB JSON model to .qna file
- Transform LUIS application (JSON model or .lu file) to
    - Strong typed C# class
    - Strong typed TS class
- Create/ update one or more dispatch applications based on .lu and .qna files. Outputs a dispatch model file (as .lu?)
    - Add/ remove source .lu or .qna files that will source the dispatch application. 
- Test, Evaluate and predict a dispatch application given a dispatch application as .lu file

## Design Specifications
This section outlines the available arguments for each BF command group. 

### BF LUIS command group
This command group includes transformation, translation abilities currently offered by Ludown and LuisGen CLIs. 

This command group includes the following sub-commands:

- Transform: Covers transformation from one file type to another.
- Translate: Machine translation of .lu or .json files to one or more target languages.

***Note:*** Additional sub-commands as offered by the LUIS CLI for LUIS application level data/ control plane management can be made available as additional sub-commands under the LUIS command group. 

#### BF LUIS Transform command group
This command group has the following sub-commands: 
- toModel: Transformation from one or more source .lu file(s) to a LUIS application JSON model.
- toLU: Transformation from a given LUIS application JSON model to a .lu file.
- toCS: Transformation from a given LUIS application JSON model .OR. source .lu file(s) to a strongly typed csharp class file.
- toTS: Transformation from a given LUIS application JSON model .OR. source .lu file(s) to a strongly typed Typescript class file. 

Here are the parameter options per sub-command group

| Sub-command | Argument                | Description                                                         | 
|-------------|-------------------------|---------------------------------------------------------------------|
| **toModel** | --in \<file\>           | Source .lu file                                                     |
|             | --folder \<folder\>     | Source folder that contains .lu file(s)                             |
|             | --subFolder             | Indicates if sub-folders need to be considered to file .lu file(s)  |
|             | --out \<file\>          | Output file name                                                    |
|             | --outFolder \<folder\>  | Output folder name                                                  |
|             | --name \<ModelName\>    | Name of the LUIS application                                        |
|             | --description \<desc\>  | Text describing the LUIS applicaion                                 |
|             | --culture \<langCode\>  | Lang code for the LUIS application                                  |
|             | --versionId \<version\> | Version ID of the LUIS application                                  | 
| **toLU**    | --in \<file\>           | Source LUIS application JSON file                                   |
|             | --out \<file\>          | Output file name                                                    |
|             | --outFolder \<folder\>  | Output folder name                                                  |
| **toCS**    | --in \<file\>           | Source LUIS application JSON file .OR. source .lu file              |
|             | --folder \<folder\>     | Source folder that contains .lu file(s)                             |
|             | --subFolder             | Indicates if sub-folders need to be considered to file .lu file(s)  |
|             | --out \<file\>          | Output file name                                                    |
|             | --outFolder \<folder\>  | Output folder name                                                  |
| **toTS**    | --in \<file\>           | Source LUIS application JSON file .OR. source .lu file              |
|             | --folder \<folder\>     | Source folder that contains .lu file(s)                             |
|             | --subFolder             | Indicates if sub-folders need to be considered to file .lu file(s)  |
|             | --out \<file\>          | Output file name                                                    |
|             | --outFolder \<folder\>  | Output folder name                                                  |

Examples: 
```bash
> bf LUIS transform toModel --in root.lu --out root.luis.json

> bf LUIS transform toLu --in root.luis.json --out root.lu

> bf LUIS transfrom toCS --in root.luis.json --out root.cs

> bf LUIS transform toTS --in root.luis.json --out root.ts
```

#### BF LUIS Translate command group
This command group has the following sub-commands: 
- toModel: Translate given input and write out LUIS application JSON model file(s)
- toLU: Translate given input and write out .lu file(s)

| Sub-command | Argument                | Description                                                         | 
|-------------|-------------------------|---------------------------------------------------------------------|
| **toModel** | --in \<file\>           | Source LUIS application JSON file .OR. source .lu file              |
| **toLU**    | --folder \<folder\>     | Source folder that contains .lu file(s)                             |
|             | --subFolder             | Indicates if sub-folders need to be considered to file .lu file(s)  |
|             | --outFolder \<folder\>  | Output folder name                                                  |
|             | --srcLang \<lang\>      | Source lang code. Auto detect if missing.                           |
|             | --tgtLang \<lang\>      | Comma separated list of target languages.                           |
|             | --key \<translateKey\>  | Machine translation endpoint key.                                   |
|             | --translate_comments    | When set, machine translate comments found in .lu or .qna file      |
|             | --translate_link_text   | When set, machine translate link description  in .lu or .qna file   |

Examples: 
```bash
> bf LUIS translate toLU --in root.lu --target fr, de, es

> bf LUIS translate toModel --in root.luis.json --target fr, de, es
```

### BF QnA command group
This command group includes transformation, translation abilities currently offered by Ludown from and to a QnA maker KB. 

This command group includes the following sub-commands:

- Transform: Covers transformation from one file type to another.
- Translate: Machine translation of .lu or .json files to one or more target languages.

***Note:*** Additional sub-commands as offered by the QnAMaker CLI for QnA KB level data/ control plane management can be made available as additional sub-commands under the QnA command group. 


#### BF QnA Transform command group
This command group has the following sub-commands: 
- toModel: Transformation from one or more source .qna file(s) to a QnA KB JSON model.
- toLU: Transformation from a given QnA KB JSON model to a .qna file.

| Sub-command | Argument                | Description                                                         | 
|-------------|-------------------------|---------------------------------------------------------------------|
| **toModel** | --in \<file\>           | Source .qna file                                                    |
|             | --folder \<folder\>     | Source folder that contains .qna file(s)                            |
|             | --subFolder             | Indicates if sub-folders need to be considered to file .qna file(s) |
|             | --out \<file\>          | Output file name                                                    |
|             | --outFolder \<folder\>  | Output folder name                                                  |
|             | --name \<ModelName\>    | Name of the QnA KB                                                  |
| **toLU**    | --in \<file\>           | Source QnA KB JSON file                                             |
|             | --out \<file\>          | Output file name                                                    |
|             | --outFolder \<folder\>  | Output folder name                                                  |

Examples: 
```bash
> bf QnA transform toModel --in root.qna --out root.qna.json

> bf QnA transform toQnA --in root.qna.json --out root.qna
```

#### BF QnA Translate command group
This command group has the following sub-commands: 
- toModel: Translate given input and write out QnA KB JSON model file(s)
- toLU: Translate given input and write out .qna file(s)

| Sub-command | Argument                | Description                                                         | 
|-------------|-------------------------|---------------------------------------------------------------------|
| **toModel** | --in \<file\>           | Source QnA KB  JSON file .OR. source .qna file                      |
| **toLU**    | --folder \<folder\>     | Source folder that contains .qna file(s)                            |
|             | --subFolder             | Indicates if sub-folders need to be considered to file .qna file(s) |
|             | --outFolder \<folder\>  | Output folder name                                                  |
|             | --srcLang \<lang\>      | Source lang code. Auto detect if missing.                           |
|             | --tgtLang \<lang\>      | Comma separated list of target languages.                           |
|             | --key \<translateKey\>  | Machine translation endpoint key.                                   |
|             | --translate_comments    | When set, machine translate comments found in .lu or .qna file      |
|             | --translate_link_text   | When set, machine translate link description  in .lu or .qna file   |


```bash
> bf QnA translate toQnA --in root.qna --target fr, de, es

> bf QnA translate toModel --in root.qna --target fr, de, es
```

### BF Dispatch command group
This command group includes all sub-commands currently offered by the dispatch CLI with the following additions - 

1. Add/ remove command should support .lu and .qna files
2. Create and Update commands can be configured to write out the dispatch model as a .lu or .json file on disk instead of round tripping to service.


[1]:https://github.com/microsoft/botbuilder-tools/tree/master/packages/Ludown
[2]:https://github.com/microsoft/botbuilder-tools/tree/master/packages/LUISGen
[3]:https://github.com/microsoft/botbuilder-tools/tree/master/packages/Dispatch
