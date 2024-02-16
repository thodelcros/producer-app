import { v4 as uuidv4 } from "uuid"

import { IdAdapter } from "@/core/ports/IdAdapter.port"

export class UuidGenerator implements IdAdapter {
  generate() {
    return uuidv4()
  }
}
