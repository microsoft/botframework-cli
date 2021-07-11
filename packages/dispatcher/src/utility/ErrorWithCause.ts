/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class ErrorWithCause extends Error {
    protected cause: Error;

    public constructor(message: string, cause: Error) {
        super(message);
        this.cause = cause;
        this.name = this.constructor.name;
    }

    public getCause(): Error {
        return this.cause;
    }
}
