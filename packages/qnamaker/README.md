@microsoft/bf-qnamaker
======================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-qnamaker.svg)](https://npmjs.org/package/@microsoft/bf-qnamaker)
[![Downloads/week](https://img.shields.io/npm/dw/@microsoft/bf-qnamaker.svg)](https://npmjs.org/package/@microsoft/bf-qnamaker)
[![License](https://img.shields.io/npm/l/@microsoft/bf-qnamaker.svg)](https://github.com/microsoft/botframework-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @microsoft/bf-qnamaker
$ bf COMMAND
running command...
$ bf (-v|--version|version)
@microsoft/bf-qnamaker/1.0.0 darwin-x64 node-v12.1.0
$ bf --help [COMMAND]
USAGE
  $ bf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
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

## `bf qnamaker`

QnA Maker CLI (Preview version)

```
USAGE
  $ bf qnamaker

OPTIONS
  -h, --help  Display QnA Maker CLI available commnads
```

_See code: [src/commands/qnamaker/index.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/index.ts)_

## `bf qnamaker:create:kb`

Creates a new knowledgebase

```
USAGE
  $ bf qnamaker:create:kb

OPTIONS
  -h, --help                         qnamaker:create:kb command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --in=in                            (required) The CreateKbDTO object to send in the body of the request.

  --kbId=kbId                        Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and
                                     the QNAMAKER_KBID environment variable.

  --name=name                        Name of the kb you want to create.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.

  --wait                             Wait for the operation to complete.
```

_See code: [src/commands/qnamaker/create/kb.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/create/kb.ts)_

## `bf qnamaker:delete:kb`

Delete a knowledgebase by id

```
USAGE
  $ bf qnamaker:delete:kb

OPTIONS
  -h, --help                         qnamaker:delete:kb command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --force                            Do not prompt for confirmation, force the operation

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --kbId=kbId                        (required) Knowledgebase id to be deleted

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.
```

_See code: [src/commands/qnamaker/delete/kb.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/delete/kb.ts)_

## `bf qnamaker:export:kb`

Export a knowledgebase to .json file

```
USAGE
  $ bf qnamaker:export:kb

OPTIONS
  -h, --help                         qnamaker:export:kb command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --environment=environment          (required) Specifies whether environment is Test or Prod.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --kbId=kbId                        (required) Knowledgebase id to be exported.

  --legacy                           Specifies if is a legacy knowlegebase.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.
```

_See code: [src/commands/qnamaker/export/kb.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/export/kb.ts)_

## `bf qnamaker:get`

Get resources data (Kb and OperationDetails)

```
USAGE
  $ bf qnamaker:get

OPTIONS
  -h, --help  Display qnamaker:get available commands
```

_See code: [src/commands/qnamaker/get/index.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/get/index.ts)_

## `bf qnamaker:get:kb`

Get metadata about a knowledgebase

```
USAGE
  $ bf qnamaker:get:kb

OPTIONS
  -h, --help                         qnamaker:get:kb command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --environment=environment          Specifies whether environment is Test or Prod.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --kbId=kbId                        (required) Knowledgebase id to get metadata.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.
```

_See code: [src/commands/qnamaker/get/kb.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/get/kb.ts)_

## `bf qnamaker:get:operationdetails`

Gets details of a specific long running operation.

```
USAGE
  $ bf qnamaker:get:operationdetails

OPTIONS
  -h, --help                         qnamaker:get:operationdetails command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --kbId=kbId                        Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and
                                     the QNAMAKER_KBID environment variable.

  --operationId=operationId          (required) Operation id.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.
```

_See code: [src/commands/qnamaker/get/operationdetails.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/get/operationdetails.ts)_

## `bf qnamaker:init`

Initializes the .qnamakerrc file with settings.

```
USAGE
  $ bf qnamaker:init

OPTIONS
  -h, --help  qnamaker:init command help
```

_See code: [src/commands/qnamaker/init.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/init.ts)_

## `bf qnamaker:list`

List QnA MAker resources (Alterations and Endpoint Keys)

```
USAGE
  $ bf qnamaker:list

OPTIONS
  -h, --help  Display qnamaker:list available commands
```

_See code: [src/commands/qnamaker/list/index.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/list/index.ts)_

## `bf qnamaker:list:alterations`

Downloads all word alterations (synonyms) that have been automatically mined or added by the user.

```
USAGE
  $ bf qnamaker:list:alterations

OPTIONS
  -h, --help                         qnamaker:list:alterations command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --kbId=kbId                        Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and
                                     the QNAMAKER_KBID environment variable.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.
```

_See code: [src/commands/qnamaker/list/alterations.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/list/alterations.ts)_

## `bf qnamaker:list:endpointkeys`

List all the currently valid endpointKeys for querying your private endpoint

```
USAGE
  $ bf qnamaker:list:endpointkeys

OPTIONS
  -h, --help                         qnamaker:list:endpointkeys command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --kbId=kbId                        Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and
                                     the QNAMAKER_KBID environment variable.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.
```

_See code: [src/commands/qnamaker/list/endpointkeys.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/list/endpointkeys.ts)_

## `bf qnamaker:list:kbs`

List all of your knowledgebases

```
USAGE
  $ bf qnamaker:list:kbs

OPTIONS
  -h, --help                         qnamaker:list:kbs command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --kbId=kbId                        Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and
                                     the QNAMAKER_KBID environment variable.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.
```

_See code: [src/commands/qnamaker/list/kbs.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/list/kbs.ts)_

## `bf qnamaker:publish:kb`

Publish all unpublished in the knowledgebase to the prod endpoint.

```
USAGE
  $ bf qnamaker:publish:kb

OPTIONS
  -h, --help                         qnamaker:publish:kb command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --kbId=kbId                        (required) Knowledgebase id to pubish.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.
```

_See code: [src/commands/qnamaker/publish/kb.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/publish/kb.ts)_

## `bf qnamaker:query`

Query model for prediction

```
USAGE
  $ bf qnamaker:query

OPTIONS
  -h, --help                         qnamaker:query command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --kbId=kbId                        Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and
                                     the QNAMAKER_KBID environment variable.

  --question=question                (required) Query to get a prediction for.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.
```

_See code: [src/commands/qnamaker/query.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/query.ts)_

## `bf qnamaker:refresh:endpointkeys`

Re-generates an endpoint key, in case you suspect your keys have been compromised

```
USAGE
  $ bf qnamaker:refresh:endpointkeys

OPTIONS
  -h, --help                         qnamaker:refresh:endpoints command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --kbId=kbId                        Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and
                                     the QNAMAKER_KBID environment variable.

  --keyType=keyType                  (required) Type of Key.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.
```

_See code: [src/commands/qnamaker/refresh/endpointkeys.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/refresh/endpointkeys.ts)_

## `bf qnamaker:replace`

Replace QnA maker resources

```
USAGE
  $ bf qnamaker:replace

OPTIONS
  -h, --help  display qnamaker:replace available commands
```

_See code: [src/commands/qnamaker/replace/index.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/replace/index.ts)_

## `bf qnamaker:replace:alterations`

Replaces word alterations (synonyms) for the KB with the give records.

```
USAGE
  $ bf qnamaker:replace:alterations

OPTIONS
  -h, --help                         qnamaker:replace:alterations command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --in=in                            (required) The WordAlterationsDTO object to send in the body of the request

  --kbId=kbId                        Specifies the active qnamaker knowledgebase id. Overrides the .qnamakerrc value and
                                     the QNAMAKER_KBID environment variable.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.
```

_See code: [src/commands/qnamaker/replace/alterations.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/replace/alterations.ts)_

## `bf qnamaker:replace:kb`

Replace a knowledgebase contents with new contents

```
USAGE
  $ bf qnamaker:replace:kb

OPTIONS
  -h, --help                         qnamaker:replace:kb command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --in=in                            (required) The ReplaceKbDTO object to send in the body of the request

  --kbId=kbId                        (required) Knowledgebase id.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.
```

_See code: [src/commands/qnamaker/replace/kb.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/replace/kb.ts)_

## `bf qnamaker:update:kb`

Add or delete QnA Pairs and / or URLs to an existing knowledge base

```
USAGE
  $ bf qnamaker:update:kb

OPTIONS
  -h, --help                         qnamaker:update:kb command help

  --endpointKey=endpointKey          Specifies the endpoint key for your private QnA service.(from qnamaker.ai portal
                                     user settings page). Overrides the .qnamakerrc value and the QNAMAKER_ENDPOINTKEY
                                     environment variable.

  --hostname=hostname                Specifies the url for your private QnA service. Overrides the .qnamakerrc value and
                                     the QNAMAKER_HOSTNAME environment variable.

  --in=in                            (required) The UpdateKbOperationDTO object to send in the body of the request.

  --kbId=kbId                        (required) Knowledgebase id.

  --stdin                            Specifies qnamaker configuration is being passed via stdin. Overrides the
                                     .qnamakerrc value and the QNAMAKER_KBID environment variable.

  --subscriptionKey=subscriptionKey  Specifies the qnamaker subscription key/access keys (found on the Cognitive
                                     Services Azure portal page under "access keys"). Overrides the .qnamakerrc value
                                     and the QNAMAKER_SUBSCRIPTION_KEY environment variable.

  --wait                             Wait for the operation to complete.
```

_See code: [src/commands/qnamaker/update/kb.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/qnamaker/update/kb.ts)_
<!-- commandsstop -->
