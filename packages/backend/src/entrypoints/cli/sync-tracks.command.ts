import { Command, Config, ux } from "@oclif/core"
import crypto from "crypto"
import express from "express"
import figlet from "figlet"
import http from "http"
import querystring from "node:querystring"

import { DbConfigurationsRepository } from "@/adapters/ConfigurationsRepository/DbConfigurationsRepository"
import { GeniusAdapter } from "@/adapters/MusicDatabase/GeniusAdapter"
import {
  PERMISSION_SCOPES,
  REDIRECT_URI,
  BASE_URL as SPOTIFY_AUTH_BASE_URL,
  SpotifyAuthAdapter,
} from "@/adapters/SpotifyAuthAdapter/SpotifyAuthAdapter"
import { SpotifyAdapter } from "@/adapters/StreamingPlatform/SpotifyAdapter"
import { DbUserRepository } from "@/adapters/UsersRepository/DbUserRepository"
import { UuidGenerator } from "@/adapters/utils/UuidGenerator"
import { User } from "@/core/domain/User"
import { autocompleteArtists } from "@/core/usecases/autocomplete-artists/autocompleteArtists.usecase"
import { createConfiguration } from "@/core/usecases/create-configuration/create-configuration.usecase"
import { registerUser } from "@/core/usecases/register-user/register-user.usecase"
import { retrieveUserPlaylists } from "@/core/usecases/retrieve-user-playlists/retrieve-user-playlists.usecase"
import { SyncTracks } from "@/core/usecases/sync-tracks/syncTracks.usecase"

export class SyncTracksCommand extends Command {
  #server: http.Server
  #state: string | null = null
  #authCompleted: Promise<User>

  constructor(argv: string[], config: Config) {
    super(argv, config)

    const server = express()

    let resolveAuthCompleted: (user: User) => void
    let rejectAuthCompleted: () => void

    this.#authCompleted = new Promise((resolve, reject) => {
      resolveAuthCompleted = resolve
      rejectAuthCompleted = reject
    })

    server.get("/spotify-auth", (_request, response) => {
      this.#state = crypto.randomBytes(8).toString("hex")

      const spotifyAuthParams = querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_API_CLIENT_ID,
        scope: PERMISSION_SCOPES,
        redirect_uri: REDIRECT_URI,
        state: this.#state,
      })

      return response.redirect(`${SPOTIFY_AUTH_BASE_URL}/authorize?${spotifyAuthParams}`)
    })

    server.get("/spotify-auth/callback", async (request, response) => {
      const {
        query: { code, state },
      } = request

      if (!state || state !== this.#state || !code) {
        return response.json({ ok: false, code, state, message: "Auth failed 🤕" })
      }

      const persistSpotifyUserInDb = await registerUser({
        streamingPlatformAuthAdapter: new SpotifyAuthAdapter(),
        streamingPlatform: new SpotifyAdapter(),
        idGenerator: new UuidGenerator(),
        userRepository: new DbUserRepository(),
      })

      try {
        const { user, action } = await persistSpotifyUserInDb({ authCode: code as string })

        resolveAuthCompleted(user)

        return response.json({
          ok: true,
          message: `Auth succeded 💪 ${action === "created" ? "Welcome" : "Welcome back"} ! You can close this tab and go back to terminal.`,
        })
      } catch (error) {
        console.log(error)

        rejectAuthCompleted()

        return response.status(500).json({ ok: false, message: "Something went wrong 👎" })
      }
    })

    this.#server = http.createServer(server)
  }

  async run() {
    const { default: open } = await import("open")
    const { default: chalk } = await import("chalk")
    const { default: inquirer } = await import("inquirer")

    await this.logAscii("Producer app")

    await this.log("Welcome 👋 !")
    await this.log("To use this service, you must have a Spotify account.")
    const openBrowserToAuthenticate = await ux.confirm(
      "The next step will invite you to authenticate in a browser tab. Do you want to continue ? " +
        chalk.gray("(y/n) "),
    )

    if (!openBrowserToAuthenticate) {
      return
    }

    this.startWebServer()

    this.log("Opening browser...")

    // Start the OAuth flow
    await open(`${process.env.SPOTIFY_AUTH_CALLBACK_BASE_URL}/spotify-auth`)

    const user = await this.#authCompleted.catch(() => {
      return null
    })

    this.stopWebServer()

    if (!user) {
      this.log(chalk.red("Auth failed !"))
      return
    }

    await this.log(chalk.green(`Log in as ${user.email} !`))
    await ux.anykey("Press any key to continue")

    const { producerQuery } = await inquirer.prompt([
      {
        type: "input",
        name: "producerQuery",
        message: "First, type the name of any producer you like ",
      },
    ])

    const artists = await autocompleteArtists({ musicDatabase: new GeniusAdapter() })({
      query: producerQuery,
    })

    const { musicDatabaseArtistId } = await inquirer.prompt([
      {
        type: "list",
        name: "musicDatabaseArtistId",
        choices: artists.map(({ name, id }) => ({ name, value: id })),
        message: "Choose the one you intended ",
        loop: false,
      },
    ])

    const playlists = await retrieveUserPlaylists({
      streamingPlatform: new SpotifyAdapter(),
      usersRepository: new DbUserRepository(),
    })({ email: user.email })

    if (!playlists) {
      this.log(chalk.red("No playlists found. Create a playlist on Spotify first"))
      return
    }

    const { streamingPlatformPlaylistId } = await inquirer.prompt([
      {
        type: "list",
        name: "streamingPlatformPlaylistId",
        choices: playlists.map(({ name, id }) => ({ name, value: id })),
        message: "Choose the playlist you would like to populate ",
        loop: false,
      },
    ])

    const toto = await createConfiguration({
      configurationsRepository: new DbConfigurationsRepository(),
      idGenerator: new UuidGenerator(),
    })({ userId: user.id, musicDatabaseArtistId, streamingPlatformPlaylistId })

    this.log("All set up !")

    const startSync = await ux.confirm(
      "Do you want to proceed to synchronization now ? " + chalk.gray("(y/n) "),
    )

    if (startSync) {
      const syncTracks = new SyncTracks({
        configurationRepository: new DbConfigurationsRepository(),
        musicDatabase: new GeniusAdapter(),
        streamingPlatform: new SpotifyAdapter(),
        userRepository: new DbUserRepository(),
      })

      ux.action.start("Synchronization in progress")

      syncTracks.execute().then(() => {
        ux.action.stop("Synchronization all done, go check your playlist on Spotify 😎")
      })
    }
  }

  async logAscii(text: string) {
    return new Promise((resolve, reject) => {
      figlet(text, (error, data) => {
        if (error) {
          return reject(error)
        }

        console.log(data)
        return resolve(data)
      })
    })
  }

  async startWebServer() {
    this.#server.listen(3001, "0.0.0.0")
  }

  async stopWebServer() {
    this.#server.close()
  }
}
