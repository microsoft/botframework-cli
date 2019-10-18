export class CLIError extends Error {
  constructor(error: string | Error) {
    const message = error instanceof Error ? error.message : error
    super(message)
  }
}
