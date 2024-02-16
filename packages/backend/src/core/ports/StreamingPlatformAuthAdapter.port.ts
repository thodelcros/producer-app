export interface StreamingPlatformAuthAdapter {
  getAccessToken(authCode: string): Promise<{ accessToken: string; refreshToken: string }>
  refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>
}
