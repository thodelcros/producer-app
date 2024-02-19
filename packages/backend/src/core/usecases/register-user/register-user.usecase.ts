import { User } from "@/core/domain/User"
import { IdAdapter } from "@/core/ports/IdAdapter.port"
import { StreamingPlatform } from "@/core/ports/StreamingPlatform.port"
import { StreamingPlatformAuthAdapter } from "@/core/ports/StreamingPlatformAuthAdapter.port"
import { UsersRepository } from "@/core/ports/UsersRepository.port"

interface RegisterUserDependencies {
  streamingPlatformAuthAdapter: StreamingPlatformAuthAdapter
  streamingPlatform: StreamingPlatform
  userRepository: UsersRepository
  idGenerator: IdAdapter
}

interface RegisterUserArgs {
  authCode: string
}

interface RegisterUserResult {
  action: "updated" | "created"
  user: User
}

export const registerUser =
  ({
    streamingPlatformAuthAdapter: authAdapter,
    streamingPlatform,
    userRepository,
    idGenerator,
  }: RegisterUserDependencies) =>
  async ({ authCode }: RegisterUserArgs): Promise<RegisterUserResult> => {
    const { accessToken, refreshToken } = await authAdapter.getPersonalAccessToken(authCode)

    const { email, id: streamingPlatformId } = await streamingPlatform.getUserDetails(accessToken)

    const user = await userRepository.findByEmail(email)

    if (!user) {
      const id = idGenerator.generate()

      const createdUser = await userRepository.register(
        id,
        email,
        refreshToken,
        streamingPlatformId,
      )

      return { action: "created", user: createdUser }
    } else {
      const updatedUser = await userRepository.updateRefreshToken(email, refreshToken)

      return { action: "updated", user: updatedUser }
    }
  }
