import { JwtGuard } from '#auth/guards/jwt_guard'
import { defineConfig, providers } from '@adonisjs/auth'
import { sessionGuard } from '@adonisjs/auth/session'
import { Authenticators, InferAuthEvents } from '@adonisjs/auth/types'
import provider from '@adonisjs/core/commands/make/provider'
import config from '@adonisjs/core/services/config'

import { jwtGuard } from '#auth/helpers/helper'
import env from '#start/env'

const authConfig = defineConfig({
  default: 'jwt',
  guards: {
    web: sessionGuard({
      provider: providers.lucid({
        model: () => import('#auth/models/user'),
        uids: ['email'],
      }),
    }),
    jwt: jwtGuard({
      provider: providers.lucid({
        model: () => import('#auth/models/user'),
        uids: ['email'],
      }),
      secret: env.get('APP_KEY'),
    }),
  },
})

export default authConfig

function jwtFactory(ctx) {
  return new JwtGuard(ctx, provider, config)
}

declare module '@adonisjs/auth/types' {
  interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}

declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
