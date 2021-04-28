/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class ErrorWithCause extends Error {
    protected cause: Error|ErrorWithCause;

    public constructor(message: string, cause: Error|ErrorWithCause) {
        super(message);
        this.cause = cause;
        this.name = this.constructor.name;
    }

    public getCause(): Error|ErrorWithCause {
        return this.cause;
    }
}
