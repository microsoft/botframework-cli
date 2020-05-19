@microsoft/bf-luis-cli
======================

This package is intended for Microsoft use only and should be consumed through @microsoft/botframework-cli. It is not designed to be consumed as an independent package.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-luis-cli.svg)](https://npmjs.org/package/@microsoft/bf-luis-cli)

# Relevant docs
- [.lu file format][1]
- [Working with .lu files][2]
- [Machine translating .lu content][3]
- [Using luis:build][4]

<!-- toc -->
* [Relevant docs](#relevant-docs)
* [Commands](#commands)
<!-- tocstop -->

# Commands
<!-- commands -->
* [`bf luis`](#bf-luis)
* [`bf luis:application:assignazureaccount`](#bf-luisapplicationassignazureaccount)
* [`bf luis:application:create`](#bf-luisapplicationcreate)
* [`bf luis:application:delete`](#bf-luisapplicationdelete)
* [`bf luis:application:import`](#bf-luisapplicationimport)
* [`bf luis:application:list`](#bf-luisapplicationlist)
* [`bf luis:application:publish`](#bf-luisapplicationpublish)
* [`bf luis:application:query`](#bf-luisapplicationquery)
* [`bf luis:application:rename`](#bf-luisapplicationrename)
* [`bf luis:application:show`](#bf-luisapplicationshow)
* [`bf luis:build`](#bf-luisbuild)
* [`bf luis:convert`](#bf-luisconvert)
* [`bf luis:cross-train`](#bf-luiscross-train)
* [`bf luis:endpoints:list`](#bf-luisendpointslist)
* [`bf luis:generate:cs`](#bf-luisgeneratecs)
* [`bf luis:generate:ts`](#bf-luisgeneratets)
* [`bf luis:test`](#bf-luistest)
* [`bf luis:train:run`](#bf-luistrainrun)
* [`bf luis:train:show`](#bf-luistrainshow)
* [`bf luis:translate`](#bf-luistranslate)
* [`bf luis:version:clone`](#bf-luisversionclone)
* [`bf luis:version:delete`](#bf-luisversiondelete)
* [`bf luis:version:export`](#bf-luisversionexport)
* [`bf luis:version:import`](#bf-luisversionimport)
* [`bf luis:version:list`](#bf-luisversionlist)
* [`bf luis:version:rename`](#bf-luisversionrename)

## `bf luis`

Manages LUIS assets on service and/or locally.

```
USAGE
  $ bf luis

OPTIONS
  -h, --help  LUIS command help
```

_See code: [src/commands/luis/index.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/index.ts)_

## `bf luis:application:assignazureaccount`

Assign a LUIS azure accounts to an application

```
USAGE
  $ bf luis:application:assignazureaccount

OPTIONS
  -h, --help                                 show CLI help
  --accountName=accountName                  (required) Account name
  --appId=appId                              (required) LUIS application Id (defaults to config:LUIS:appId)

  --armToken=armToken                        (required) The bearer authorization header to use; containing the user`s
                                             ARM token used to validate azure accounts information

  --azureSubscriptionId=azureSubscriptionId  (required) Azure Subscription Id

  --endpoint=endpoint                        LUIS endpoint hostname

  --json                                     Display output as JSON

  --resourceGroup=resourceGroup              (required) Resource Group

  --subscriptionKey=subscriptionKey          (required) LUIS cognitive services subscription key (default:
                                             config:LUIS:subscriptionKey)
```

_See code: [src/commands/luis/application/assignazureaccount.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/assignazureaccount.ts)_

## `bf luis:application:create`

Creates a new LUIS application

```
USAGE
  $ bf luis:application:create

OPTIONS
  -h, --help                           show CLI help
  --culture=culture                    Specify culture language (default: en-us)
  --description=description            Description of LUIS application
  --endpoint=endpoint                  LUIS endpoint hostname
  --json                               Display output as JSON
  --name=name                          (required) Name of LUIS application
  --save                               Save configuration settings from imported app (appId & endpoint)

  --subscriptionKey=subscriptionKey    (required) LUIS cognitive services subscription key (default:
                                       config:LUIS:subscriptionKey)

  --tokenizerVersion=tokenizerVersion  Version specifies how sentences are tokenized (optional). See also:
                                       https://aka.ms/luistokens

  --versionId=versionId                (required) LUIS version Id. (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:application:create --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --name {NAME} --culture 
  {CULTURE}
       --domain {DOMAIN} --description {DESCRIPTION} --versionId {INITIAL_VERSION_ID} --usageScenario {USAGE_SCENARIO}
```

_See code: [src/commands/luis/application/create.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/create.ts)_

## `bf luis:application:delete`

Deletes a LUIS application

```
USAGE
  $ bf luis:application:delete

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname
  --force                            Force delete with no confirmation
  --json                             Display output as JSON

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

EXAMPLE

       $ bf luis:application:delete --appId {APP_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
```

_See code: [src/commands/luis/application/delete.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/delete.ts)_

## `bf luis:application:import`

Imports LUIS application from JSON or LU content.

```
USAGE
  $ bf luis:application:import

OPTIONS
  -h, --help                         show CLI help

  -i, --in=in                        (required) File path containing LUIS application contents, uses STDIN if not
                                     specified

  --endpoint=endpoint                (required) LUIS endpoint hostname

  --json                             Display output as JSON

  --name=name                        LUIS application name (optional)

  --save                             Save configuration settings from imported app (appId, subscriptionKey & endpoint)

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default: config
                                     subscriptionKey)

EXAMPLE

       $ bf luis:application:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --name {NAME} --in 
  {PATH_TO_JSON}
       $ echo {SERIALIZED_JSON} | bf luis:application:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} 
  --name {NAME}
```

_See code: [src/commands/luis/application/import.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/import.ts)_

## `bf luis:application:list`

Lists all applications on LUIS service.

```
USAGE
  $ bf luis:application:list

OPTIONS
  -f, --force                        If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help                         show CLI help

  -o, --out=out                      Output results to specified file in JSON format, otherwise prints to STDOUT
                                     (optional)

  --endpoint=endpoint                LUIS endpoint hostname

  --skip=skip                        Number of entries to skip. Default: 0 (no skips)

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --take=take                        Number of etnries to return. Maximum page size is 500. Default: 100

EXAMPLE

       $ bf luis:application:list --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --take 3
       $ bf luis:application:list --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --out {PATH_TO_JSON_FILE}
```

_See code: [src/commands/luis/application/list.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/list.ts)_

## `bf luis:application:publish`

Publishes application's version

```
USAGE
  $ bf luis:application:publish

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)

  --direct                           Available only in direct version query. Do not publish to staging or production
                                     (default: false)

  --endpoint=endpoint                LUIS endpoint hostname

  --staging                          Publishes application version to Staging slot, otherwise publish to production
                                     (default: false)

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              (required) Version to publish (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:application:publish --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --versionId 
  {INITIAL_VERSION_ID} --appId {APP_ID} --staging {BOOLEAN}
```

_See code: [src/commands/luis/application/publish.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/publish.ts)_

## `bf luis:application:query`

Queries application for intent predictions

```
USAGE
  $ bf luis:application:query

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname
  --log                              Logs query operation on service (default: true)
  --query=query                      (required) Query string to predict
  --staging                          Presence of flag targets the staging app, if no flag passed defaults to production

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --timezoneOffset=timezoneOffset    Timezone offset for the location of the request in minutes (optional)

  --verbose                          Returns all intents, otherwise only top scoring intent. (default: false)

EXAMPLE

       $ bf luis:application:query --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --query 
  {QUERY} --prod {BOOLEAN}
```

_See code: [src/commands/luis/application/query.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/query.ts)_

## `bf luis:application:rename`

Renames the application and updates its description

```
USAGE
  $ bf luis:application:rename

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --description=description          Description of LUIS application
  --endpoint=endpoint                LUIS endpoint hostname
  --json                             Display output as JSON
  --name=name                        (required) (required) Name of LUIS application

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

EXAMPLE

       $ bf luis:application:rename --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --name 
  {NAME} --description {DESCRIPTION}
```

_See code: [src/commands/luis/application/rename.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/rename.ts)_

## `bf luis:application:show`

Shows application information

```
USAGE
  $ bf luis:application:show

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

EXAMPLE

       $ bf luis:application:show --appId {APPLICATION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
```

_See code: [src/commands/luis/application/show.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/show.ts)_

## `bf luis:build`

Build lu files to train and publish luis applications

```
USAGE
  $ bf luis:build

OPTIONS
  -f, --force                      If --out flag is provided, overwrites relevant dialog file
  -h, --help                       show CLI help
  -i, --in=in                      Lu file or folder

  -o, --out=out                    Output folder name to write out .dialog files. If not specified, only application ids will be output to console

  --authoringKey=authoringKey      LUIS authoring key

  --botName=botName                Bot name

  --defaultCulture=defaultCulture  Culture code for the content. Infer from .lu if available. Defaults to en-us

  --deleteOldVersion               Delete old version of LUIS application after building new one.

  --dialog=dialog                  [default: multiLanguage] Dialog recognizer type [multiLanguage|crosstrained]

  --fallbackLocale=fallbackLocale  Locale to be used at the fallback if no locale specific recognizer is found. Only
                                   valid if --out is set

  --log                            write out log messages to console

  --luConfig=luConfig              Path to config for lu build which can contain switches for arguments

  --region=region                  [default: westus] LUIS authoring region [westus|westeurope|australiaeast]

  --suffix=suffix                  Environment name as a suffix identifier to include in LUIS app name. Defaults to
                                   current logged in user alias

EXAMPLE

       $ bf luis:build --in {INPUT_FILE_OR_FOLDER} --authoringKey {AUTHORING_KEY} --botName {BOT_NAME} --dialog 
  multiLanguage
```

_See code: [src/commands/luis/build.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/build.ts)_

## `bf luis:convert`

Convert .lu file(s) to a LUIS application JSON model or vice versa

```
USAGE
  $ bf luis:convert

OPTIONS
  -f, --force                    If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help                     luis:convert help
  -i, --in=in                    Source .lu file(s) or LUIS application JSON model
  -o, --out=out                  Output file or folder name. If not specified stdout will be used as output
  -r, --recurse                  Indicates if sub-folders need to be considered to file .lu file(s)
  --culture=culture              Lang code for the LUIS application
  --description=description      Text describing the LUIS applicaion
  --log                          Enables log messages
  --name=name                    Name of the LUIS application
  --schemaversion=schemaversion  Schema version of the LUIS application
  --sort                         When set, intent, utterances, entities are alphabetically sorted in .lu files
  --versionid=versionid          Version ID of the LUIS application
```

_See code: [src/commands/luis/convert.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/convert.ts)_

## `bf luis:cross-train`

Lu and Qna cross train tool

```
USAGE
  $ bf luis:cross-train

OPTIONS
  -h, --help               luis:cross-train help
  -i, --in=in              source lu and qna files folder

  -o, --out=out            output folder name. If not specified, the cross trained files will be wrote to cross-trained
                           folder under folder of current command

  --config=config          path to config file of mapping rules which is relative to folder specified by --in. If not
                           specified, it will read default config.json from the folder specified by --in

  --intentName=intentName  [default: _Interruption] Interruption intent name

  --rootDialog=rootDialog  rootDialog file path which is relative to folder specified by --in. If --config not
                           specified, cross-trian will automatically construct the config from file system based on root
                           dialog file
```

_See code: [src/commands/luis/cross-train.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/cross-train.ts)_

## `bf luis:endpoints:list`

Returns available deployment endpoints

```
USAGE
  $ bf luis:endpoints:list

OPTIONS
  -f, --force                        If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help                         show CLI help

  -o, --out=out                      Output results to specified file in JSON format, otherwise prints to STDOUT
                                     (optional)

  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)

  --endpoint=endpoint                LUIS endpoint hostname

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

EXAMPLE

       $ bf luis:endpoints:list --appId {APPLICATION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} 
  --out {PATH_TO_JSON_FILE}
```

_See code: [src/commands/luis/endpoints/list.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/endpoints/list.ts)_

## `bf luis:generate:cs`

Generate:cs generates a strongly typed C# source code from an exported (json) LUIS model.

```
USAGE
  $ bf luis:generate:cs

OPTIONS
  -f, --force            If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help             luis:generate:cs help
  -i, --in=in            Path to the file containing the LUIS application JSON model
  -o, --out=out          Output file or folder name. If not specified stdout will be used as output
  --className=className  Name of the autogenerated class (can include namespace)
```

_See code: [src/commands/luis/generate/cs.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/generate/cs.ts)_

## `bf luis:generate:ts`

Generate:ts generates a strongly typed typescript source code from an exported (json) LUIS model.

```
USAGE
  $ bf luis:generate:ts

OPTIONS
  -f, --force            If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help             luis:generate:ts help
  -i, --in=in            Path to the file containing the LUIS application JSON model
  -o, --out=out          Output file or folder name. If not specified stdout will be used as output
  --className=className  Name of the autogenerated class
```

_See code: [src/commands/luis/generate/ts.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/generate/ts.ts)_

## `bf luis:test`

Test a .lu file or LUIS application JSON model against a published LUIS model

```
USAGE
  $ bf luis:test

OPTIONS
  -a, --appId=appId                      (required) LUIS application Id
  -h, --help                             luis:test help
  -i, --in=in                            Source .lu file or LUIS application JSON model for testing
  -o, --out=out                          Output file or folder name. If not specified stdout will be used as output
  -s, --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key

  --allowIntentsCount=allowIntentsCount  [default: 1] Top-scoring intent or top n Intent with score to show in the
                                         result

  --endpoint=endpoint                    [default: https://westus.api.cognitive.microsoft.com] LUIS endpoint hostname

  --force                                If --out flag is provided with the path to an existing file, overwrites that
                                         file

  --intentOnly                           Only test intent

  --staging                              Presence of flag targets the staging app, if no flag passed defaults to
                                         production
```

_See code: [src/commands/luis/test.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/test.ts)_

## `bf luis:train:run`

Issues asynchronous training request for LUIS application

```
USAGE
  $ bf luis:train:run

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname
  --json                             Display output as JSON

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              (required) Version to show training status (defaults to config:LUIS:versionId)

  --wait                             Wait until training complete and then display status

EXAMPLE

       $ bf luis:train:run --appId {APPLICATION_ID} --versionId {VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey 
  {SUBSCRIPTION_KEY}
```

_See code: [src/commands/luis/train/run.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/train/run.ts)_

## `bf luis:train:show`

Shows training status

```
USAGE
  $ bf luis:train:show

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              (required) Version to show training status (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:train:show --appId {APPLICATION_ID} --versionId {VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey 
  {SUBSCRIPTION_KEY}
```

_See code: [src/commands/luis/train/show.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/train/show.ts)_

## `bf luis:translate`

Translate given LUIS application JSON model or lu file(s)

```
USAGE
  $ bf luis:translate

OPTIONS
  -f, --force                  If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help                   luis:translate help
  -i, --in=in                  Source .lu file(s) or LUIS application JSON model
  -o, --out=out                Output folder name. If not specified stdout will be used as output
  -r, --recurse                Indicates if sub-folders need to be considered to file .lu file(s)
  --srclang=srclang            Source lang code. Auto detect if missing.
  --tgtlang=tgtlang            (required) Comma separated list of target languages.
  --translate_comments         When set, machine translate comments found in .lu file
  --translate_link_text        When set, machine translate link description in .lu file
  --translatekey=translatekey  (required) Machine translation endpoint key.
```

_See code: [src/commands/luis/translate.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/translate.ts)_

## `bf luis:version:clone`

Creates a new version equivalent to the current snapshot of the selected application version.

```
USAGE
  $ bf luis:version:clone

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname
  --json                             Display output as JSON
  --subscriptionKey=subscriptionKey  LUIS authoring (Ocp-Apim-subscription) key
  --targetVersionId=targetVersionId  (required) Destination version to create
  --versionId=versionId              (required) Source version to clone (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:version:clone --appId {APP_ID} --versionId {VERSION_ID} --targetVersionId {TARGET_VERSION_ID} 
  --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
```

_See code: [src/commands/luis/version/clone.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/clone.ts)_

## `bf luis:version:delete`

Deletes a LUIS application version

```
USAGE
  $ bf luis:version:delete

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname
  --json                             Display output as JSON

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              (required) Version to delete

EXAMPLE

       $ bf luis:version:delete --appId {APP_ID} --versionId {VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey 
  {SUBSCRIPTION_KEY}
```

_See code: [src/commands/luis/version/delete.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/delete.ts)_

## `bf luis:version:export`

Exports a LUIS application to JSON format

```
USAGE
  $ bf luis:version:export

OPTIONS
  -f, --force                        Overwrites output file if exists, otherwise creates a parallel numbered file
                                     (optional)

  -h, --help                         show CLI help

  -o, --out=out                      Save exported application to specified file, uses STDOUT if not specified
                                     (optional)

  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)

  --endpoint=endpoint                LUIS endpoint hostname

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              (required) Version to export (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:version:export --appId {APP_ID} --versionId {VERSION_ID} --out {FILENAME.json or PATH/FILENAME.json} 
  --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
```

_See code: [src/commands/luis/version/export.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/export.ts)_

## `bf luis:version:import`

Imports a new version into a LUIS application from JSON or LU content.

```
USAGE
  $ bf luis:version:import

OPTIONS
  -h, --help                         show CLI help

  -i, --in=in                        (required) File path containing LUIS application contents, uses STDIN if not
                                     specified

  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)

  --endpoint=endpoint                LUIS endpoint hostname

  --json                             Display output as JSON

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              Version to export (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:version:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --in 
  {PATH_TO_JSON} --versionId {VERSION_ID}
       $ echo {SERIALIZED_JSON} | bf luis:version:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} 
  --appId {APP_ID}
```

_See code: [src/commands/luis/version/import.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/import.ts)_

## `bf luis:version:list`

Returns application's versions

```
USAGE
  $ bf luis:version:list

OPTIONS
  -f, --force                        If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help                         show CLI help

  -o, --out=out                      Output results to specified folder and/or file in JSON format, otherwise prints to
                                     STDOUT (optional)

  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)

  --endpoint=endpoint                LUIS endpoint hostname

  --skip=skip                        Number of entries to skip. Default: 0 (no skips)

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --take=take                        Number of etnries to return. Maximum page size is 500. Default: 100

EXAMPLE

       $ bf luis:version:list --appId {APPLICATION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --take 
  3
       $ bf luis:version:list --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --out {PATH_TO_JSON_FILE}
```

_See code: [src/commands/luis/version/list.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/list.ts)_

## `bf luis:version:rename`

Renames application version

```
USAGE
  $ bf luis:version:rename

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname
  --json                             Display output as JSON
  --newVersionId=newVersionId        (required) New version id

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              (required) Version to update (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:version:rename --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --name 
  {NAME} --description {DESCRIPTION}
```

_See code: [src/commands/luis/version/rename.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/rename.ts)_
<!-- commandsstop -->

[1]:https://aka.ms/lu-file-format
[2]:./docs/working-with-luis.md
[3]:./docs/translate-command.md
[4]:./docs/using-luis-build.md
