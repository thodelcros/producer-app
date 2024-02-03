import { GeniusAdapter } from "@/adapters/MusicDatabaseApi/GeniusAdapter"
import { autocompleteArtists } from "@/core/usecases/autocomplete-artists/autocompleteArtists.usecase"

import { checkEnv } from "../env"

;(async () => {
  checkEnv()

  try {
    const autocompleteArtistOnGenius = autocompleteArtists({
      musicDatabase: new GeniusAdapter(),
    })

    const artists = await autocompleteArtistOnGenius({ query: "ponko" })

    console.log({ artists })
  } catch (error) {
    console.error("[ERROR] : ", error)

    process.exit(1)
  }
})()
