@microsoft/bf-config
====================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-config.svg)](https://npmjs.org/package/@microsoft/bf-config)
[![Downloads/week](https://img.shields.io/npm/dw/@microsoft/bf-config.svg)](https://npmjs.org/package/@microsoft/bf-config)
[![License](https://img.shields.io/npm/l/@microsoft/bf-config.svg)](https://github.com/packages/bf-config/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @microsoft/bf-config
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@microsoft/bf-config/0.0.0 win32-x64 node-v10.16.0
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-example config`](#oclif-example-config)
* [`oclif-example config:telemetry`](#oclif-example-configtelemetry)
* [`oclif-example config:telemetry:disable`](#oclif-example-configtelemetrydisable)
* [`oclif-example config:telemetry:enable`](#oclif-example-configtelemetryenable)

## `oclif-example config`

The config plugin allows users to configure various settings within the cli.

```
USAGE
  $ oclif-example config

OPTIONS
  -h, --help  show CLI help
```

_See code: [src\commands\config\index.ts](https://github.com/packages/bf-config/blob/v0.0.0/src\commands\config\index.ts)_

## `oclif-example config:telemetry`

The telemetry commands allow the user to enable and disable telemetry.

```
USAGE
  $ oclif-example config:telemetry

OPTIONS
  -h, --help  show CLI help
```

_See code: [src\commands\config\telemetry\index.ts](https://github.com/packages/bf-config/blob/v0.0.0/src\commands\config\telemetry\index.ts)_

## `oclif-example config:telemetry:disable`

Disable telemetry

```
USAGE
  $ oclif-example config:telemetry:disable
```

_See code: [src\commands\config\telemetry\disable.ts](https://github.com/packages/bf-config/blob/v0.0.0/src\commands\config\telemetry\disable.ts)_

## `oclif-example config:telemetry:enable`

enable telemetry

```
USAGE
  $ oclif-example config:telemetry:enable
```

_See code: [src\commands\config\telemetry\enable.ts](https://github.com/packages/bf-config/blob/v0.0.0/src\commands\config\telemetry\enable.ts)_
<!-- commandsstop -->
