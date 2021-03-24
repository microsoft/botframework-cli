botframework-cli
================

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/botframework-cli)](https://www.npmjs.com/package/@microsoft/botframework-cli)
[![Downloads](https://img.shields.io/npm/dt/@microsoft/botframework-cli)](https://github.com/microsoft/botframework-cli)
[![License](https://img.shields.io/npm/l/@microsoft/botframework-cli)](https://github.com/microsoft/botframework-cli/blob/master/packages/cli/package.json)

# Dependency
Node v12


# Usage

```sh-session
$ npm install -g @microsoft/botframework-cli

```

# Commands
<!-- commands -->
* [`bf chatdown`](#bf-chatdown)
* [`bf chatdown:convert`](#bf-chatdownconvert)
* [`bf config`](#bf-config)
* [`bf config:set`](#bf-configset)
* [`bf config:set:luis`](#bf-configsetluis)
* [`bf config:set:qnamaker`](#bf-configsetqnamaker)
* [`bf config:set:telemetry`](#bf-configsettelemetry)
* [`bf config:show`](#bf-configshow)
* [`bf config:show:luis`](#bf-configshowluis)
* [`bf config:show:qnamaker`](#bf-configshowqnamaker)
* [`bf config:show:telemetry`](#bf-configshowtelemetry)
* [`bf dialog`](#bf-dialog)
* [`bf dialog:merge PATTERNS`](#bf-dialogmerge-patterns)
* [`bf dialog:verify PATTERNS`](#bf-dialogverify-patterns)
* [`bf help [COMMAND]`](#bf-help-command)
* [`bf lg`](#bf-lg)
* [`bf lg:expand`](#bf-lgexpand)
* [`bf lg:translate`](#bf-lgtranslate)
* [`bf lg:verify`](#bf-lgverify)
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
* [`bf orchestrator`](#bf-orchestrator)
* [`bf orchestrator:add`](#bf-orchestratoradd)
* [`bf orchestrator:create`](#bf-orchestratorcreate)
* [`bf orchestrator:basemodel:get`](#bf-orchestratorbasemodelget)
* [`bf orchestrator:basemodel:list`](#bf-orchestratorbasemodellist)
* [`bf orchestrator:interactive`](#bf-orchestratorinteractive)
* [`bf orchestrator:query`](#bf-orchestratorquery)
* [`bf orchestrator:test`](#bf-orchestratortest)
* [`bf plugins`](#bf-plugins)
* [`bf plugins:install PLUGIN`](#bf-pluginsinstall-plugin)
* [`bf plugins:list`](#bf-pluginslist)
* [`bf plugins:uninstall [PLUGIN]`](#bf-pluginsuninstall-plugin)
* [`bf qnamaker`](#bf-qnamaker)
* [`bf qnamaker:alterations`](#bf-qnamakeralterations)
* [`bf qnamaker:alterations:list`](#bf-qnamakeralterationslist)
* [`bf qnamaker:alterations:replace`](#bf-qnamakeralterationsreplace)
* [`bf qnamaker:build`](#bf-qnamakerbuild)
* [`bf qnamaker:convert`](#bf-qnamakerconvert)
* [`bf qnamaker:cross-train`](#bf-qnamakercross-train)
* [`bf qnamaker:endpointkeys`](#bf-qnamakerendpointkeys)
* [`bf qnamaker:endpointkeys:list`](#bf-qnamakerendpointkeyslist)
* [`bf qnamaker:endpointkeys:refresh`](#bf-qnamakerendpointkeysrefresh)
* [`bf qnamaker:endpointsettings`](#bf-qnamakerendpointsettings)
* [`bf qnamaker:endpointsettings:get`](#bf-qnamakerendpointsettingsget)
* [`bf qnamaker:endpointsettings:update`](#bf-qnamakerendpointsettingsupdate)
* [`bf qnamaker:init`](#bf-qnamakerinit)
* [`bf qnamaker:kb`](#bf-qnamakerkb)
* [`bf qnamaker:kb:create`](#bf-qnamakerkbcreate)
* [`bf qnamaker:kb:delete`](#bf-qnamakerkbdelete)
* [`bf qnamaker:kb:export`](#bf-qnamakerkbexport)
* [`bf qnamaker:kb:get`](#bf-qnamakerkbget)
* [`bf qnamaker:kb:list`](#bf-qnamakerkblist)
* [`bf qnamaker:kb:publish`](#bf-qnamakerkbpublish)
* [`bf qnamaker:kb:replace`](#bf-qnamakerkbreplace)
* [`bf qnamaker:kb:update`](#bf-qnamakerkbupdate)
* [`bf qnamaker:operationdetails`](#bf-qnamakeroperationdetails)
* [`bf qnamaker:operationdetails:get`](#bf-qnamakeroperationdetailsget)
* [`bf qnamaker:query`](#bf-qnamakerquery)
* [`bf qnamaker:train`](#bf-qnamakertrain)
* [`bf qnamaker:translate`](#bf-qnamakertranslate)

## `bf chatdown`

Converts chat dialog files in <filename>.chat format into transcript files. Writes corresponding <filename>.transcript for each .chat file.

```
USAGE
  $ bf chatdown

OPTIONS
  -h, --help  Chatdown command help
```

_See code: [@microsoft/bf-chatdown](https://github.com/microsoft/botframework-cli/tree/master/packages/chatdown/src/commands/chatdown/index.ts)_

## `bf chatdown:convert`

Converts chat dialog files in <filename>.chat format into transcript files. Writes corresponding <filename>.transcript for each .chat file.

```
USAGE
  $ bf chatdown:convert

OPTIONS
  -f, --force    If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help     Chatdown command help

  -i, --in=in    The path of the chat file or directory to be parsed. A glob expression may be passed containing chat
                 files to be processed all at once, ex. ./**/*.chat. If flag is omitted, stdin will be used. If an
                 output directory is not present (-o), it will default the output to the current working directory.

  -o, --out=out  Path to the directory where the output of the multiple chat file processing (-o) will be placed.

  -p, --prefix   Prefix stdout with package name.

  -s, --stamp    Use static timestamps when generating timestamps on activities.

EXAMPLE

     $ bf chatdown
     $ bf chatdown --in=./path/to/file/sample.chat
     $ bf chatdown --in ./test/utils/*.sample.chat -o ./
     $ (echo user=Joe && [ConversationUpdate=MembersAdded=Joe]) | bf chatdown --static
```

_See code: [@microsoft/bf-chatdown](https://github.com/microsoft/botframework-cli/tree/master/packages/chatdown/src/commands/chatdown/convert.ts)_

## `bf config`

Configure various settings within the cli.

```
USAGE
  $ bf config

OPTIONS
  -h, --help  config help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/index.ts)_

## `bf config:set`

Adds the specified key and value to the config file

```
USAGE
  $ bf config:set

OPTIONS
  -h, --help         config:set help
  -k, --key=key      (required) Name of the key to add or override
  -v, --value=value  (required) Value associated with the specified key
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/set.ts)_

## `bf config:set:luis`

Stores default LUIS application values in global config.

```
USAGE
  $ bf config:set:luis

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      LUIS application Id
  --authoringKey=authoringKey        LUIS cognitive services authoring key (aka Ocp-Apim-Subscription-Key).
  --endpoint=endpoint                LUIS application endpoint hostname, ex: <region>.api.cognitive.microsoft.com
  --subscriptionKey=subscriptionKey  LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)
  --versionId=versionId              LUIS version Id

EXAMPLE

       $ bf config:set:luis --appId {APPLICATION_ID} --authoringKey {AUTHORING_KEY} --subscriptionKey {SUBSCRIPTION_KEY} 
  --versionId {VERSION_ID} --endpoint {ENDPOINT}
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/set/luis.ts)_

## `bf config:set:qnamaker`

Set the QnAMaker config data

```
USAGE
  $ bf config:set:qnamaker

OPTIONS
  -h, --help                         config:set:qnamaker help
  --endpointKey=endpointKey          QnAMaker endpointKey to be set
  --hostname=hostname                QnAMaker hostname to be set
  --kbId=kbId                        QnAMaker kbId to be set
  --subscriptionKey=subscriptionKey  QnAMaker subscriptionkey to be set

EXAMPLE

     {
       "qnamaker_kbId": "3bda64af-dddd-dddd-dddd-021906b093b1",
       "qnamaker_subscriptionKey": "nnnnnnnnnnnnnnnnnnnnnnnnn",
       "qnamaker_endpointKey": "6b5ecf9c-kkkk-kkkk-kkkk-761489817e5f",
       "qnamaker_hostname": "https://{qnaservice-hostname}.azurewebsites.net"
     }
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/set/qnamaker.ts)_

## `bf config:set:telemetry`

Enable or disable anonymous data collection to improve the products. (Command group calls and flags usage)

```
USAGE
  $ bf config:set:telemetry

OPTIONS
  -d, --disable  Disable tlemetry
  -e, --enable   Enable tlemetry
  -h, --help     config:set:telemetry help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/set/telemetry.ts)_

## `bf config:show`

Displays the config file

```
USAGE
  $ bf config:show

OPTIONS
  -h, --help     config:show help
  -k, --key=key  Shows specific key value
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/show.ts)_

## `bf config:show:luis`

Display LUIS settings

```
USAGE
  $ bf config:show:luis

OPTIONS
  -h, --help  config:show:luis help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/show/luis.ts)_

## `bf config:show:qnamaker`

Display QnAMaker settings

```
USAGE
  $ bf config:show:qnamaker

OPTIONS
  -h, --help  config:show:qnamaker help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/show/qnamaker.ts)_

## `bf config:show:telemetry`

Display telemetry settings

```
USAGE
  $ bf config:show:telemetry

OPTIONS
  -h, --help  config:show:telemetry help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/show/telemetry.ts)_

## `bf dialog`

Dialog related commands for working with .schema and .dialog files.

```
USAGE
  $ bf dialog

OPTIONS
  -h, --help  Dialog command help
```

_See code: [@microsoft/bf-dialog](https://github.com/microsoft/botframework-cli/tree/master/packages/dialog/src/commands/dialog/index.ts)_

## `bf dialog:merge PATTERNS`

Merge `<kind>.schema` and `<kind>[.<locale>].uischema` definitions from a project and its dependencies into a single .schema for describing .dialog files and a per locale .uischema for describing how Composer shows them.  If a dependent package has an "exported" directory it is copied to /<package> in the --imports directory. You can make use of negative patterns like !**/generated/** to exclude particular directories or files, although some directories like bin, obj and node_modules are automatically excluded.

```
USAGE
  $ bf dialog:merge PATTERNS

ARGUMENTS
  PATTERNS  Any number of glob regex patterns to match .csproj, .nuspec or package.json files.

OPTIONS
  -c, --checkOnly        Check and do not write files.
  -h, --help             show CLI help

  -o, --output=output    Output path and optional filename for merged .schema and .uischema.  Defaults to first project
                         name.

  -s, --schema=schema    Path to merged .schema file to use if merging .uischema only.

  -v, --verbose          Show verbose logging of files as they are processed.

  --extension=extension  [default: .dialog,.lg,.lu,.schema,.qna,.uischema] Extension to include as a resource.

  --imports=imports      Output path for imported assets.  Defaults to the directory of --out with an imported
                         directory.

EXAMPLES
  $ bf dialog:merge myProject.csproj plugins/*.nuspec
  $ bf dialog:merge package.json -o app.schema
```

_See code: [@microsoft/bf-dialog](https://github.com/microsoft/botframework-cli/tree/master/packages/dialog/src/commands/dialog/merge.ts)_

## `bf dialog:verify PATTERNS`

Verify .dialog files match their app.schema.

```
USAGE
  $ bf dialog:verify PATTERNS

ARGUMENTS
  PATTERNS  Any number of glob regex patterns to match .dialog files.

OPTIONS
  -h, --help           show CLI help
  -s, --schema=schema  Default schema to use if no $schema in dialog file.
  -v, --verbose        Show verbose output
```

_See code: [@microsoft/bf-dialog](https://github.com/microsoft/botframework-cli/tree/master/packages/dialog/src/commands/dialog/verify.ts)_

## `bf help [COMMAND]`

display help for bf

```
USAGE
  $ bf help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `bf lg`

Parse, collate, expand and translate lg files.

```
USAGE
  $ bf lg

OPTIONS
  -h, --help  lg command help
```

_See code: [@microsoft/bf-lg-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/lg/src/commands/lg/index.ts)_

## `bf lg:expand`

Expand one or all templates in .lg file(s). Expand an inline expression.

```
USAGE
  $ bf lg:expand

OPTIONS
  -f, --force              If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help               lg:expand help
  -i, --in=in              (required) Folder that contains .lg file.
  -o, --out=out            Output file or folder name. If not specified stdout will be used as output
  -r, --recurse            Consider sub-folders to find .lg file(s)
  --all                    When set, all templates in the .lg file be expanded.
  --expression=expression  Inline expression provided as a string to evaluate.
  --interactive            Interactively prompt for all missing entity value references required for expansion.
  --template=template      Name of the template to expand. Template names with spaces must be enclosed in quotes.
  --testInput=testInput    Path to a JSON file containing test input for all variable references.
```

_See code: [@microsoft/bf-lg-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/lg/src/commands/lg/expand.ts)_

## `bf lg:translate`

Machine translate .lg files using Microsoft Translator Text API.

```
USAGE
  $ bf lg:translate

OPTIONS
  -f, --force                  If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help                   lg:translate help
  -i, --in=in                  (required) Folder that contains .lg file.
  -o, --out=out                Output file or folder name. If not specified stdout will be used as output
  -r, --recurse                Consider sub-folders to find .lg file(s)
  --region=region              (required) The sub region.
  --srclang=srclang            Source lang code. Auto detect if missing.
  --tgtlang=tgtlang            (required) Comma separated list of target languages.
  --translate_comments         Machine translate all comments found in .lg file
  --translate_link_text        Machine translate link description in .lg file
  --translatekey=translatekey  (required) Machine translation endpoint key.
```

_See code: [@microsoft/bf-lg-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/lg/src/commands/lg/translate.ts)_

## `bf lg:verify`

Verify .lg file(s) and collate them into a single file.

```
USAGE
  $ bf lg:verify

OPTIONS
  -f, --force    If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help     lg:verify help
  -i, --in=in    (required) Folder that contains .lg file.
  -o, --out=out  Output file or folder name. If not specified stdout will be used as output
  -r, --recurse  Considere sub-folders to find .lg file(s)
```

_See code: [@microsoft/bf-lg-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/lg/src/commands/lg/verify.ts)_

## `bf luis`

Manages LUIS assets on service and/or locally.

```
USAGE
  $ bf luis

OPTIONS
  -h, --help  LUIS command help
```

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/index.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/assignazureaccount.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/create.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/delete.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/import.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/list.ts)_

## `bf luis:application:publish`

Publishes application's version

```
USAGE
  $ bf luis:application:publish

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      (required) LUIS application Id (defaults to config:LUIS:appId)
  --direct                           Available only in direct version query. Do not publish to staging or production
  --endpoint=endpoint                LUIS endpoint hostname
  --staging                          Publishes application version to Staging slot, otherwise publish to production

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              (required) Version to publish (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:application:publish --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --versionId 
  {INITIAL_VERSION_ID} --appId {APP_ID} --staging {BOOLEAN}
```

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/publish.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/query.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/rename.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/application/show.ts)_

## `bf luis:build`

Build lu files to train and publish luis applications

```
USAGE
  $ bf luis:build

OPTIONS
  -f, --force                      If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help                       luis:build command help
  -i, --in=in                      Lu file or folder

  -o, --out=out                    Output folder name to write out .dialog and settings files. If not specified,
                                   application setting will be output to console

  --authoringKey=authoringKey      LUIS authoring key

  --botName=botName                Bot name

  --defaultCulture=defaultCulture  Culture code for the content. Infer from .lu if available. Defaults to en-us

  --deleteOldVersion               Deletes old version of LUIS application after building new one.

  --dialog=dialog                  Dialog recognizer type [multiLanguage|crosstrained]. No dialog recognizers will be
                                   generated if not specified. Only valid if --out is set

  --directVersionPublish           Available only in direct version query. Do not publish to staging or production

  --endpoint=endpoint              Luis authoring endpoint for publishing

  --fallbackLocale=fallbackLocale  Locale to be used at the fallback if no locale specific recognizer is found. Only
                                   valid if --out is set

  --isStaging                      Publishes luis application to staging slot if set. Default to production slot

  --log                            Writes out log messages to console

  --luConfig=luConfig              Path to config for lu build which can contain switches for arguments

  --region=region                  [default: westus] LUIS authoring region [westus|westeurope|australiaeast]

  --schema=schema                  Defines $schema for generated .dialog files

  --suffix=suffix                  Environment name as a suffix identifier to include in LUIS app name. Defaults to
                                   current logged in user alias

EXAMPLE

       $ bf luis:build --in {INPUT_FILE_OR_FOLDER} --authoringKey {AUTHORING_KEY} --botName {BOT_NAME}
```

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/build.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/convert.ts)_

## `bf luis:cross-train`

Lu and Qna cross train tool

```
USAGE
  $ bf luis:cross-train

OPTIONS
  -f, --force              If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help               Luis:cross-train command help
  -i, --in=in              Source lu and qna files folder

  -o, --out=out            Output folder name. If not specified, the cross trained files will be written to
                           cross-trained folder under folder of current command

  --config=config          Path to config file of mapping rules

  --intentName=intentName  [default: _Interruption] Interruption intent name

  --log                    Writes out log messages to console

  --inner-dialog            Only performs the inner dialog cross train, defalt is true, to set it as false, use --no-inner-dialog

  --intra-dialog            Only performs the intra dialog cross train, defalt is true, to set it as false, use --no-intra-dialog
```

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/cross-train.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/endpoints/list.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/generate/cs.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/generate/ts.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/test.ts)_

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
  --mode=mode                        Value specifying mode of training (Standard | Neural).

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              (required) Version to show training status (defaults to config:LUIS:versionId)

  --wait                             Wait until training complete and then display status

EXAMPLE

       $ bf luis:train:run --appId {APPLICATION_ID} --versionId {VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey 
  {SUBSCRIPTION_KEY}
```

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/train/run.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/train/show.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/translate.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/clone.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/delete.ts)_

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

  --exportLU                         Export format type as LU

  --subscriptionKey=subscriptionKey  (required) LUIS cognitive services subscription key (default:
                                     config:LUIS:subscriptionKey)

  --versionId=versionId              (required) Version to export (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:version:export --appId {APP_ID} --versionId {VERSION_ID} --out {FILENAME.json or PATH/FILENAME.json} 
  --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
```

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/export.ts)_

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

  --versionId=versionId              Version to import (defaults to config:LUIS:versionId)

EXAMPLE

       $ bf luis:version:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} --appId {APP_ID} --in 
  {PATH_TO_JSON} --versionId {VERSION_ID}
       $ echo {SERIALIZED_JSON} | bf luis:version:import --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY} 
  --appId {APP_ID}
```

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/import.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/list.ts)_

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

_See code: [@microsoft/bf-luis-cli](https://github.com/microsoft/botframework-cli/tree/master/packages/luis/src/commands/luis/version/rename.ts)_

## `bf orchestrator`

Display Orchestrator CLI available commands

```
USAGE
  $ bf orchestrator

OPTIONS
  -h, --help  Orchestrator commands help
```

_See code: [src\commands\orchestrator\index.ts]https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/index.ts)_


## `bf orchestrator:add`

Add examples from .lu/.qna/.json/.blu files, LUIS app(s) and QnaMaker kb(s) to Orchestrator snapshot file.

```
USAGE
  $ bf orchestrator:add

OPTIONS
  -d, --debug
  -h, --help                        Orchestrator add command help.
  -i, --in=in                       Path to example file (.lu/.qna/.json/.blu).
  -m, --model=model                 Path to Orchestrator base model directory.
  -e, --entityModel=entity-model    Path to Orchestrator entity base model directory.
  -o, --out=out                     Path where generated orchestrator example file will be placed.
                                    Default to current working directory.
  -t, --type                        Type of input (luis/qna/file).

  --id                              LUIS app id or QnAMaker kb id if type = luis/qna.                        
  --key                             LUIS authoring key or QnAMaker service key if type = luis/qna.
  --endpoint                        LUIS/QnAMaker endpoint.
  --routingName                     Routing name, default to file name.
  --dialog                          Generate multi language or cross train Orchestrator recognizers.

EXAMPLE

    $ bf orchestrator:add 	
    $ bf orchestrator:add --in ./path/to/file/ --snapshot ./path/to/snapshot/	
    $ bf orchestrator:add --in ./path/to/file/ --snapshot ./path/to/snapshot/ --out ./path/to/output/	
    $ bf orchestrator:add --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/model/directory
    $ bf orchestrator:add -t luis --id LUIS_APP_ID --version LUIS_APP_VERSION --key LUIS_KEY --routingname l_Weather --endpoint 
    $ bf orchestrator:add -t qna --id QNA_KB  --key QNA_KB_SERVICE_KEY --routingname q_kb
```

_See code: [src\commands\orchestrator\add.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/add.ts)_


## `bf orchestrator:create`

Create orchestrator snapshot (.blu) file from .lu/.qna/.json/.tsv/.dispatch files, which represent bot modules.

```
USAGE
  $ bf orchestrator:create

OPTIONS
  -d, --debug
  -h, --help                        Orchestrator create command help
  -i, --in=in                       The path to source label files from where orchestrator example file will
                                    be created from. Default to the current working directory.
                                    Valid file extensions are lu, .qna, .json and .tsv.
  -m, --model=model                 Path to Orchestrator base model directory.
  -e, --entityModel=entity-model    Path to Orchestrator entity base model directory.
  -o, --out=out                     Path where generated orchestrator example file will be placed.
                                    Default to current working directory.
  --hierarchical                    Add hierarchical labels based on lu/qna file name.

EXAMPLE

       $ bf orchestrator:create 
       $ bf orchestrator:create --in ./path/to/file/
       $ bf orchestrator:create --in ./path/to/file/ --out ./path/to/output/
       $ bf orchestrator:create --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/base/model/directory
```

_See code: [src\commands\orchestrator\create.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/create.ts)_

## `bf orchestrator:basemodel:get`

Gets Orchestrator base model

```
USAGE
  $ bf orchestrator:basemodel:get

OPTIONS
  -o, --out        Optional. Path to where Orchestrator base model will be saved to. Default to current working directory.
  --versionId      Optional. Base model version to download -- reference basemodel:list output for options.  If not specified, default model will be downloaded.
  -h, --help       Show CLI help
```

_See code: [src\commands\orchestrator\basemodel\get.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/basemodel/get.ts)_


## `bf orchestrator:basemodel:list`

Lists all Orchestrator base model versions

```
USAGE
  $ bf orchestrator:basemodel:list

OPTIONS
  -r, --raw        Optional. Raw output
  -h, --help       Show CLI help
```

_See code: [src\commands\orchestrator\basemodel\list.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/basemodel/list.ts)_

## `bf orchestrator:interactive`

A user can play with an Orchestrator base model interactively and improve a snapshot in real-time.

```
USAGE
  $ bf orchestrator:interactive --out=<analysis-and-output-folder> --model=<base-model-and-config-folder>
    [--entityModel=<entity-base-model-and-config-folder>]
    [--in=<previous-generated-blu-training-set-file>]

OPTIONS
  -d, --debug                       Print detailed debugging information during execution.
  -h, --help                        Orchestrator 'interactive' command help.
  -i, --in=in                       Optional path to a previously created Orchestrator .blu file.
                                    This argument is optional users can use the 'interactive' command
                                    to start an Orchestrator snapshot from scratch. The 'n' commandlet
                                    can save the utterance labels into a snapshot (.blu) file.
  -m, --model=model                 Directory or a config file hosting Orchestrator base model files.
  -e, --entityModel=entity-model    Path to Orchestrator entity base model directory.
  -o, --out=out                     Directory where analysis and output files will be placed.

DESCRIPTION

  The 'interactive' command is an interactive session that a user can access an Orchestrator model in real-time
  doing following:
    1) Predict the intent of an input utterance using the 'p' commandlet.
    2) Analyze a model example set, by executing the 'v' (validation) commandlet and produce an evaluation
       report in real-time.
    3) Add, remove, or change the intents of an input utterace using the 'a', 'r', and 'c' commandlets,
       respectively. Users can reference a validation report and choose an ambiguous, misclassified, or
       low-confidence utterance and change their intent labels.
    4) Remove some labels completely from the model example set using the 'rl' commandlet.
    5) Create a new model example set snapshot using the 'n' commandlet.

  Below is a list of the commandlets that can be issued during a 'interactive' session.

  Commandlets: h, q, d, s, u, cu, i, ci, ni, cni, q, p, v,
               vd, va, vm, vl, vat, vlt, vmt, vut, vo, a, r, c, rl, n
    h   - print this help message
    q   - quit
    d   - display utterance, intent label array inputs, Orchestrator config,
          and the label-index map
    s   - show label-utterance statistics of the model examples
    u   - enter a new utterance and save it as the "current" utterance input
    cu  - clear the "current" utterance input
    i   - enter an intent and add it to the "current" intent label array input
          (can be an index for retrieving a label from the label-index map)
    ci  - clear the "current" intent label array input
    ni  - enter an intent and add it to the "new" intent label array input
          (can be an index for retrieving a label from the label-index map)
    cni - clear the "new" intent label array input
    f   - find the "current" utterance if it is already in the model example set
    p   - make a prediction on the "current" utterance input
    v   - validate the model and save analyses (validation report) to
          "experiment_predicting_va\orchestrator_predicting_set_summary.html"
    vd  - reference a validation Duplicates report
          (previously generated by the "v" command) and enter an index
          for retrieving utterance/intents into "current"
    va  - reference a validation Ambiguous report
          (previously generated by the "v" command) and enter an index
          for retrieving utterance/intents into "current"
    vm  - reference a validation Misclassified report and enter an index
          (previously generated by the "v" command)
          for retrieving utterance/intents into "current"
    vl  - reference a validation LowConfidence report
          (previously generated by the "v" command) and enter an index
          for retrieving utterance/intents into "current"
    vat - enter a new validation-report ambiguous closeness threshold
    vlt - enter a new validation-report low-confidence threshold
    vmt - enter a new multi-label threshold
    vut - enter a new unknown-label threshold
    vo  - enter a boolean for obfuscating labels/utterances or not in evaluation reports
          generated by the "v" command'
    a   - add the "current" utterance and intent labels to the model example set
    r   - remove the "current" utterance and intent labels from the model example set
    c   - remove the "current" utterance's intent labels and then
          add it with the "new" intent labels to the model example set
    rl  - remove the "current" intent labels from the model example set
    n   - create a new snapshot of model examples and save it to
          "experiment_predicting_va\orchestrator_predicting_training_set.blu"

EXAMPLE

      $ bf orchestrator:interactive --out=resources\data\Columnar\InteractiveOutput --model=resources\data\Columnar\ModelConfig --in=resources\data\Columnar\Email.blu

      Notice that the ModelConfig folder is created by the 'bf orchestrator:basemodel:get' command.
      Inside the ".../ModelConfig" directory, there is a "config.json" that specifies downloaded base model files
      among other hyper parameters. Here is an example: 
      {
        "VocabFile": "vocab.txt",
        "ModelFile": "model.onnx",
        "Name": "pretrained.20200924.microsoft.dte.00.03.en.onnx",
        "Framework": "onnx",
        "Publisher": "Microsoft",
        "ModelType": "dte_bert",
        "Layers": 3,
        "EmbedderVersion": 1,
        "MinRequiredCoreVersion": "1.0.0"
      }

```

_See code: [src\commands\orchestrator\interactive.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/interactive.ts)_

## `bf orchestrator:query`

Query Orchestrator base model and a snapshot/train file.

```
USAGE
  $ bf orchestrator:query --model=<base-model-and-config-folder> --query=<query>
    [--entityModel=<entity-base-model-and-config-folder>]
    [--in=<previous-generated-blu-training-set-file>]
    [--limit=<limit-of-number-of-predictions>]

OPTIONS
  -d, --debug
  -h, --help                        Orchestrator query command help
  -i, --in=in                       Path to previously created Orchestrator snapshot (.blu file).
  -q, --query=query                 Query string to predict.
  -m, --model=model                 Path to Orchestrator base model directory.
  -e, --entityModel=entity-model    Path to Orchestrator entity base model directory.
  -l, --limit=#                     (optional) Limit of number of predictions.

EXAMPLE
       $ bf orchestrator:query --in ./path/to/blufile/ --query /query/string/to/predict 
       $ bf orchestrator:query --in ./path/to/blufile/ --query /query/string/to/predict --model ./path/to/base/model/directory
```

_See code: [src\commands\orchestrator\query.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/query.ts)_


## `bf orchestrator:test`

The "test" command can operate in three modes: test, evaluation, assessment.
  1) Test mode: test a collection of utterance/label samples loaded from a test file against
      a previously generated Orchestrator .blu snapshot/train file,
      and create a detailed train/test evaluation report.
  2) Evaluation mode: create an leave-one-out cross validation (LOOCV) evaluation report
      on a previously generated Orchestrator .blu snapshot/train file.
  3) Assessment mode: assess a collection of utterance/label predictions against their ground-truth labels and
      create an evaluation report. This mode can evaluate predictions produced by
      other NLP or machine learning systems. There is no need for an Orchestrator base model.
      Notice that, this mode is generic and can apply to evaluate any ML systems, learners, models,
      and scenarios if a user can carefully construct the prediction and grounf-truth files by
      the specification detailed below.
      Essentially the key to a NLP data instance is a text (utterance, sentence, query, document, etc.), which
      is the basis of all the features feeding to a ML model. For other ML systems, the key to
      a data instance can be built directly from the features and put in place of text
      in a prediction and ground-truth file.

  The 'test' mode is activated if there is a '--test' argument set for a test file.
  The 'assessment' mode is activated if there is a '--prediction' argument set for a prediction file.
  If there is no '--test' or '--prediction' arguments, then "test" command runs on the 'evaluation' mode.

  Please see below for detailed help messages on arguments and requirements for the three modes.
  Notice that the input specified by the '--in' parameter may be different from mode to mode.

_See code: [src\commands\orchestrator\test.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/test.ts)_

# `bf orchestrator:test -- test mode`

Test utterance/label samples from an input file and create an evaluation report.

```
USAGE
  $ bf orchestrator:test

OPTIONS
  -d, --debug                       Print detailed debugging information during execution.
  -h, --help                        Orchestrator 'test' command help.
  -i, --in=in                       Path to a previously created Orchestrator .blu file.
  -m, --model=model                 Directory or a config file hosting Orchestrator base model files.
  -e, --entityModel=entity-model    Path to Orchestrator entity base model directory.
  -o, --out=out                     Directory where analysis and output files will be placed.
  -t, --test=test                   Path to a test file, or comma-separated paths to
                                    a collection of test files -- most uselful for crosss-valiaton.

DESCRIPTION

  The 'test' mode can test an Orchestrator model and example snapshot set against a test utterance/intent file.
  It will generate evaluation reports and auxiliary files.
  This mode is activated if a "--test" argument is provided to the "test" command.
  Please refer to the 'evaluation' mode for details of the evaluation report.

EXAMPLE

      $ bf orchestrator:test --out=resources\data\Columnar\TestOutput --model=resources\data\Columnar\ModelConfig --in=resources\data\Columnar\Email.blu --test=resources\data\Columnar\EmailTest.txt

      Notice that the ModelConfig folder is created by the 'bf orchestrator:basemodel:get' command.
      Inside the ".../ModelConfig" directory, there is a "config.json" that specifies a downloaded base model files
      among other hyper parameters. Here is an example: 
      {
        "VocabFile": "vocab.txt",
        "ModelFile": "model.onnx",
        "Name": "pretrained.20200924.microsoft.dte.00.03.en.onnx",
        "Framework": "onnx",
        "Publisher": "Microsoft",
        "ModelType": "dte_bert",
        "Layers": 3,
        "EmbedderVersion": 1,
        "MinRequiredCoreVersion": "1.0.0"
      }
```
_See code: [src\commands\orchestrator\test.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/test.ts)_

# `bf orchestrator:test -- evaluation mode`

Create leave-one-out cross validation (LOOCV) evaluation reports and axuiliary files on
a previously generated Orchestrator .blu snapshot file.
This mode is activated if there is no "--test" or "--prediction" arguments provided to the "test" commands.

```
USAGE
  $ bf orchestrator:test

OPTIONS
  -d, --debug                     Print detailed debugging information during execution.
  -i, --in=in                     Path to a previously created Orchestrator .blu file.
  -o, --out=out                   Directory where analysis and output files will be placed.
  -m, --model=model               Optional directory or a config file hosting Orchestrator base model files.
  -e, --entityModel=entity-model  Path to Orchestrator entity base model directory.

DESCRIPTION

  The 'evaluation' mode executes a leave-one-out-cross-validation (LOOCV) analysis
  on a model and its example snapshot set. It also generates a detailed evaluation report
  with the following sections:

  >  Intent/utterance Statistics - label and utterance statistics and distributions.
  >  Duplicates - tables of utterance with multiple labels and exact utterance/label duplicates.
  >  Ambiguous - ambiguous predictions that there are some other label predictions whose
     scores are close to the correctly predicted labels. Ambiguity closeness is controlled by the "ambiguous" parameter, default to 0.2. I.e., if there is a prediction whose score is within 80% of
     the correctly predicted label score, then the prediction itself is considered "ambiguous."
  >  Misclassified - utterance's label labels were not scored the highest.
  >  Low Confidence - utterance label labels are scored the highest, but they are lower than a threshold.
     This threshold can be configured through the "lowConfidenceScoreThreshold" parameter, the default is 0.5.
  >  Metrics - test confisuon matrix metrics. Please reference the "assess" command description for details.

EXAMPLE

      $ bf orchestrator:test --out=resources\data\Columnar\EvaluationOutput --model=resources\data\Columnar\ModelConfig --in=resources\data\Columnar\Email.blu

      Notice that it is not required to load a model file if the input is already a snapshop .blu file.
      Nevertheless the ModelConfig folder is created by the 'bf orchestrator:basemodel:get' command.
      Inside the ".../ModelConfig" directory, there is a "config.json" that specifies downloaded base model files
      among other hyper parameters. Here is an example: 
      {
        "VocabFile": "vocab.txt",
        "ModelFile": "model.onnx",
        "Name": "pretrained.20200924.microsoft.dte.00.03.en.onnx",
        "Framework": "onnx",
        "Publisher": "Microsoft",
        "ModelType": "dte_bert",
        "Layers": 3,
        "EmbedderVersion": 1,
        "MinRequiredCoreVersion": "1.0.0"
      }
```

_See code: [src\commands\orchestrator\test.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/test.ts)_

# `bf orchestrator:test -- assessment mode`

Create an evaluation report on assessing prediction against ground-truth instances.
This command can execute an independent assessment of a prediction set against a ground-truth set,
it does not require a base model that other Orchestrator commands may need.
This mode is activated if a "--prediction" argument is provided to the "test" command.

```
USAGE
  $ bf orchestrator:test

OPTIONS
  -d, --debug                     Print detailed debugging information during execution.
  -i, --in=in                     Path to a ground-truth label file, or comma-separated paths to
                                  a collection of files -- most uselful for crosss-valiaton.
  -o, --out=out                   Directory where analysis and output files will be placed.
  -p, --prediction=prediction     Path to a prediction label file, or comma-separated paths to
                                  a collection of files -- most uselful for crosss-valiaton.

DESCRIPTION

  The "assessment" mode compares a prediction file against a ground-truth file, then
  generates two detailed evaluation reports, one for intent prediction and the other entity, along with some
  auxiliary files.
  The input files can be in LU, LUIS, QnA Maker, TSV, or a special JSON label array format (described below).

  This command intends to provide a comprehensive and consistent multi-class model evaluation tool in
  order to avoid teams reporting their own inconsistent evaluation metrics, especially in a contest
  evaluating competitive technology or models. Below are some sources of evaluation inconsistencies if
  evaluation were conducted and metrics reported by the teams themselves:

  1)  Metric - one team may report Micro-Average, Macro Average, or else. As shown below,
        there can be many ways in computing a metric average, and
        the discrepancy can be huge using different averaging formulations.
        Sometimes the definition of a metric, say macro average, can even vary among different teams.
  2)  Datasets – even though every party tests on the same dataset source, the dataset might diverge
        after a while after some data massaging, sometimes due to processing errors or filtering logic.
        Some teams may prefer some datasets, but not others, for their particular technology or models.
  3)  Data processing – some test dataset can contain duplicate utterances and labels.
        De-duplicate or not can affect final metric calculation. 
  4)  Confusion matrix formulation – what is a TP, FP, TN, or FN? 
        Even though their textbook definition is clear, they can still be up to interpretation
        in real world scenarios. For example, TN may not make sense in evaluating entity extracting.
  5)  Label interpretation – Sometimes people might ignore some test results if their prediction
        scores are too low. We should have a consistent way to include those predictions. On entity, some
        people may choose to evaluate based on per-token tags, instead of per-entuty-mention. 
  6)  Label processing – what is an UNKNOWN label? Different teams may have their unique strategies
        in processing empty, UNKNOWN, or never-seen-before labels in the ground-truth and prediction files.
  7)  Evaluation Tool – every team has their own tools that might not be consistent in metric computation.

  The "assessment" mode aims to address these issues:

  1)  Metric -- the "assess" command calculates many average/aggregate metrics to satisfy a variety of evaluation
      needs and metric definitions.
      Which metric to focus on for decision-making is up to an evaluation committee or stakeholders.
      The tool has no bias, even though each party might have its favorites for its own agenda.
  2)  Datasets -- it's necessary to create a dataset repo for the community to share
      ground-truth datasets and predictions. Again it’s up to an evaluation committee or individual party to choose the
      evaluation datasets (and performance metrics) compatible with their projects and scenarios.
  3)  Data processing – this BF-orchestrator evaluation package provides consistent logic in processing datasets.
      For example, it does de-duplication, so an utterance and its label won’t contribute more than once
      in metric calculation.
  4)  Confusion matrix formulation – again, this BF evaluation package provides consistent formulation logic in
      intepreting the 4 confusion matrix cells.
      For example, entity evaluation does not have TN as the combinations of entity offset and length not in
      the ground-truth or predicted set can be limitless.
  5)  Label interpretation – again, consistent is key and this "assess" command does not silently
      ignore some test results for whatever reasons. Every test instance should contribute to
      metric calculation unless they are spurious (test intent/entity name not in the training set)
      – due to processing mistakes by whoever prepared it. 
  6)  Label processing – this BF-Orchestrator package pre-processes labels and treats
      an utterance’s empty, None, and never-seen-before labels as UNKNOWN. Since BF-Orchestrator allows
      multi-label intents for utterances, UNKNOWN is stripped if it con-exists with known labels
      for an utterance.
  7)  Evaluation Tool – BF-Orchestrator has been released to the world (through NPM), everyone
      in the world can run it, file a bug or PR to improve it.
      It’s not a script hidden in someone's laptop or some team repo.

  Besides addressing these evaluation inconsistency issues, the "assess" command also produces a
  comprehensive metric report as well as label and utterance distributions.

INPUT

  The input ground-truth and predictions files can be in LU, LUIS, QnA Maker, TXT, TSV or a special JSON array format.
  The TXT file format only supports intent labels and it must have 2 columns, 'labels' and 'utterance',
  sepatated by a TAB. The 'labels' column can contains multiple labels delimited by camma.

  For entitiy labels, a user can choose LU, LUIS, or a JSON array format
  that each entry contains a labeled utterance following the schema and example shown below.
  In the array, each JSON entry has a "text" attribute for an utterance. The utterance can have an array pf
  "intents." The utterance can also has an array of "entities."
  Each entity entry contains an "entity" attribute for its name, a "startPos" attribute indicating the offset
  of the entry in the utterance, and a "endPos" attribute for the final location of the entity
  in the utterance. The entity can have some optional fields, such as a "text" attribute
  for a entity mention within the utterance, however this attribute is only for debugging purpose and not consumed
  for the "assess" command.

    [
    {
      "text": "I want to see Medal for the General",
      "intents": [
        "None"
      ],
      "entities": [
        {
          "entity": "movie_name",
          "startPos": 14,
          "endPos": 34,
          "text": "Medal for the General"
        }
      ]
    },
    ...
    ]

REPORT

  The "assess" command reads the input ground-truth and prediction JSON files and generates
  distributions of the utterances and their labels. It also groups each utterance's
  ground-truth and prediction intent and entity labels together, compares them, and determines if
  a prediction is in the ground-truth or vice versa. Using these analyese, the "assess" command
  generates HTML reports and some auxiliary files at the end.
  One report is for intent evaluation and the other for entity.

  Each report has the following sections:

  >  Ground-Truth Label/Utterance Statistics - ground-truth label and utterance statistics and distributions.
  >  Ground-Truth Duplicates - tables of ground-truth utterances with multiple labels and exact utterance/label duplicates.
  >  Prediction Label/Utterance Statistics - prediction label and utterance statistics and distributions.
  >  Prediction Duplicates - tables of prediction utterances with multiple labels and exact utterance/label duplicates.
  >  Misclassified - utterances with false-positive and false-negative predictions.
  >  Metrics - confisuon matrix metrics.

  In the Metrics section, the Orchestrator "assess" command first generates a series of per-label
  binary confusion matrices.
  Each binary confusion matrix is comprised of 4 cells: true positive (TP), false positive (FP), true negative (TN),
  and false negative (FN). Using these 4 cells, Orchestrator can compute several other confusion
  matrix metrics, including precision, recall, F1, accuracy, and support, etc.
  Please reference https://en.wikipedia.org/wiki/Confusion_matrix for details.

  Notice that the logic constructing a per-label confusion matrix is a little diffenent between intent
  and entity labels. Here are the logic outlines:

  Intent - the "assess" command iterates through one ground-truth utterance at a time
        and compare its ground-truth intent array and prediction intent array. If a label is in
        both arrays, then this utterance is a TP for the label's confusion matrix. If a label only exists in
        the prediction array, then it's a FP for the predicted label's confusion matrix. Similarly
        if a label only exists in the ground-truth array, then it's a FN for the ground-truth label's confusion
        matrix. For any other labels, the utterance is a TN for their confusion matrices.

  Entity - the "assess" command iterates through one ground-truth utterance at a time
        and compare its ground-truth entity array and prediction entity array.
        If an entity mention exists in both array, then it's a TP for the entity label's confusion matrix.
        An entity mention is comprised of the entity name (label), start position in the utterance, and the length
        of the entity mention. An entity mention is considered a match to another only if these three components
        are exactly the same.
        FP and FN logic is similar to those for intent. However, there is no TN for evaluating entity mentions
        as there can be too many possible entity mention candidates for an utterance when consider the start-position
        and entity length.
        On the other hand, number of intent labels for an utterance is usually one or a small number.
        It is still possible to define a custom TN logic, such as
        an entity label is a TN if it does not exist in an utterance's ground-truth or prediction label arrays at all.
        However as some important metrics such as precision, recall, and their combination (F1) do not rely on TN,
        so that it's really not necessary to collect TN for evaluating entity predictions.

  By the way, sometimes an erroneous prediction file can contain some labeled utterances not in the ground-truth
  file. These utterances are called spurious, and they will be listed under the "Prediction Duplicates" tab
  in an evaluation report called "Spurious utterance and label pairs."

  Once the serial of per-label binary confusion matrices are built, there are plenty of
  per-label metrics, which can then be aggregated using several diverse averaging schemes.
  An evaluation report's "Metrics" tab contains several of them:

  0) Micro-Average - Orchestrator is essentially a multi-class ML learner and model, so evaluation can also be expressed
        as a multi-class confusion matrix, besides the series of binary per-label confusion matrices
        mentioned above. In such a multi-class confusion matrix, every prediction is a positive and
        there is no negative. The diagonal cells of this multi-class confusion matrix are
        the TPs. The micro-average metric is the ratio of the sum of TPs over total. Total is the sum
        of all the supports (#positives) aggregated from the series of binary confusion matrices.
  1) Micro-First-Quartile - use the series of binary confusion matrices, sort them by a metric (e.g., F1) value,
        and crate an bucket array that each bucket contain the per-label binary confusion matrix metric value as well
        as the per-label support. From this metric-support array, the micro-first-quartile metric is
        the metric value from the entry at the first quartile position in the bucket array.
  2) Micro-Median - similar to Micro-First-Quartile, but at the second-quartile position, i.e., median.
  3) Micro-Third-Quartile - similar to Micro-First-Quartile, but at the third-quartile position.
  4) Macro-First-Quartile - use the series of binary confusion matrices, sort them by a metric (e.g., F1) value,
        and crate a simple array of the per-label binary confusion matrix metrics. From this metric array, the
        macro-first-quartile metric is the metric value at the first quartile position.
  5) Macro-Median - similar to Macro-First-Quartile, but at the second-quartile position, i.e., median.
  6) Macro-Third-Quartile - similar to Macro-First-Quartile, but at the third-quartile position.
  7) Summation Micro-Average - the second way coalescing the series of binary confusion matrices into one is by
        summing up their TP, FP, TN, FN numbers. These 4 summations are then formed as one binary confusion
        matrix and can be used to calculate overall precision, recall, F1, and accuracy.
  8) Macro-Average - another way coalescing the series of binary confusion matrices simply takes
        arithmetic average of every metrics individually. The denominator for computing the averages
        is the number of labels existed in the ground-truth set.
  9) Summation Macro-Average - While macro-average takes a simple arithmetic average on every metrics.
        Summation macro-average only takes the average on the 4 confusion matrix cells, TP, FP, TN, and FN.
        Precision, recall, F1, and accuracy are then calculated by the 4 averaged cells.
  10) Positive Support Macro-Average - some prediction file may not contain all the ground-truth utterances
        and may lack predictions for some ground-truth labels completely. The averaging denominator for this metric
        uses the number of prediction labels, i.e., number of the labels with a greater-than-zero support.
  11) Positive Support Summation Macro-Average - this metric is similar to 3), but use 4)'s denominator.
  12) Weighted Macro-Average - this metric averaging approach takes an weighted average of the series of binary
        per-label confusion matrices. The weights are the per-label prevalences, which are listed in the
        "Ground-Truth Label/Utterance Statistics" tab.
  13) Weighted Summation Macro-Average - similar to 6), but the weighted average only applies to
        the 4 confusion matrix cells. Weighted TP, FP, TN, FN are then used to calculate precision, recall, F1, and
        accuracy.
  14) Multi-Label Exact Aggregate - Orchestrator supports evaluating multi-label intents for each utterance.
        I.e., an utterance can belong to more than one categories (intents). For a multi-intent application, a model can
        actually generate spurious (too many) intent predictions that can still boost the "per-label" metrics
        described thus far. In a "per-label" metric, every label (an instance can have more than one label)
        can contribute to metric computation, therefore some instances may contribute more to metric
        calculation more then others.
        To counter this problem, Multi-Label Exact Aggreagate is a "per-instance" metric that it builds
        a binary confusion matrix directly and an instance can only contribute to metric computation once
        disregard the number of labels it has.
        An utterance is only a TP if a non-empty prediction's intent array is exactly equal to the ground-truth array. If a prediction's intent array contains at least one label not in the ground-truth array,
        then this utterance is a FP. Then, if an utterance's ground-truth intent array contains at least
        one label not in the prediction intent array, then this utterance is a FN. A TN only happens if both arrays
        are empty. Notice that this metric only applies to multi-intent predictions, it is not calculated for
        evaluating entity predictions.
  15) Multi-Label Subset Aggregate - Similar to Multi-Label Exact Aggregate, but this metric's TP logic is less
        restrictive.
        An utterance is only a TP if a prediction's intent array is a non-empty subset of the ground-truth array. If a prediction's intent array contains at least one label not in the ground-truth array,
        then this utterance is a FP. If an utterance's prediction intent array is empty while it's not
        for the ground-truth intent array, then this utterance is a FN. A TN only happens if both arrays
        are empty. Notice that this metric only applies to multi-intent predictions, it is not calculated for
        evaluating entity predictions.

EXAMPLE

      $ bf orchestrator:test --out=resources\data\EvaluationJsonFormat\AssessmentOutput \
      --in=resources\data\EvaluationJsonFormat\orchestrator_testing_set_ground_truth_instances.json \
      --prediction=resources\data\EvaluationJsonFormat\orchestrator_testing_set_prediction_instances.json
```

_See code: [src\commands\orchestrator\test.ts]https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/test.ts)_

## `bf plugins`

Install, uninstall and show installed plugins

```
USAGE
  $ bf plugins

OPTIONS
  --help  Display plugins commands help.
```

_See code: [@microsoft/bf-cli-plugins](https://github.com/microsoft/botframework-cli/tree/master/packages/plugins/src/commands/plugins/index.ts)_

## `bf plugins:install PLUGIN`

Installs a plugin into the BF CLI

```
USAGE
  $ bf plugins:install PLUGIN

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a user-installed plugin will override a core plugin.
  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command 
  will override the core plugin implementation. 
  This is useful if a user needs to update core plugin functionality in the CLI without the need to patch and update the 
  whole CLI.

ALIASES
  $ bf plugins:add
```

_See code: [@microsoft/bf-cli-plugins](https://github.com/microsoft/botframework-cli/tree/master/packages/plugins/src/commands/plugins/install.ts)_

## `bf plugins:list`

List installed plugins

```
USAGE
  $ bf plugins:list

OPTIONS
  --core  show core plugins
```

_See code: [@microsoft/bf-cli-plugins](https://github.com/microsoft/botframework-cli/tree/master/packages/plugins/src/commands/plugins/list.ts)_

## `bf plugins:uninstall [PLUGIN]`

Removes a plugin from the BF CLI

```
USAGE
  $ bf plugins:uninstall [PLUGIN]

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@microsoft/bf-cli-plugins](https://github.com/microsoft/botframework-cli/tree/master/packages/plugins/src/commands/plugins/uninstall.ts)_

## `bf qnamaker`

QnA Maker

```
USAGE
  $ bf qnamaker

OPTIONS
  -h, --help  Display QnA Maker CLI available commands
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/index.ts)_

## `bf qnamaker:alterations`

Commands for replacing and listing your alterations

```
USAGE
  $ bf qnamaker:alterations

OPTIONS
  -h, --help  display qnamaker:alterations available commands
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/alterations/index.ts)_

## `bf qnamaker:alterations:list`

Downloads all word alterations (synonyms) that have been added by the user.

```
USAGE
  $ bf qnamaker:alterations:list

OPTIONS
  -h, --help                         qnamaker:alterations:list command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/alterations/list.ts)_

## `bf qnamaker:alterations:replace`

Replaces word alterations (synonyms) for the KB with the give records.

```
USAGE
  $ bf qnamaker:alterations:replace

OPTIONS
  -h, --help                         qnamaker:alterations:replace command help
  -i, --in=in                        File path to the WordAlterationsDTO object to send in the body of the request
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/alterations/replace.ts)_

## `bf qnamaker:build`

Build .qna files to create or update qnamaker knowledge bases and qnamaker alterations

```
USAGE
  $ bf qnamaker:build

OPTIONS
  -b, --botName=botName                  Bot name

  -f, --force                            If --out flag is provided with the path to an existing file, overwrites that
                                         file

  -h, --help                             qnamaker:build command help

  -i, --in=in                            Source .qna file or folder

  -o, --out=out                          Output folder name to write out .dialog and settings files. If not specified,
                                         knowledge base setting will be output to console

  -s, --subscriptionKey=subscriptionKey  QnA maker subscription key

  --defaultCulture=defaultCulture        Culture code for the content. Infer from .qna if available. Defaults to en-us
                                         if not set

  --dialog=dialog                        Dialog recognizer type [multiLanguage|crosstrained]. No dialog recognizers will
                                         be generated if not specified. Only valid if --out is set

  --endpoint=endpoint                    Qnamaker authoring endpoint for publishing

  --fallbackLocale=fallbackLocale        Locale to be used at the fallback if no locale specific recognizer is found.
                                         Only valid if --out is set

  --log                                  Writes out log messages to console

  --qnaConfig=qnaConfig                  Path to config for qna build which can contain switches for arguments

  --region=region                        [default: westus] Overrides public endpoint
                                         https://<region>.api.cognitive.microsoft.com/qnamaker/v4.0/

  --schema=schema                        Defines $schema for generated .dialog files

  --suffix=suffix                        Environment name as a suffix identifier to include in qnamaker kb name.
                                         Defaults to current logged in user alias

EXAMPLE

       $ bf qnamaker:build --in {INPUT_FILE_OR_FOLDER} --subscriptionKey {SUBSCRIPTION_KEY} --botName {BOT_NAME}
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/build.ts)_

## `bf qnamaker:convert`

Converts .qna file(s) to QnA application JSON models or vice versa.

```
USAGE
  $ bf qnamaker:convert

OPTIONS
  -f, --force    If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help     qnamaker:convert help
  -i, --in=in    Source .qna file(s) or QnA KB JSON file
  -o, --out=out  Output file or folder name. If not specified stdout will be used as output
  -r, --recurse  Indicates if sub-folders need to be considered to file .qna file(s)
  --alterations  Indicates if files is QnA Alterations
  --log          Enables log messages
  --name=name    Name of the QnA KB
  --sort         When set, questions collections are alphabetically sorted are alphabetically sorted in .qna files
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/convert.ts)_

## `bf qnamaker:cross-train`

Lu and Qna cross train tool

```
USAGE
  $ bf qnamaker:cross-train

OPTIONS
  -f, --force              If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help               luis:cross-train command help
  -i, --in=in              Source lu and qna files folder

  -o, --out=out            Output folder name. If not specified, the cross trained files will be written to
                           cross-trained folder under folder of current command

  --config=config          Path to config file of mapping rules

  --intentName=intentName  [default: _Interruption] Interruption intent name

  --log                    Writes out log messages to console
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/cross-train.ts)_

## `bf qnamaker:endpointkeys`

Commands to refresh and list keys

```
USAGE
  $ bf qnamaker:endpointkeys

OPTIONS
  -h, --help  display qnamaker:endpointkeys available commands
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/endpointkeys/index.ts)_

## `bf qnamaker:endpointkeys:list`

List all the currently valid endpointKeys for querying your private endpoint

```
USAGE
  $ bf qnamaker:endpointkeys:list

OPTIONS
  -h, --help                         qnamaker:endpointkeys:list command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/endpointkeys/list.ts)_

## `bf qnamaker:endpointkeys:refresh`

Re-generates an endpoint key, in case you suspect your keys have been compromised

```
USAGE
  $ bf qnamaker:endpointkeys:refresh

OPTIONS
  -h, --help                         qnamaker:endpoints:refresh command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --keyType=keyType                  (required) Type of Key. (PrimaryKey/SecondaryKey)

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/endpointkeys/refresh.ts)_

## `bf qnamaker:endpointsettings`

Commands to get and update endpoint settings

```
USAGE
  $ bf qnamaker:endpointsettings

OPTIONS
  -h, --help  display qnamaker:update available commands
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/endpointsettings/index.ts)_

## `bf qnamaker:endpointsettings:get`

Gets endpoint settings for an endpoint.

```
USAGE
  $ bf qnamaker:endpointsettings:get

OPTIONS
  -h, --help                         qnamaker:endpointsettings:get command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --kbId=kbId                        Knowledgebase id to get metadata.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/endpointsettings/get.ts)_

## `bf qnamaker:endpointsettings:update`

Updates endpoint settings for an endpoint.

```
USAGE
  $ bf qnamaker:endpointsettings:update

OPTIONS
  -h, --help                         qnamaker:endpointsettings:update command help
  --activelearning                   Enable active learning. Disables if flag not set
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/endpointsettings/update.ts)_

## `bf qnamaker:init`

Initializes the config file with settings.

```
USAGE
  $ bf qnamaker:init

OPTIONS
  -h, --help           qnamaker:init command help
  --endpoint=endpoint  Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/init.ts)_

## `bf qnamaker:kb`

Commands for manipulating your knowledge base

```
USAGE
  $ bf qnamaker:kb

OPTIONS
  -h, --help  display qnamaker:kb available commands
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/kb/index.ts)_

## `bf qnamaker:kb:create`

Creates a new knowledgebase

```
USAGE
  $ bf qnamaker:kb:create

OPTIONS
  -h, --help                         qnamaker:kb:create command help
  -i, --in=in                        File path to the CreateKbDTO object to send in the body of the request.
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --name=name                        Name of the kb you want to create. This will override the name of KB that might be
                                     present in the CreateKb DTO

  --save                             Save the kbId in config.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/kb/create.ts)_

## `bf qnamaker:kb:delete`

Delete a knowledgebase by id

```
USAGE
  $ bf qnamaker:kb:delete

OPTIONS
  -h, --help                         qnamaker:kb:delete command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --force                            Do not prompt for confirmation, force the operation

  --kbId=kbId                        Knowledgebase id to be deleted. Overrides the knowledge base id present in the
                                     config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/kb/delete.ts)_

## `bf qnamaker:kb:export`

Echos a knowledgebase in json or qna format to stdout

```
USAGE
  $ bf qnamaker:kb:export

OPTIONS
  -f, --force                        If --out flag is provided with the path to an existing file, overwrites that file.
  -h, --help                         qnamaker:kb:export command help
  -o, --out=out                      Output file path. If not specified stdout will be used as output.
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --environment=environment          [default: Prod] Specifies whether environment is Test or Prod.

  --kbId=kbId                        Knowledgebase id to be exported. Overrides the knowledge base id present in the
                                     config

  --qnaFormat                        Specifies if the content should be exported to .qna format.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/kb/export.ts)_

## `bf qnamaker:kb:get`

Get metadata about a knowledgebase

```
USAGE
  $ bf qnamaker:kb:get

OPTIONS
  -h, --help                         qnamaker:kb:get command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --kbId=kbId                        Knowledgebase id to get metadata. Overrides the knowledge base id present in the
                                     config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/kb/get.ts)_

## `bf qnamaker:kb:list`

List all of your knowledgebases

```
USAGE
  $ bf qnamaker:kb:list

OPTIONS
  -h, --help                         qnamaker:kb:list command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/kb/list.ts)_

## `bf qnamaker:kb:publish`

Publish all unpublished in the knowledgebase to the prod endpoint.

```
USAGE
  $ bf qnamaker:kb:publish

OPTIONS
  -h, --help                         qnamaker:kb:publish command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --kbId=kbId                        Knowledgebase id to pubish. Overrides the knowledge base id present in the config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/kb/publish.ts)_

## `bf qnamaker:kb:replace`

Replace a knowledgebase contents with new contents

```
USAGE
  $ bf qnamaker:kb:replace

OPTIONS
  -h, --help                         qnamaker:kb:replace command help

  -i, --in=in                        File path to the ReplaceKbDTO object to send in the body of the request.
                                     Alternately this can be path to a .qna file

  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --kbId=kbId                        Knowledgebase id. Overrides the knowledge base id present in the config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/kb/replace.ts)_

## `bf qnamaker:kb:update`

Add or delete QnA Pairs and / or URLs to an existing knowledge base

```
USAGE
  $ bf qnamaker:kb:update

OPTIONS
  -h, --help                         qnamaker:kb:update command help

  -i, --in=in                        The file path to the UpdateKbOperationDTO object to send in the body of the
                                     request.

  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --kbId=kbId                        Knowledgebase id. Overrides the knowledge base id present in the config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config

  --wait                             Wait for the operation to complete.
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/kb/update.ts)_

## `bf qnamaker:operationdetails`

Command to get operation details

```
USAGE
  $ bf qnamaker:operationdetails

OPTIONS
  -h, --help  display qnamaker:operationdetails available commands
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/operationdetails/index.ts)_

## `bf qnamaker:operationdetails:get`

Gets details of a specific long running operation.

```
USAGE
  $ bf qnamaker:operationdetails:get

OPTIONS
  -h, --help                         qnamaker:operationdetails:get command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --operationId=operationId          (required) Operation id.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/operationdetails/get.ts)_

## `bf qnamaker:query`

Generate Answer for fetching the answer from Kb for a query

```
USAGE
  $ bf qnamaker:query

OPTIONS
  -h, --help                       qnamaker:query command help
  --context=context                Path to Context object json file with previous QnA

  --endpointKey=endpointKey        Specifies the endpoint key for your private QnA service (From qnamaker.ai portal user
                                   settings page). Overrides the value present in config

  --hostname=hostname              Specifies the url for your private QnA service. Overrides the value present in config

  --kbId=kbId                      Specifies the active qnamaker knowledgebase id. Overrides the value present in the
                                   config

  --qnaId=qnaId                    Exact qnaId to fetch from the knowledgebase, this field takes priority over question

  --question=question              (required) Query to get a prediction for

  --scorethreshold=scorethreshold  Specifies the confidence score threshold for the returned answer.

  --strictfilters=strictfilters    Path to json file with MetadataDTO[] e.g {"strictfilters": MetadataDTO[]}

  --test                           Query against the test index

  --top=top                        Specifies the number of matching results
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/query.ts)_

## `bf qnamaker:train`

Train call to add suggestions to the knowledgebase.

```
USAGE
  $ bf qnamaker:train

OPTIONS
  -h, --help                         qnamaker:get:kb command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the value present in config.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in
                                     config.

  --in=in                            File path to the FeedbackRecordDTO object to send in the body of the request.

  --kbId=kbId                        Specifies the active qnamaker knowledgebase id. Overrides the value present in the
                                     config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/train.ts)_

## `bf qnamaker:translate`

Translate given QnA maker application JSON model or qna file(s)

```
USAGE
  $ bf qnamaker:translate

OPTIONS
  -f, --force                  If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help                   qnamaker:translate help
  -i, --in=in                  Source .qna file(s) or QnA maker application JSON model
  -o, --out=out                Output folder name. If not specified stdout will be used as output
  -r, --recurse                Indicates if sub-folders need to be considered to find .qna file(s)
  --srclang=srclang            Source lang code. Auto detect if missing.
  --tgtlang=tgtlang            (required) Comma separated list of target languages.
  --translate_comments         When set, machine translate comments found in .qna file
  --translate_link_text        When set, machine translate link description in .qna file
  --translatekey=translatekey  (required) Machine translation endpoint key.
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/tree/master/packages/qnamaker/src/commands/qnamaker/translate.ts)_
<!-- commandsstop -->
