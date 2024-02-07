import { GeniusAdapter } from "@/adapters/MusicDatabase/GeniusAdapter"
import { SpotifyAdapter } from "@/adapters/StreamingPlatform/SpotifyAdapter"
import { SyncTracks } from "@/core/usecases/sync-tracks/syncTracks.usecase"

import { checkEnv } from "../env"

;(async () => {
  checkEnv()

  try {
    const usecase = new SyncTracks({
      musicDatabase: new GeniusAdapter(),
      streamingPlatform: new SpotifyAdapter(),
      synchronizationRepository: {
        getAllSynchronizations: () =>
          Promise.resolve([
            {
              id: "1",
              userId: "1",
              streamingPlatformPlaylistId: "3CrkDrjkEFrfM4Anyv0SWF",
              musicDatabaseArtistId: "558028", // JayJay
              active: true,
            },
          ]),
      },
    })

    await usecase.execute()
  } catch (error) {
    console.error("[ERROR] : ", error)

    process.exit(1)
  }
})()
