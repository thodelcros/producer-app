import { Router } from "express"
import querystring from "node:querystring"

import {
  PERMISSION_SCOPES,
  REDIRECT_URI,
  SpotifyAuthAdapter,
} from "@/adapters/SpotifyAuthAdapter/SpotifyAuthAdapter"
import { SpotifyAdapter } from "@/adapters/StreamingPlatform/SpotifyAdapter"
import { DbUserRepository } from "@/adapters/UsersRepository/DbUserRepository"
import { UuidGenerator } from "@/adapters/utils/UuidGenerator"
import { registerUser } from "@/core/usecases/register-user/register-user.usecase"

const spotifyAuthRouter = Router()

// First request handler, redirect to Spotify auth
spotifyAuthRouter.get("/", (_request, response) => {
  return response.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_API_CLIENT_ID,
        scope: PERMISSION_SCOPES,
        redirect_uri: REDIRECT_URI,
        state: "toto",
      }),
  )
})

// Once Spotify auth succeeded, this endpoint is called with auth code
spotifyAuthRouter.get("/callback", async (request, response) => {
  const { code, state } = request.query

  if (!state || !code) {
    return response.json({ ok: false, code, state, message: "Auth failed 🤕" })
  }

  const persistSpotifyUserInDb = await registerUser({
    streamingPlatformAuthAdapter: new SpotifyAuthAdapter(),
    streamingPlatform: new SpotifyAdapter(),
    idGenerator: new UuidGenerator(),
    userRepository: new DbUserRepository(),
  })

  try {
    const result = await persistSpotifyUserInDb({ authCode: code as string })

    return response.json({
      ok: true,
      message: "Auth succeded 💪",
      result,
    })
  } catch (error) {
    console.log(error)

    return response.status(500).json({ ok: false, message: "Something went wrong 👎" })
  }
})

export default spotifyAuthRouter
