@microsoft/bf-cli-config
========================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-cli-config.svg)](https://www.npmjs.com/package/@microsoft/bf-cli-config)
[![Downloads/week](https://img.shields.io/npm/dw/@microsoft/bf-cli-config.svg)](https://www.npmjs.com/package/@microsoft/bf-cli-config)
[![License](https://img.shields.io/npm/l/@microsoft/bf-cli-config.svg)](https://github.com/microsoft/botframework-cli/blob/master/packages/config/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @microsoft/bf-cli-config
$ bf COMMAND
running command...
$ bf (-v|--version|version)
@microsoft/bf-cli-config/1.0.0 darwin-x64 node-v12.1.0
$ bf --help [COMMAND]
USAGE
  $ bf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bf `](#bf-)
* [`bf config`](#bf-config)
* [`bf config:set:qnamaker`](#bf-configsetqnamaker)
* [`bf config:set:telemetry`](#bf-configsettelemetry)
* [`bf config:show`](#bf-configshow)
* [`bf config:show:qnamaker [FILE]`](#bf-configshowqnamaker-file)
* [`bf config:show:telemetry`](#bf-configshowtelemetry)

## `bf `

The config plugin allows users to configure various settings within the cli.

```
USAGE
  $ bf

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/index.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/index.ts)_

## `bf config`

The config plugin allows users to configure various settings within the cli.

```
USAGE
  $ bf config

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/config/index.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/index.ts)_

## `bf config:set:qnamaker`

Set the QnAMaker config data

```
USAGE
  $ bf config:set:qnamaker

OPTIONS
  --kbid=kbid                        QnAMaker kbid to be set
  --subscriptionkey=subscriptionkey  QnAMaker subscriptionkey to be set
```

_See code: [src/commands/config/set/qnamaker.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/set/qnamaker.ts)_

## `bf config:set:telemetry`

Enable or disable telemetry

```
USAGE
  $ bf config:set:telemetry

OPTIONS
  -d, --disable  Disable tlemetry
  -h, --help     show CLI help
```

_See code: [src/commands/config/set/telemetry.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/set/telemetry.ts)_

## `bf config:show`

Displays the config file

```
USAGE
  $ bf config:show

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/config/show.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/show.ts)_

## `bf config:show:qnamaker [FILE]`

describe the command here

```
USAGE
  $ bf config:show:qnamaker [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/config/show/qnamaker.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/show/qnamaker.ts)_

## `bf config:show:telemetry`

Display telemetry settings

```
USAGE
  $ bf config:show:telemetry

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/config/show/telemetry.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/show/telemetry.ts)_
<!-- commandsstop -->
