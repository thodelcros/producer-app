import { IdAdapter } from "@/core/ports/IdAdapter.port"
import { StreamingPlatform } from "@/core/ports/StreamingPlatform.port"
import { StreamingPlatformAuthAdapter } from "@/core/ports/StreamingPlatformAuthAdapter.port"
import { UserRepository } from "@/core/ports/UserRepository.port"

interface RegisterUserDependencies {
  authAdapter: StreamingPlatformAuthAdapter
  streamingPlatform: StreamingPlatform
  userRepository: UserRepository
  idGenerator: IdAdapter
}

interface RegisterUserArgs {
  authCode: string
}

export const registerUser =
  ({ authAdapter, streamingPlatform, userRepository, idGenerator }: RegisterUserDependencies) =>
  async ({ authCode }: RegisterUserArgs) => {
    const { accessToken, refreshToken } = await authAdapter.getAccessToken(authCode)

    console.log({ accessToken, refreshToken })

    const { email, id: streamingPlatformId } = await streamingPlatform.getUserDetails(accessToken)

    console.log({ email, streamingPlatformId })

    const user = await userRepository.findByEmail(email)

    console.log({ user })

    if (!user) {
      const id = idGenerator.generate()

      await userRepository.register(id, email, refreshToken, streamingPlatformId)

      return { action: "created" }
    } else {
      await userRepository.updateRefreshToken(email, refreshToken)

      return { action: "updated" }
    }
  }
