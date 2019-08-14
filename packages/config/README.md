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
* [`bf config:get [FILE]`](#bf-configget-file)
* [`bf config:qnamaker:set`](#bf-configqnamakerset)
* [`bf config:telemetry`](#bf-configtelemetry)
* [`bf config:telemetry:disable`](#bf-configtelemetrydisable)
* [`bf config:telemetry:enable`](#bf-configtelemetryenable)

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

## `bf config:get [FILE]`

describe the command here

```
USAGE
  $ bf config:get [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/config/get.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/get.ts)_

## `bf config:qnamaker:set`

Set the QnAMaker config data

```
USAGE
  $ bf config:qnamaker:set

OPTIONS
  --kbid=kbid                        QnAMaker kbid to be set
  --subscriptionkey=subscriptionkey  QnAMaker subscriptionkey to be set
```

_See code: [src/commands/config/qnamaker/set.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/qnamaker/set.ts)_

## `bf config:telemetry`

The telemetry commands allow the user to enable and disable telemetry

```
USAGE
  $ bf config:telemetry

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/config/telemetry/index.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/telemetry/index.ts)_

## `bf config:telemetry:disable`

Disable telemetry

```
USAGE
  $ bf config:telemetry:disable

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/config/telemetry/disable.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/telemetry/disable.ts)_

## `bf config:telemetry:enable`

Enable Telemetry

```
USAGE
  $ bf config:telemetry:enable

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/config/telemetry/enable.ts](https://github.com/microsoft/botframework-cli/blob/v1.0.0/src/commands/config/telemetry/enable.ts)_
<!-- commandsstop -->
