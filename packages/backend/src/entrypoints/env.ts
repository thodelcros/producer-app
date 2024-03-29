import { z } from "zod"

const envVars = z.object({
  SPOTIFY_API_CLIENT_ID: z.string(),
  SPOTIFY_API_CLIENT_SECRET: z.string(),
  SPOTIFY_AUTH_CALLBACK_BASE_URL: z.string(),
  DATABASE_CONNECTION_STRING: z.string(),
})

export const checkEnv = () => {
  envVars.parse(process.env)
}

declare global {
  namespace NodeJS {
    // rome-ignore lint/nursery/noEmptyInterface: <explanation>
    interface ProcessEnv extends z.infer<typeof envVars> {}
  }
}
