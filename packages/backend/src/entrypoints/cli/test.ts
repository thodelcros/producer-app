import { GeniusAdapter } from "@/adapters/MusicDatabaseApi/GeniusAdapter"
import { retrieveArtistProductions } from "@/core/usecases/retrieve-artist-productions/retrieveArtistProductions.usecase"

import { checkEnv } from "../env"

;(async () => {
  checkEnv()

  try {
    const retrieveArtistProductionsFromGenius = retrieveArtistProductions({
      trackRepository: new GeniusAdapter(),
    })

    const tracks = await retrieveArtistProductionsFromGenius({ artistId: "1" })

    console.log({ tracks })
  } catch (error) {
    console.error("[ERROR] : ", error)

    process.exit(1)
  }
})()
