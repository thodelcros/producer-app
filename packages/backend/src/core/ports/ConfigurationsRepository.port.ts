import { Configuration } from "../domain/Configuration"

export interface ConfigurationsRepository {
  getAllConfigurations(): Promise<Configuration[]>
}
