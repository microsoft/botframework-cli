botframework-cli
================

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/botframework-cli)](https://www.npmjs.com/package/@microsoft/botframework-cli)
[![Downloads](https://img.shields.io/npm/dt/@microsoft/botframework-cli)](https://github.com/microsoft/botframework-cli)
[![License](https://img.shields.io/npm/l/@microsoft/botframework-cli)](https://github.com/microsoft/botframework-cli/blob/master/packages/cli/package.json)

# Usage

```sh-session
$ npm install -g @microsoft/botframework-cli

```

# Commands
<!-- commands -->
* [`bf chatdown`](#bf-chatdown)
* [`bf chatdown:convert`](#bf-chatdownconvert)
* [`bf config`](#bf-config)
* [`bf config:set:qnamaker`](#bf-configsetqnamaker)
* [`bf config:set:telemetry`](#bf-configsettelemetry)
* [`bf config:show`](#bf-configshow)
* [`bf config:show:qnamaker`](#bf-configshowqnamaker)
* [`bf config:show:telemetry`](#bf-configshowtelemetry)
* [`bf help [COMMAND]`](#bf-help-command)
* [`bf luis`](#bf-luis)
* [`bf luis:convert`](#bf-luisconvert)
* [`bf luis:generate:cs`](#bf-luisgeneratecs)
* [`bf luis:generate:ts`](#bf-luisgeneratets)
* [`bf luis:translate`](#bf-luistranslate)
* [`bf qnamaker`](#bf-qnamaker)
* [`bf qnamaker:alterations`](#bf-qnamakeralterations)
* [`bf qnamaker:alterations:list`](#bf-qnamakeralterationslist)
* [`bf qnamaker:alterations:replace`](#bf-qnamakeralterationsreplace)
* [`bf qnamaker:convert`](#bf-qnamakerconvert)
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

Converts chat dialog files in <filename>.chat format into transcript file. Writes corresponding <filename>.transcript for each .chat file

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
  -h, --help  config:show help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/show.ts)_

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

## `bf luis`

Converts, translates luis/lu files or generates source code.

```
USAGE
  $ bf luis

OPTIONS
  -h, --help  Display Luis available commands
```

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/tree/master/packages/lu/src/commands/luis/index.ts)_

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

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/tree/master/packages/lu/src/commands/luis/convert.ts)_

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

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/tree/master/packages/lu/src/commands/luis/generate/cs.ts)_

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

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/tree/master/packages/lu/src/commands/luis/generate/ts.ts)_

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

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/tree/master/packages/lu/src/commands/luis/translate.ts)_

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

## `bf qnamaker:convert`

Converts .lu file(s) to QnA application JSON models or vice versa.

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

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/tree/master/packages/lu/src/commands/qnamaker/convert.ts)_

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

Echos a knowledgebase json to stdout

```
USAGE
  $ bf qnamaker:kb:export

OPTIONS
  -h, --help                         qnamaker:kb:export command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --environment=environment          (required) Specifies whether environment is Test or Prod.

  --kbId=kbId                        Knowledgebase id to be exported. Overrides the knowledge base id present in the
                                     config

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
  -i, --in=in                        File path to the ReplaceKbDTO object to send in the body of the request
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

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/tree/master/packages/lu/src/commands/qnamaker/translate.ts)_
<!-- commandsstop -->
