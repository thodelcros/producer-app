import { IdAdapter } from "@/core/ports/IdAdapter.port"
import { StreamingPlatform } from "@/core/ports/StreamingPlatform.port"
import { StreamingPlatformAuthAdapter } from "@/core/ports/StreamingPlatformAuthAdapter.port"
import { UserRepository } from "@/core/ports/UserRepository.port"

interface RegisterUserDependencies {
  streamingPlatformAuthAdapter: StreamingPlatformAuthAdapter
  streamingPlatform: StreamingPlatform
  userRepository: UserRepository
  idGenerator: IdAdapter
}

interface RegisterUserArgs {
  authCode: string
}

export const registerUser =
  ({
    streamingPlatformAuthAdapter: authAdapter,
    streamingPlatform,
    userRepository,
    idGenerator,
  }: RegisterUserDependencies) =>
  async ({ authCode }: RegisterUserArgs) => {
    const { accessToken, refreshToken } = await authAdapter.getPersonalAccessToken(authCode)

    const { email, id: streamingPlatformId } = await streamingPlatform.getUserDetails(accessToken)

    const user = await userRepository.findByEmail(email)

    if (!user) {
      const id = idGenerator.generate()

      await userRepository.register(id, email, refreshToken, streamingPlatformId)

      return { action: "created" }
    } else {
      await userRepository.updateRefreshToken(email, refreshToken)

      return { action: "updated" }
    }
  }
