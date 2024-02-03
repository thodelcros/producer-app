import { createExpressMiddleware } from "@trpc/server/adapters/express"
import express from "express"

import { checkEnv } from "../env"
import { baseRouter } from "./routes"
import spotifyAuthRouter from "./routes/spotify-auth/spotify-auth.router"

const PORT = 3000

;(async () => {
  checkEnv()

  const api = express()

  api.use(express.json())

  api.use("/spotify-auth", spotifyAuthRouter)

  api.use(
    "/trpc",
    createExpressMiddleware({
      router: baseRouter,
    }),
  )
  await api.listen({ port: PORT }, () => {
    console.log(`> API started 🚀. Server listening on port ${PORT}`)
  })
})().catch((error) => {
  console.error("> API starter error : ", error)

  process.exit(1)
})
