export type ErrorMessage = "invalid_credentials" | "invalid_refresh_token"

export class SpotifyAuthError extends Error {
  error: Record<string, unknown>

  constructor(message: ErrorMessage, error: Record<string, unknown>) {
    super(message)

    this.name = "SpotifyAuthError"

    this.error = error
  }
}
