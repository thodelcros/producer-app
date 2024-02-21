import { flush, handle } from "@oclif/core"

import { checkEnv } from "../env"
import { SyncTracksCommand } from "./sync-tracks.command"

checkEnv()

SyncTracksCommand.run().then(
  () => flush(),
  (error) => handle(error),
)
