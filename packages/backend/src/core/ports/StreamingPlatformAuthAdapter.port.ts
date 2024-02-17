export interface StreamingPlatformAuthAdapter {
  getPersonalAccessToken(authCode: string): Promise<{ accessToken: string; refreshToken: string }>
}
