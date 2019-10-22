/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class CLIError extends Error {
  constructor(error: string | Error) {
    const message = error instanceof Error ? error.message : error
    super(message)
  }
}
