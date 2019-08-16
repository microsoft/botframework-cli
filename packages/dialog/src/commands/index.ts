/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion
// tslint:disable:whitespace
// tslint:disable:object-curly-spacing
// tslint:diable:no-for-in
// tslint:diable:semicolon
// tslint:disable:no-empty-line-after-opening-brace

import { Command, flags } from '@microsoft/bf-cli-command';

export default class Index extends Command {
    static description = 'The dialog commands allow you to work with dialog schema.'

    static flags: flags.Input<any> = {
        help: flags.help({ char: 'h' }),
    }

    async run() {
        this._help()
    }
}
