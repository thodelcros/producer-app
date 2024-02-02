import { Router } from "express"
import querystring from "node:querystring"

import {
  PERMISSION_SCOPES,
  REDIRECT_URI,
  SpotifyAuthAdapter,
} from "@/adapters/SpotifyAuthAdapter/SpotifyAdapter"

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

  const spotifyAuthApi = new SpotifyAuthAdapter()

  try {
    const accessToken = await spotifyAuthApi.getAccessToken(code as string)

    return response.json({
      ok: true,
      message: "Auth succeded 💪",
      ...accessToken,
      getOneMore: `${process.env.SPOTIFY_AUTH_CALLBACK_BASE_URL}/spotify-auth`,
    })
  } catch (error) {
    console.log(error)

    return response.status(500).json({ ok: false, message: "Something went wrong 👎" })
  }
})

export default spotifyAuthRouter
