import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

const allyConfig = defineConfig({
  spotify: services.spotify({
    clientId: env.get('SPOTIFY_CLIENT_ID'),
    clientSecret: env.get('SPOTIFY_CLIENT_SECRET'),
    callbackUrl: 'http://127.0.0.1:3333/api/spotify/signin-callback'
  })
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}