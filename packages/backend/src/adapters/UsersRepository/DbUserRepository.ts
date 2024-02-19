import { User } from "@/core/domain/User"
import { UsersRepository } from "@/core/ports/UsersRepository.port"

import { db } from "../database"
import { DbUser } from "../database/types"

export class DbUserRepository implements UsersRepository {
  async findByEmail(email: string) {
    const dbUser = await db
      .selectFrom("users")
      .where("email", "=", email)
      .selectAll()
      .executeTakeFirst()

    if (!dbUser) {
      return null
    }

    return this.mapUser(dbUser)
  }

  async findById(id: string) {
    const dbUser = await db.selectFrom("users").where("id", "=", id).selectAll().executeTakeFirst()

    if (!dbUser) {
      return null
    }

    return this.mapUser(dbUser)
  }

  async register(
    id: string,
    email: string,
    streamingPlatformRefreshToken: string,
    streamingPlatformId: string,
  ) {
    const createdUser = await db
      .insertInto("users")
      .values({
        id,
        email,
        streaming_platform_id: streamingPlatformId,
        streaming_platform_refresh_token: streamingPlatformRefreshToken,
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    return this.mapUser(createdUser)
  }

  async updateRefreshToken(email: string, refreshToken: string) {
    const updatedUser = await db
      .updateTable("users")
      .set({ streaming_platform_refresh_token: refreshToken })
      .where("email", "=", email)
      .returningAll()
      .executeTakeFirstOrThrow()

    return this.mapUser(updatedUser)
  }

  private mapUser(dbUser: DbUser): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      steamingPlatformId: dbUser.streaming_platform_id,
      streamingPlatformAuthRefreshToken: dbUser.streaming_platform_refresh_token,
    }
  }
}
