export class GeniusApiError extends Error {
  error: Record<string, unknown>

  constructor(message: string, error: Record<string, unknown>) {
    super(message)

    this.name = "GeniusApiError"

    this.error = error
  }
}
