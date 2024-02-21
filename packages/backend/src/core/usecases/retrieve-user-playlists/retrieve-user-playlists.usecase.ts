import { StreamingPlatform } from "@/core/ports/StreamingPlatform.port"
import { UsersRepository } from "@/core/ports/UsersRepository.port"

interface RetrieveUserPlaylistsDependencies {
  streamingPlatform: StreamingPlatform
  usersRepository: UsersRepository
}

interface RetrieveUserPlaylistsArgs {
  email: string
}

export const retrieveUserPlaylists =
  ({ streamingPlatform, usersRepository: userRepository }: RetrieveUserPlaylistsDependencies) =>
  async ({ email }: RetrieveUserPlaylistsArgs) => {
    const user = await userRepository.findByEmail(email)

    if (!user) {
      return null
    }

    return streamingPlatform.getUserPlaylists(
      user.streamingPlatformAuthRefreshToken,
      user.steamingPlatformId,
    )
  }
