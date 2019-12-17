@microsoft/bf-luis-cli
======================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-luis-cli.svg)](https://npmjs.org/package/@microsoft/bf-luis-cli)

<!-- toc -->
* [Commands](#commands)
<!-- tocstop -->
* [Commands](#commands)
<!-- tocstop -->

# Commands
<!-- commands -->
* [`bf luis`](#bf-luis)
* [`bf luis:application:create`](#bf-luisapplicationcreate)
* [`bf luis:application:delete`](#bf-luisapplicationdelete)
* [`bf luis:application:import`](#bf-luisapplicationimport)
* [`bf luis:application:list`](#bf-luisapplicationlist)
* [`bf luis:application:publish`](#bf-luisapplicationpublish)
* [`bf luis:application:query`](#bf-luisapplicationquery)
* [`bf luis:application:rename`](#bf-luisapplicationrename)
* [`bf luis:application:show`](#bf-luisapplicationshow)
* [`bf luis:endpoints:list`](#bf-luisendpointslist)
* [`bf luis:train:run`](#bf-luistrainrun)
* [`bf luis:train:show`](#bf-luistrainshow)
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

_See code: [src\commands\luis\index.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\index.ts)_

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

_See code: [src\commands\luis\application\create.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\application\create.ts)_

## `bf luis:application:delete`

Deletes a LUIS application

```
USAGE
  $ bf luis:application:delete

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

EXAMPLE

       $ bf luis:application:delete --appId {APP_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
```

_See code: [src\commands\luis\application\delete.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\application\delete.ts)_

## `bf luis:application:import`

Imports LUIS application from JSON or LU content.

```
USAGE
  $ bf luis:application:import

OPTIONS
  -h, --help                         show CLI help

  -i, --in=in                        (required) File path containing LUIS application contents, uses STDOUT if not
                                     specified

  --endpoint=endpoint                LUIS endpoint hostname

  --name=name                        LUIS application name (optional)

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

EXAMPLE

       $ bf luis:application:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --name {NAME} --in 
  {PATH_TO_JSON}
       $ echo {SERIALIZED_JSON} | bf luis:application:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} 
  --name {NAME}
```

_See code: [src\commands\luis\application\import.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\application\import.ts)_

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

_See code: [src\commands\luis\application\list.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\application\list.ts)_

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

_See code: [src\commands\luis\application\publish.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\application\publish.ts)_

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

_See code: [src\commands\luis\application\query.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\application\query.ts)_

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
  --name=name                        (required) (required) Name of LUIS application

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

EXAMPLE

       $ bf luis:application:rename --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --name 
  {NAME} --description {DESCRIPTION}
```

_See code: [src\commands\luis\application\rename.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\application\rename.ts)_

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

_See code: [src\commands\luis\application\show.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\application\show.ts)_

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

_See code: [src\commands\luis\endpoints\list.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\endpoints\list.ts)_

## `bf luis:train:run`

Issues asynchronous training request for LUIS application

```
USAGE
  $ bf luis:train:run

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              (required) Version to show training status (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:train:run --appId {APPLICATION_ID} --versionId {VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey 
  {SUBSCRIPTION_KEY}
```

_See code: [src\commands\luis\train\run.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\train\run.ts)_

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

_See code: [src\commands\luis\train\show.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\train\show.ts)_

## `bf luis:version:clone`

Creates a new version equivalent to the current snapshot of the selected application version.

```
USAGE
  $ bf luis:version:clone

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname
  --subscriptionKey=subscriptionKey  LUIS authoring (Ocp-Apim-subscription) key
  --targetVersionId=targetVersionId  (required) Destination version to create
  --versionId=versionId              (required) Source version to clone (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:version:clone --appId {APP_ID} --versionId {VERSION_ID} --targetVersionId {TARGET_VERSION_ID} 
  --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
```

_See code: [src\commands\luis\version\clone.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\version\clone.ts)_

## `bf luis:version:delete`

Deletes a LUIS application version

```
USAGE
  $ bf luis:version:delete

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              (required) Version to delete

EXAMPLE

       $ bf luis:version:delete --appId {APP_ID} --versionId {VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey 
  {SUBSCRIPTION_KEY}
```

_See code: [src\commands\luis\version\delete.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\version\delete.ts)_

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

_See code: [src\commands\luis\version\export.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\version\export.ts)_

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

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              Version to export (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:version:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --in 
  {PATH_TO_JSON} --versionId {VERSION_ID}
       $ echo {SERIALIZED_JSON} | bf luis:version:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} 
  --appId {APP_ID}
```

_See code: [src\commands\luis\version\import.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\version\import.ts)_

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

_See code: [src\commands\luis\version\list.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\version\list.ts)_

## `bf luis:version:rename`

Renames application version

```
USAGE
  $ bf luis:version:rename

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --endpoint=endpoint                LUIS endpoint hostname
  --newVersionId=newVersionId        (required) New version id

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              (required) Version to update (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:version:rename --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --name 
  {NAME} --description {DESCRIPTION}
```

_See code: [src\commands\luis\version\rename.ts](https://github.com/packages/bf-luis-cli/src\commands\luis\version\rename.ts)_
<!-- commandsstop -->


<!-- commandsstop -->
