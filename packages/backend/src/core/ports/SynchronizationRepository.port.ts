import { Synchronization } from "../domain/Synchronization"

export interface SynchronizationRepository {
  getAllSynchronizations(): Promise<Synchronization[]>
}
