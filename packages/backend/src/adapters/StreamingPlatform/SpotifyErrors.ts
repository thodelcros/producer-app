export class SpotifyError extends Error {
  error: Record<string, unknown>

  constructor(message: string, error: Record<string, unknown>) {
    super(message)

    this.name = "SpotifyError"

    this.error = error
  }
}
