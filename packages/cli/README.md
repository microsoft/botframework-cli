botframework-cli
================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/botframework-cli.svg)](https://www.npmjs.com/package/@microsoft/botframework-cli)
[![Downloads/week](https://img.shields.io/npm/dw/botframework-cli.svg)](https://www.npmjs.com/package/@microsoft/botframework-cli)
[![License](https://img.shields.io/npm/l/botframework-cli.svg)](https://github.com/microsoft/botframework-cli/blob/master/packages/cli/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @microsoft/botframework-cli
$ bf COMMAND
running command...
$ bf (-v|--version|version)
@microsoft/botframework-cli/1.0.0 darwin-x64 node-v12.1.0
$ bf --help [COMMAND]
USAGE
  $ bf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bf `](#bf-)
* [`bf chatdown`](#bf-chatdown)
* [`bf config`](#bf-config)
* [`bf config:get`](#bf-configget)
* [`bf config:qnamaker:set`](#bf-configqnamakerset)
* [`bf config:telemetry`](#bf-configtelemetry)
* [`bf config:telemetry:disable`](#bf-configtelemetrydisable)
* [`bf config:telemetry:enable`](#bf-configtelemetryenable)
* [`bf help [COMMAND]`](#bf-help-command)
* [`bf qnamaker`](#bf-qnamaker)
* [`bf qnamaker:create:kb`](#bf-qnamakercreatekb)
* [`bf qnamaker:delete:kb`](#bf-qnamakerdeletekb)
* [`bf qnamaker:export:kb`](#bf-qnamakerexportkb)
* [`bf qnamaker:get`](#bf-qnamakerget)
* [`bf qnamaker:get:kb`](#bf-qnamakergetkb)
* [`bf qnamaker:get:operationdetails`](#bf-qnamakergetoperationdetails)
* [`bf qnamaker:init`](#bf-qnamakerinit)
* [`bf qnamaker:list`](#bf-qnamakerlist)
* [`bf qnamaker:list:alterations`](#bf-qnamakerlistalterations)
* [`bf qnamaker:list:endpointkeys`](#bf-qnamakerlistendpointkeys)
* [`bf qnamaker:list:kbs`](#bf-qnamakerlistkbs)
* [`bf qnamaker:publish:kb`](#bf-qnamakerpublishkb)
* [`bf qnamaker:query`](#bf-qnamakerquery)
* [`bf qnamaker:refresh:endpointkeys`](#bf-qnamakerrefreshendpointkeys)
* [`bf qnamaker:replace`](#bf-qnamakerreplace)
* [`bf qnamaker:replace:alterations`](#bf-qnamakerreplacealterations)
* [`bf qnamaker:replace:kb`](#bf-qnamakerreplacekb)
* [`bf qnamaker:update:kb`](#bf-qnamakerupdatekb)

## `bf `

The config plugin allows users to configure various settings within the cli.

```
USAGE
  $ bf

OPTIONS
  -h, --help  show CLI help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/index.ts)_

## `bf chatdown`

Converts chat dialog files in <filename>.chat format into transcript file. Writes corresponding <filename>.transcript for each .chat file

```
USAGE
  $ bf chatdown

OPTIONS
  -c, --chat=chat              The path of the chat file to be parsed. If omitted, stdin will be used.

  -f, --folder=folder          Path to directory and/or all subdirectories containing chat files to be processed all at
                               once, ex. ./**/*.chat. If an output directory is not present (-o), it will default the
                               output to the current working directory.

  -h, --help                   Chatdown command help

  -o, --out_folder=out_folder  Path to the directory where the output of the multiple chat file processing (-f) will be
                               placed.

  -p, --prefix                 Prefix stdout with package name.

  -s, --static                 Use static timestamps when generating timestamps on activities.

EXAMPLE

     $ bf chatdown
     $ bf chatdown --chat=./path/to/file/sample.chat
     $ bf chatdown -f ./test/utils/*.sample.chat -o ./
     $ (echo user=Joe && [ConversationUpdate=MembersAdded=Joe]) | bf chatdown --static
```

_See code: [@microsoft/bf-chatdown](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/chatdown.ts)_

## `bf config`

The config plugin allows users to configure various settings within the cli.

```
USAGE
  $ bf config

OPTIONS
  -h, --help  show CLI help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/index.ts)_

## `bf config:get`

Displays the config file

```
USAGE
  $ bf config:get

OPTIONS
  -h, --help  show CLI help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/get.ts)_

## `bf config:qnamaker:set`

Set the QnAMaker config data

```
USAGE
  $ bf config:qnamaker:set

OPTIONS
  --kbid=kbid                        QnAMaker kbid to be set
  --subscriptionkey=subscriptionkey  QnAMaker Ocp Apim subscription key to be set. You can find it in Keys under Resource Management                                          section for your QnA Maker service
  --hostname=hostname                Specific the URL for your private QnA Service
  --endpointkey=endpointkey          Specifies the endpoint key to call Generate ANswer
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/qnamaker/set.ts)_

## `bf config:telemetry`

The telemetry commands allow the user to enable and disable telemetry

```
USAGE
  $ bf config:telemetry

OPTIONS
  -h, --help  show CLI help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/telemetry/index.ts)_

## `bf config:telemetry:disable`

Disable telemetry

```
USAGE
  $ bf config:telemetry:disable

OPTIONS
  -h, --help  show CLI help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/telemetry/disable.ts)_

## `bf config:telemetry:enable`

Enable Telemetry

```
USAGE
  $ bf config:telemetry:enable

OPTIONS
  -h, --help  show CLI help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/telemetry/enable.ts)_

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

## `bf qnamaker`

Provides access to QnA Maker commands

```
USAGE
  $ bf qnamaker

OPTIONS
  -h, --help  Displays commands available for QnA Maker
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/index.ts)_

## `bf qnamaker:create:kb`

Creates a new knowledgebase

```
USAGE
  $ bf qnamaker:create:kb

OPTIONS
  -h, --help                         qnamaker:create:kb command help

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in config.

  --in=in                            (required) The CreateKbDTO object to send in the body of the request.

  --name=name                        Name of the kb you want to create.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     config value.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in 'Keys' under Resource Management section                                      for your Qna Maker cognitive service). Overrides the subscriptionkey value present in the config

  --wait                             Wait for the operation to complete.
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/create/kb.ts)_

## `bf qnamaker:delete:kb`

Delete a knowledgebase by id

```
USAGE
  $ bf qnamaker:delete:kb

OPTIONS
  -h, --help                         qnamaker:delete:kb command help

  --force                            Do not prompt for confirmation, force the operation

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value in config.

  --kbId=kbId                        (required) Knowledgebase id to be deleted

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     config value.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in 'Keys' under Resource Management section                                      for your Qna Maker cognitive service). Overrides the config value.
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/delete/kb.ts)_

## `bf qnamaker:export:kb`

Export a knowledgebase to .json file

```
USAGE
  $ bf qnamaker:export:kb

OPTIONS
  -h, --help                         qnamaker:export:kb command help

  --environment=environment          (required) Specifies whether environment is Test or Prod.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in config

  --kbId=kbId                        (required) Knowledgebase id to be exported.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     config values.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in 'Keys' under Resource Management section                                      for your Qna Maker cognitive service). Overrides the config value.
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/export/kb.ts)_

## `bf qnamaker:get`

Get resources data (Kb and OperationDetails)

```
USAGE
  $ bf qnamaker:get

OPTIONS
  -h, --help  Display qnamaker:get available commands
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/get/index.ts)_

## `bf qnamaker:get:kb`

Get metadata about a knowledgebase

```
USAGE
  $ bf qnamaker:get:kb

OPTIONS
  -h, --help                         qnamaker:get:kb command help

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in config.

  --kbId=kbId                        (required) Knowledgebase id to get metadata.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. overrides the value present in config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the value present in config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/get/kb.ts)_

## `bf qnamaker:get:operationdetails`

Gets details of a specific long running operation.

```
USAGE
  $ bf qnamaker:get:operationdetails

OPTIONS
  -h, --help                         qnamaker:get:operationdetails command help

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in config 

  --operationId=operationId          (required) Operation id.

  --stdin                            Specifies qnamaker configuration is being passed via stdin.Overrides the value present in the                                            config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/get/operationdetails.ts)_


## `bf qnamaker:list`

List QnA MAker resources (Alterations and Endpoint Keys)

```
USAGE
  $ bf qnamaker:list

OPTIONS
  -h, --help  Display qnamaker:list available commands
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/list/index.ts)_

## `bf qnamaker:list:alterations`

Downloads all word alterations (synonyms) that have been added by the user.

```
USAGE
  $ bf qnamaker:list:alterations

OPTIONS
  -h, --help                         qnamaker:list:alterations command help

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in config.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the values present in the                                          config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/list/alterations.ts)_

## `bf qnamaker:list:endpointkeys`

List all the currently valid endpointKeys for querying your private endpoint

```
USAGE
  $ bf qnamaker:list:endpointkeys

OPTIONS
  -h, --help                         qnamaker:list:endpointkeys command help

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in the config.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the value present in the                                          config
                                     

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/list/endpointkeys.ts)_

## `bf qnamaker:list:kbs`

List all of your knowledgebases

```
USAGE
  $ bf qnamaker:list:kbs

OPTIONS
  -h, --help                         qnamaker:list:kbs command help

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in config.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the value present in the                                          config                              

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the values present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/list/kbs.ts)_

## `bf qnamaker:publish:kb`

Publish all unpublished in the knowledgebase to the prod endpoint.

```
USAGE
  $ bf qnamaker:publish:kb

OPTIONS
  -h, --help                         qnamaker:publish:kb command help

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in config

  --kbId=kbId                        (required) Knowledgebase id to pubish. 

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the value present in config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the value present in config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/publish/kb.ts)_

## `bf qnamaker:query`

Query model for fetching the answer from Kb for a query

```
USAGE
  $ bf qnamaker:query

OPTIONS
  -h, --help                         qnamaker:query command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     KB settings page). Overrides the value present in config.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in config.
                                     
  --kbId=kbId                        Specifies the active qnamaker knowledgebase id. Overrides the value present in the config
  
  --question=question                (required) Query to get a prediction for.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the value present in th                                            config
                                    
  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/query.ts)_

## `bf qnamaker:refresh:endpointkeys`

Re-generates an endpoint key, in case you suspect your keys have been compromised

```
USAGE
  $ bf qnamaker:refresh:endpointkeys

OPTIONS
  -h, --help                         qnamaker:refresh:endpoints command help


  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in config

  --keyType=keyType                  (required) Type of Key.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the valure present in config
                                    

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the value present in config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/refresh/endpointkeys.ts)_

## `bf qnamaker:replace`

Replace QnA maker resources

```
USAGE
  $ bf qnamaker:replace

OPTIONS
  -h, --help  display qnamaker:replace available commands
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/replace/index.ts)_

## `bf qnamaker:replace:alterations`

Replaces word alterations (synonyms) for the KB with the given records.

```
USAGE
  $ bf qnamaker:replace:alterations

OPTIONS
  -h, --help                         qnamaker:replace:alterations command help

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in config

  --in=in                            (required) The WordAlterationsDTO object to send in the body of the request

   --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the value in the config


  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the value in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/replace/alterations.ts)_

## `bf qnamaker:replace:kb`

Replace a knowledgebase contents with new contents

```
USAGE
  $ bf qnamaker:replace:kb

OPTIONS
  -h, --help                         qnamaker:replace:kb command help

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in config

  --in=in                            (required) The QnADTO object to send in the body of the request

  --kbId=kbId                        (required) Knowledgebase id.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the value present in the                                          config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/replace/kb.ts)_

## `bf qnamaker:update:kb`

Add or delete QnA Pairs and / or URLs to an existing knowledge base

```
USAGE
  $ bf qnamaker:update:kb

OPTIONS
  -h, --help                         qnamaker:update:kb command help

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the value present in config.

  --in=in                            (required) The UpdateKbOperationDTO object to send in the body of the request.

  --kbId=kbId                        (required) Knowledgebase id.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the value present in config.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the value present in the config

  --wait                             Wait for the operation to complete.
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/update/kb.ts)_
<!-- commandsstop -->
