# Dispatch to BF-CLI

Current [Dispatch][1] CLI serves 3 main use cases - 

1. Dispatch application creation (as a LUIS application) given one or more [QnA Maker KB][2], one or more [LUIS apps][3], one or more files (in .tsv format)
2. Updates to dispatch application as the source (LUIS/ QnA maker KB/ files) change
3. Dispatch application evaluation and reporting

This specification outlines the plan for bringing forward the core dispatch capabilities into a library for consumption by BF-CLI as well as other tools like Composer.

## Goals
Bring forward the following functionality exposed by the current dispatch CLI into BF-CLI. 
- Create authoring data for a LUIS Dispatch application, given QnA maker KB, LUIS application information in .lu or .qna file format
- Sampling functionality to reduce the foot print of training data while preserving model performance. This is especially important/ useful in pruning authoring data to meet limits set by LUIS but also can help with model imbalance issues.
- Evaluation and reporting functionality using a local LR model.
- Migrate functionality that does not belong in dispatch into the other relevant/ right libraries in BF-CLI. See [here](migrated-to-bf-lu-library) to learn more.

## Migrated to bf-lu library
The following functionality will be migrated to BF-LU library.

| Existing dispatch functionality                                                             | Migrated to | Reason                                                                                                                                                                            |
|---------------------------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TSV support                                                                                 | BF-LU       | We should support a core set of import/ export formats and should not do something specific to dispatch                                                                           |
| Validations for intent, utterances, patterns, entities, phrase list limits set by LUIS      | BF-LU       | These validations will generally benefit anyone using the .lu format and not relevant only for dispatch                                                                           |
| Add support to pull answers from .qna file via reference                                    | BF-LU       | .lu file format already supports pulling in questions via file reference import and this will be a natural addition                                                               |
| Add support to pull in alterations from .qna file via reference                             | BF-LU       | same as above                                                                                                                                                                     |
| Add support to pull in all utterances across all intents from a .lu file via file reference | BF-LU       | same as above                                                                                                                                                                     |
| Support round tripping LUIS settings via the .lu file format                                | BF-LU       | today, we do not support configuring the settings property via the .lu format but will be a natural extension to how application specific meta-data is captured in the .lu format |


## BF command groups and flags

To support dispatch functionality, we will introduce a new command group in BF cli. 

```bash
> bf dispatch
```

This command group will have identical capabilities as offered by the current dispatch CLI but will be updated to fit to the guidelines set by BF-CLI.

Note: Most of these command groups are individual APIs that could be composed by the user into a work flow that they see fit. 

### Initializing dispatch

To initialize dispatch:

```bash
bf dispatch:config:create
```

Creates {name}.dispatch file.

**NOTE**: Any dispatch command group will always look for and use the .dispatch file specified and its configuration. If no configuration specified or if no default value is possible for that configuration, the command will fail and ask the user to use bf dispatch:config command to provide the configuration.

| Option                                     | Description                                                                                                                                                                                                        |
|--------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| --interactive                              | (optional) Defaults to false. When set, will prompt for each configuration information interactively.                                                                                                              |
| --name                                     | Name of the dispatch application                                                                                                                                                                                   |
| --luisauthoringkey                         | (optional) LUIS authoring key                                                                                                                                                                                      |
| --luisauthoringregion                      | (optional) LUIS authoring region                                                                                                                                                                                   |
| --luisSubscriptionKey                      | (optional, will be prompted) Cognitive Service LUIS key from portal.azure.com                                                                                                                                      |
| --luisSubscriptionRegion                   | (optional, will be prompted) Cognitive Service LUIS region from portal.azure.com                                                                                                                                   |
| --culture                                  | (optional) Used to set LUIS app culture for dispatch. Required if none of dispatch source(s) is LUIS app.                                                                                                          |
| --hierarchical                             | (optional) Default to true.  If false, existing intents from source LUIS model(s) will be available as the dispatch intents.                                                                                       |
| --datafolder                               | (optional) Dispatch working directory                                                                                                                                                                              |
| --force                                    | (optional) force write .dispatch file                                                                                                                                                                              |
| --out                                      | (optional) output folder name. PWD() if not specified                                                                                                                                                              |
| --help                                     | Output usage information                                                                                                                                                                                           |
| --usealltrainingdata                       | (optional) Default to false. LUIS UseAllTrainingData flag (see https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/versions-update-application-version-settings)          |
| --dontreviseutterance                      | (optional) Default to false. Dispatch sometimes makes minor updates to an utterance for generalization. If false, utterances won't be revised                                                                      |
| --publishtostaging                         | (optional) Default to false. Publish to LUIS staging instead of production platform                                                                                                                                |
| --dedupetrainingset                        | (optional) Default to false. If false, Dispatch won't de-dupe duplicated training instances                                                                                                                        |
| --gov                                      | (optional) Set to true to target Azure government                                                                                                                                                                  |
| --remote                                   | (optional) Set to true if invoking tool remotely                                                                                                                                                                   |
| --dontimport                               | (optional) Default to false. If set to true, do not communicate with luis.ai for importing, training, and publishing the Dispatch LUIS app                                                                         |
| --doautoactivelearning                     | (optional) Default to false. LUIS limit on training-set size is 15000. When a LUIS app has much more utterances for training, Dispatch's auto active learning process can intelligently down sample the utterances |
| --aalnumberofinstancesperiteration         | (optional) Default to 2500. Max #instances processed during each auto-active-learning down-sampling iteration                                                                                                      |
| --aalMaxNumberOfActiveLearningIterations   | (optional) Default to -1. Max number of auto active learning iterations, each processes a fixed batch of instances. Negative setting enables scanning through all available instances.                             |
| --aalFixedNumberOfActiveLearningIterations | (optional) Default to -1. Fixed number of iterations to process all available instances. Number of instance batch in each instance is calculated based on this parameter.                                          |
| --aalInitialNumberOfSamplesPerIntent       | (optional) Default to 20. Initial #instances randomly sampled for each intent before kicking off the auto-active-learning down-sampling process.                                                                   |
| --aalInitialNumberOfInstancesPerIteration  | (optional) Default to 200. #instance per iteration can be configured to grow until reaching aalNumberOfInstancesPerIteration.                                                                                      |
| --aalNumberOfSamplesPerIntentGrowthRatio   | (optional) Default to 1.5. The growth rate of #instances per auto-active-learning iteration.                                                                                                                       |

### Add or remove specific configuration

```bash
> bf dispatch:config:add <configuration-name> [<value>]
> bf dispatch:config:remove <configuration-name> [<value>]
```

### Print dispatch configuration to console 

To print your current dispatch configuration, run

```bash
> bf dispatch:config:show
```

With the following options

| Option     | Description                                                                                         |
|------------|-----------------------------------------------------------------------------------------------------|
| --dispatch | (optional) .dispatch file path. If not specified, will list the first .dispatch file found in PWD() |
| --help     | Output usage information                                                                            |

### Adding source to dispatch

Add dispatch sources to the .dispatch file. Dispatch init is required to be run prior to running this command

```bash
bf dispatch:source:add
```

| Option                      | Description                                                                                                                                                                                                                                                                                                |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| --type                      | luis, qna, file                                                                                                                                                                                                                                                                                            |
| --id                        | (required only if type is luis/qna) LUIS app id or QnA kb id from application settings page                                                                                                                                                                                                                |
| --name                      | LUIS app name or QnA name (from application settings page) or module/file name for file type                                                                                                                                                                                                               |
| --key                       | (required only if type is luis/qna) LUIS authoring key (from https://www.luis.ai/user/settings, see https://aka.ms/luiskeys for more information on LUIS keys) or QnA maker subscription key (from https://ms.portal.azure.com, see https://aka.ms/qnamakerkeys for more information about QnA Maker keys) |
| --version                   | (Required only if type is luis) LUIS app version                                                                                                                                                                                                                                                           |
| --in                        | (Required only if type is file) Path to .lu or .qna or .tsv file containing tab delimited intent and utterance fields or .txt file with an utterance on each line                                                                                                                                          |
| --intentname                | (optional) Dispatch intent name for this source, name param value will be used otherwise                                                                                                                                                                                                                   |
| --includedintents           | (optional) Comma separated list of intents to be included in the Dispatch model, all intents are included otherwise                                                                                                                                                                                        |
| --ignorewordalterations     | (optional) Default to false. Disable expansions of QnA kb questions with QnA word alterations                                                                                                                                                                                                              |
| --includeanswersfortraining | (optional for QnA only) Default to false. If set to true, QnA KB answers will be included in the training set                                                                                                                                                                                              |
| --includemetadata           | (optional for QnA only) Default to false. If set to true, QnA KB metadata will be included in the training set                                                                                                                                                                                             |
| --includeprompts            | (optional for QnA only) Default to false. If set to true, QnA KB prompt questions will be included in the training set                                                                                                                                                                                     |
| --dispatch                  | (optional) Path to .dispatch file, if not specified PWD() will be used.                                                                                                                                                                                                                                    |
| --help                      | Output usage information                                                                                                                                                                                                                                                                                   |

Supported file types:

| File extension | Description                                                           |
|----------------|-----------------------------------------------------------------------|
| .lu            | File specified in the [.lu][100] file format                          |
| .qna           | File content specified in the [.qna][101] file format                 |
| .tsv           | Lines of tab delimited fields of intent and utterance (in that order) |
| .txt           | Lines of utterances with intent as file name                          |
| .json          | Exported LUIS or QnA Maker json file                                  |

### Removing dispatch source

Remove one of the services from .dispatch file

```bash
> bf dispatch:source:remove
```

Arguments

| Option     | Description                                                                                                                                       |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| --type     | luis, qna, file                                                                                                                                   |
| --id       | (required only if type is luis/qna) LUIS app id or QnA kb id - from application settings page)                                                    |
| --name     | LUIS app name or QnA name (from application settings page) or module/file name for file type                                                      |
| --filepath | (Required only if type is file) Path to tsv file containing tab delimited intent and utterance fields or .txt file with an utterance on each line |
| --dispatch | (optional) Path to .dispatch file                                                                                                                 |
| --help     | Output usage information                                                                                                                          |

### Create dispatch application definition

Create a dispatch application definition as .lu file. This command does not create a new LUIS application. 

```bash
> bf dispatch:app:define
```

| Option     | Description                                                                                                                                           |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| --dispatch | (optional) Path to .dispatch file                                                                                                                     |
| --out      | (optional) Output path and file name for the dispatch .lu file                                                                                        |
| --force    | (optional) Defaults to false. Indicates if dispatch .lu file in the specific --out property should overwrite any existing file in that path specified |
| --help     | Output usage information                                                                                                                              |

### Creating your dispatch application  

Create, train and publish your new dispatch application. This command creates a brand new LUIS application.

```bash
> bf dispatch:app:build
```

| Option     | Description                       |
|------------|-----------------------------------|
| --dispatch | (optional) Path to .dispatch file |
| --help     | Output usage information          |

### Refreshing your dispatch model  

To train and publish your existing dispatch model after modification

```bash
> bf dispatch:app:refresh
```

| Option     | Description                                                                                                                      |
|------------|----------------------------------------------------------------------------------------------------------------------------------|
| --version  | (optional) Dispatch LUIS app version. A new version will be created if param value is different than previously created version. |
| --dispatch | (optional) .dispatch file path                                                                                                   |
| --help     | Output usage information                                                                                                         |

This command updates existing LUIS application in .dispatch file.

### Evaluating your dispatch model  

This command will run cross validation evaluation on the dispatch model and generate a summary of the evaluation

```bash
> bf dispatch:app:eval
```

| Option     | Description                    |
|------------|--------------------------------|
| --dispatch | (optional) .dispatch file path |
| --help     | Output usage information       |

### Testing your dispatch model  

To test your dispatch model against test set:

```shell
> bf dispatch:app:test
```

Options:

| Option                   | Description                                                                                                                                                                |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| --in                     | Path to a tsv file with three (or two) fields: expected intent, weight and utterance in that order; the first line (header) will be skipped; the weight column is optional |
| --dispatch               | (optional) .dispatch file path                                                                                                                                             |
| --help                   | Output usage information                                                                                                                                                   |


### Run prediction using your dispatch model  

To run prediction against your new dispatch model, run

```shell
> bf dispatch:app:predict
```


| Option                   | Description                                                    |
|--------------------------|----------------------------------------------------------------|
| --dispatch               | (optional) .dispatch file path                                 |
| --help                   | Output usage information                                       |


[1]:https://github.com/microsoft/botbuilder-tools/tree/master/packages/Dispatch
[2]:https://qnamaker.ai
[3]:https://luis.ai
[100]:https://github.com/microsoft/botframework-cli/blob/master/packages/lu/docs/lu-file-format.md
[101]:https://github.com/microsoft/botframework-cli/blob/master/packages/lu/docs/qna-file-format.md
