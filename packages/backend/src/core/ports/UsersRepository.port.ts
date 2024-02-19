import { User } from "../domain/User"

export interface UsersRepository {
  register(
    id: string,
    email: string,
    streamingPlatformRefreshToken: string,
    streamingPlatformId: string,
  ): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  updateRefreshToken(email: string, refreshToken: string): Promise<User>
}
