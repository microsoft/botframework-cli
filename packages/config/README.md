@microsoft/bf-cli-config
========================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-cli-config)](https://www.npmjs.com/package/@microsoft/bf-cli-config)

# Commands
<!-- commands -->
* [`bf config`](#bf-config)
* [`bf config:set`](#bf-configset)
* [`bf config:set:luis`](#bf-configsetluis)
* [`bf config:set:qnamaker`](#bf-configsetqnamaker)
* [`bf config:set:telemetry`](#bf-configsettelemetry)
* [`bf config:show`](#bf-configshow)
* [`bf config:show:luis`](#bf-configshowluis)
* [`bf config:show:qnamaker`](#bf-configshowqnamaker)
* [`bf config:show:telemetry`](#bf-configshowtelemetry)

## `bf config`

Configure various settings within the cli.

```
USAGE
  $ bf config

OPTIONS
  -h, --help  config help
```

_See code: [src/commands/config/index.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/index.ts)_

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

_See code: [src/commands/config/set.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/set.ts)_

## `bf config:set:luis`

Stores default LUIS application values in global config.

```
USAGE
  $ bf config:set:luis

OPTIONS
  -h, --help                         show CLI help
  --appId=appId                      LUIS application Id
  --endpoint=endpoint                LUIS application endpoint hostname, ex: <region>.api.cognitive.microsoft.com
  --force                            Force save config without prompt
  --subscriptionKey=subscriptionKey  LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)
  --versionId=versionId              LUIS version Id

EXAMPLE

       $ bf config:set:luis --appId {APPLICATION_ID} --subscriptionKey {SUBSCRIPTION_KEY} --versionId {VERSION_ID} 
  --endpoint {ENDPOINT}
```

_See code: [src/commands/config/set/luis.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/set/luis.ts)_

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

_See code: [src/commands/config/set/qnamaker.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/set/qnamaker.ts)_

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

_See code: [src/commands/config/set/telemetry.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/set/telemetry.ts)_

## `bf config:show`

Displays the config file

```
USAGE
  $ bf config:show

OPTIONS
  -h, --help  config:show help
```

_See code: [src/commands/config/show.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/show.ts)_

## `bf config:show:luis`

Display LUIS settings

```
USAGE
  $ bf config:show:luis

OPTIONS
  -h, --help  config:show:luis help
```

_See code: [src/commands/config/show/luis.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/show/luis.ts)_

## `bf config:show:qnamaker`

Display QnAMaker settings

```
USAGE
  $ bf config:show:qnamaker

OPTIONS
  -h, --help  config:show:qnamaker help
```

_See code: [src/commands/config/show/qnamaker.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/show/qnamaker.ts)_

## `bf config:show:telemetry`

Display telemetry settings

```
USAGE
  $ bf config:show:telemetry

OPTIONS
  -h, --help  config:show:telemetry help
```

_See code: [src/commands/config/show/telemetry.ts](https://github.com/microsoft/botframework-cli/tree/master/packages/config/src/commands/config/show/telemetry.ts)_
<!-- commandsstop -->
