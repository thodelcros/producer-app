import { DbConfigurationsRepository } from "@/adapters/ConfigurationsRepository/DbConfigurationsRepository"
import { GeniusAdapter } from "@/adapters/MusicDatabase/GeniusAdapter"
import { SpotifyAdapter } from "@/adapters/StreamingPlatform/SpotifyAdapter"
import { DbUserRepository } from "@/adapters/UsersRepository/DbUserRepository"
import { SyncTracks } from "@/core/usecases/sync-tracks/syncTracks.usecase"

import { checkEnv } from "../env"

;(async () => {
  checkEnv()

  try {
    const syncTracksBetweenGeniusAndSpotify = new SyncTracks({
      musicDatabase: new GeniusAdapter(),
      streamingPlatform: new SpotifyAdapter(),
      configurationRepository: new DbConfigurationsRepository(),
      userRepository: new DbUserRepository(),
    })

    await syncTracksBetweenGeniusAndSpotify.execute()
  } catch (error) {
    console.error("[ERROR] : ", error)

    process.exit(1)
  }
})()
