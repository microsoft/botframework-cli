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
* [`bf `](#bf-)
* [`bf chatdown`](#bf-chatdown)
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
* [`bf plugins`](#bf-plugins)
* [`bf plugins:install PLUGIN...`](#bf-pluginsinstall-plugin)
* [`bf plugins:link PLUGIN`](#bf-pluginslink-plugin)
* [`bf plugins:uninstall PLUGIN...`](#bf-pluginsuninstall-plugin)
* [`bf plugins:update`](#bf-pluginsupdate)
* [`bf qnamaker`](#bf-qnamaker)
* [`bf qnamaker:convert`](#bf-qnamakerconvert)
* [`bf qnamaker:create:kb`](#bf-qnamakercreatekb)
* [`bf qnamaker:delete:kb`](#bf-qnamakerdeletekb)
* [`bf qnamaker:export:kb`](#bf-qnamakerexportkb)
* [`bf qnamaker:get`](#bf-qnamakerget)
* [`bf qnamaker:get:endpointsettings`](#bf-qnamakergetendpointsettings)
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
* [`bf qnamaker:train`](#bf-qnamakertrain)
* [`bf qnamaker:translate`](#bf-qnamakertranslate)
* [`bf qnamaker:update`](#bf-qnamakerupdate)
* [`bf qnamaker:update:endpointsettings`](#bf-qnamakerupdateendpointsettings)
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
  -h, --help     Chatdown command help

  -i, --in=in    The path of the chat file or directory to be parsed. A glob expression may be passed containing chat
                 files to be processed all at once, ex. ./**/*.chat. If flag is omitted, stdin will be used. If an
                 output directory is not present (-o), it will default the output to the current working directory.

  -o, --out=out  Path to the directory where the output of the multiple chat file processing (-o) will be placed.

  -p, --prefix   Prefix stdout with package name.

  -s, --static   Use static timestamps when generating timestamps on activities.

EXAMPLE

     $ bf chatdown
     $ bf chatdown --in=./path/to/file/sample.chat
     $ bf chatdown --in ./test/utils/*.sample.chat -o ./
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

## `bf config:set:qnamaker`

Set the QnAMaker config data

```
USAGE
  $ bf config:set:qnamaker

OPTIONS
  --endpointKey=endpointKey          QnAMaker endpointKey to be set
  --hostname=hostname                QnAMaker hostname to be set
  --kbId=kbId                        QnAMaker kbId to be set
  --subscriptionKey=subscriptionKey  QnAMaker subscriptionkey to be set
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/set/qnamaker.ts)_

## `bf config:set:telemetry`

Enable or disable telemetry

```
USAGE
  $ bf config:set:telemetry

OPTIONS
  -d, --disable  Disable tlemetry
  -e, --enable   Enable tlemetry
  -h, --help     show CLI help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/set/telemetry.ts)_

## `bf config:show`

Displays the config file

```
USAGE
  $ bf config:show

OPTIONS
  -h, --help  show CLI help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/show.ts)_

## `bf config:show:qnamaker`

Display QnAMaker settings

```
USAGE
  $ bf config:show:qnamaker

OPTIONS
  -h, --help  show CLI help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/show/qnamaker.ts)_

## `bf config:show:telemetry`

Display telemetry settings

```
USAGE
  $ bf config:show:telemetry

OPTIONS
  -h, --help  show CLI help
```

_See code: [@microsoft/bf-cli-config](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/show/telemetry.ts)_

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

Convert, translate luis/lu files or generate source code

```
USAGE
  $ bf luis

OPTIONS
  -h, --help  Display Luis available commnads
```

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/index.ts)_

## `bf luis:convert`

Convert .lu file(s) to a LUIS application JSON model or vice versa

```
USAGE
  $ bf luis:convert

OPTIONS
  --culture=culture              Lang code for the LUIS application
  --description=description      Text describing the LUIS applicaion
  --in=in                        Source .lu file(s) or LUIS application JSON model
  --log                          Enables log messages
  --name=name                    Name of the LUIS application
  --out=out                      Output file or folder name. If not specified stdout will be used as output
  --recurse                      Indicates if sub-folders need to be considered to file .lu file(s)
  --schemaversion=schemaversion  Schema version of the LUIS application
  --sort                         When set, intent, utterances, entities are alphabetically sorted in .lu files
  --versionid=versionid          Version ID of the LUIS application
```

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/convert.ts)_

## `bf luis:generate:cs`

Generate:cs generates a strongly typed C# source code from an exported (json) LUIS model.

```
USAGE
  $ bf luis:generate:cs

OPTIONS
  --className=className  Name of the autogenerated class (can include namespace)
  --force                If --in flag is provided with the path to an existing file, overwrites that file
  --in=in                Path to the file containing the LUIS application JSON model
  --out=out              Output file or folder name. If not specified stdout will be used as output
```

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/generate/cs.ts)_

## `bf luis:generate:ts`

Generate:ts generates a strongly typed typescript source code from an exported (json) LUIS model.

```
USAGE
  $ bf luis:generate:ts

OPTIONS
  --className=className  Name of the autogenerated class
  --force                If --in flag is provided with the path to an existing file, overwrites that file
  --in=in                Path to the file containing the LUIS application JSON model
  --out=out              Output file or folder name. If not specified stdout will be used as output
```

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/generate/ts.ts)_

## `bf luis:translate`

Translate given LUIS application JSON model or lu file(s)

```
USAGE
  $ bf luis:translate

OPTIONS
  --in=in                      Source .lu file(s) or LUIS application JSON model
  --out=out                    Output folder name. If not specified stdout will be used as output
  --recurse                    Indicates if sub-folders need to be considered to file .lu file(s)
  --srclang=srclang            Source lang code. Auto detect if missing.
  --tgtlang=tgtlang            (required) Comma separated list of target languages.
  --translate_comments         When set, machine translate comments found in .lu file
  --translate_link_text        When set, machine translate link description in .lu file
  --translatekey=translatekey  (required) Machine translation endpoint key.
```

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/luis/translate.ts)_

## `bf plugins`

list installed plugins

```
USAGE
  $ bf plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ bf plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/index.ts)_

## `bf plugins:install PLUGIN...`

installs a plugin into the CLI

```
USAGE
  $ bf plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command 
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in 
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ bf plugins:add

EXAMPLES
  $ bf plugins:install myplugin 
  $ bf plugins:install https://github.com/someuser/someplugin
  $ bf plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/install.ts)_

## `bf plugins:link PLUGIN`

links a plugin into the CLI for development

```
USAGE
  $ bf plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello' 
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ bf plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/link.ts)_

## `bf plugins:uninstall PLUGIN...`

removes a plugin from the CLI

```
USAGE
  $ bf plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ bf plugins:unlink
  $ bf plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/uninstall.ts)_

## `bf plugins:update`

update installed plugins

```
USAGE
  $ bf plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/update.ts)_

## `bf qnamaker`

QnA Maker

```
USAGE
  $ bf qnamaker

OPTIONS
  -h, --help  Display QnA Maker CLI available commnads
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/index.ts)_

## `bf qnamaker:convert`

Convert .lu file(s) to a QnA application JSON model or vice versa

```
USAGE
  $ bf qnamaker:convert

OPTIONS
  --alterations  Indicates if files is QnA Alterations
  --in=in        Source .qna file(s) or QnA KB JSON file
  --log          Enables log messages
  --name=name    Name of the QnA KB
  --out=out      Output file or folder name. If not specified stdout will be used as output
  --recurse      Indicates if sub-folders need to be considered to file .qna file(s)
  --sort         When set, questions collections are alphabetically sorted are alphabetically sorted in .qna files
```

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/convert.ts)_

## `bf qnamaker:create:kb`

Creates a new knowledgebase

```
USAGE
  $ bf qnamaker:create:kb

OPTIONS
  -h, --help                         qnamaker:create:kb command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --in=in                            File path to the CreateKbDTO object to send in the body of the request.

  --name=name                        Name of the kb you want to create. This will override the name of KB that might be
                                     present in the CreateKb DTO

  --save                             Save the kbId in config.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/create/kb.ts)_

## `bf qnamaker:delete:kb`

Delete a knowledgebase by id

```
USAGE
  $ bf qnamaker:delete:kb

OPTIONS
  -h, --help                         qnamaker:delete:kb command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --force                            Do not prompt for confirmation, force the operation

  --kbId=kbId                        Knowledgebase id to be deleted. Overrides the knowledge base id present in the
                                     config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/delete/kb.ts)_

## `bf qnamaker:export:kb`

Export a knowledgebase to .json file

```
USAGE
  $ bf qnamaker:export:kb

OPTIONS
  -h, --help                         qnamaker:export:kb command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --environment=environment          (required) Specifies whether environment is Test or Prod.

  --kbId=kbId                        Knowledgebase id to be exported. Overrides the knowledge base id present in the
                                     config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
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

## `bf qnamaker:get:endpointsettings`

Gets endpoint settings for an endpoint.

```
USAGE
  $ bf qnamaker:get:endpointsettings

OPTIONS
  -h, --help                         qnamaker:get:endpointsettings command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --kbId=kbId                        Knowledgebase id to get metadata.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/get/endpointsettings.ts)_

## `bf qnamaker:get:kb`

Get metadata about a knowledgebase

```
USAGE
  $ bf qnamaker:get:kb

OPTIONS
  -h, --help                         qnamaker:get:kb command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --kbId=kbId                        Knowledgebase id to get metadata. Overrides the knowledge base id present in the
                                     config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/get/kb.ts)_

## `bf qnamaker:get:operationdetails`

Gets details of a specific long running operation.

```
USAGE
  $ bf qnamaker:get:operationdetails

OPTIONS
  -h, --help                         qnamaker:get:operationdetails command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --operationId=operationId          (required) Operation id.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/get/operationdetails.ts)_

## `bf qnamaker:init`

Initializes the config file with settings.

```
USAGE
  $ bf qnamaker:init

OPTIONS
  -h, --help           qnamaker:init command help
  --endpoint=endpoint  Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/init.ts)_

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
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/list/alterations.ts)_

## `bf qnamaker:list:endpointkeys`

List all the currently valid endpointKeys for querying your private endpoint

```
USAGE
  $ bf qnamaker:list:endpointkeys

OPTIONS
  -h, --help                         qnamaker:list:endpointkeys command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/list/endpointkeys.ts)_

## `bf qnamaker:list:kbs`

List all of your knowledgebases

```
USAGE
  $ bf qnamaker:list:kbs

OPTIONS
  -h, --help                         qnamaker:list:kbs command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/list/kbs.ts)_

## `bf qnamaker:publish:kb`

Publish all unpublished in the knowledgebase to the prod endpoint.

```
USAGE
  $ bf qnamaker:publish:kb

OPTIONS
  -h, --help                         qnamaker:publish:kb command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --kbId=kbId                        Knowledgebase id to pubish. Overrides the knowledge base id present in the config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/publish/kb.ts)_

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

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/query.ts)_

## `bf qnamaker:refresh:endpointkeys`

Re-generates an endpoint key, in case you suspect your keys have been compromised

```
USAGE
  $ bf qnamaker:refresh:endpointkeys

OPTIONS
  -h, --help                         qnamaker:refresh:endpoints command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --keyType=keyType                  (required) Type of Key. (PrimaryKey/SecondaryKey)

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
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

Replaces word alterations (synonyms) for the KB with the give records.

```
USAGE
  $ bf qnamaker:replace:alterations

OPTIONS
  -h, --help                         qnamaker:replace:alterations command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --in=in                            File path to the WordAlterationsDTO object to send in the body of the request

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/replace/alterations.ts)_

## `bf qnamaker:replace:kb`

Replace a knowledgebase contents with new contents

```
USAGE
  $ bf qnamaker:replace:kb

OPTIONS
  -h, --help                         qnamaker:replace:kb command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/
  --in=in                            File path to the ReplaceKbDTO object to send in the body of the request
  --kbId=kbId                        Knowledgebase id. Overrides the knowledge base id present in the config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/replace/kb.ts)_

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

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/train.ts)_

## `bf qnamaker:translate`

Translate given QnA maker application JSON model or qna file(s)

```
USAGE
  $ bf qnamaker:translate

OPTIONS
  --in=in                                    Source .qna file(s) or QnA maker application JSON model
  --out=out                                  Output folder name. If not specified stdout will be used as output
  --recurse                                  Indicates if sub-folders need to be considered to find .qna file(s)
  --srclang=srclang                          Source lang code. Auto detect if missing.
  --tgtlang=tgtlang                          (required) Comma separated list of target languages.
  --translate_comments=translate_comments    When set, machine translate comments found in .qna file
  --translate_link_text=translate_link_text  When set, machine translate link description in .qna file
  --translatekey=translatekey                (required) Machine translation endpoint key.
```

_See code: [@microsoft/bf-lu](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/translate.ts)_

## `bf qnamaker:update`

Updates KB or Endpoint settings

```
USAGE
  $ bf qnamaker:update

OPTIONS
  -h, --help  display qnamaker:update available commands
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/update/index.ts)_

## `bf qnamaker:update:endpointsettings`

Updates endpoint settings for an endpoint.

```
USAGE
  $ bf qnamaker:update:endpointsettings

OPTIONS
  -h, --help                         qnamaker:update:endpointsettings command help
  --activelearning                   Enable active learning. Disables if flag not set
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/update/endpointsettings.ts)_

## `bf qnamaker:update:kb`

Add or delete QnA Pairs and / or URLs to an existing knowledge base

```
USAGE
  $ bf qnamaker:update:kb

OPTIONS
  -h, --help                         qnamaker:update:kb command help
  --endpoint=endpoint                Overrides public endpoint https://westus.api.cognitive.microsoft.com/qnamaker/v4.0/

  --in=in                            The file path to the UpdateKbOperationDTO object to send in the body of the
                                     request.

  --kbId=kbId                        Knowledgebase id. Overrides the knowledge base id present in the config

  --subscriptionKey=subscriptionKey  Specifies the qnamaker Ocp-Apim-Subscription Key (found in Keys under Resource
                                     Management section for your Qna Maker cognitive service). Overrides the
                                     subscriptionkey value present in the config

  --wait                             Wait for the operation to complete.
```

_See code: [@microsoft/bf-qnamaker](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/update/kb.ts)_
<!-- commandsstop -->
