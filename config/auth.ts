import { defineConfig, providers } from "@adonisjs/auth";
import { sessionGuard, tokensProvider } from "@adonisjs/auth/session";
import { Authenticators, InferAuthEvents } from "@adonisjs/auth/types";


const rememberTokensProvider = tokensProvider.db({
    table: 'api_tokens',
  })

const authConfig = defineConfig({
    default: 'web',
    guards: {
        web: sessionGuard ({
            provider: providers.lucid({
                model: () => import('#auth/models/user'),
                uids: ['email'],
            }),
            tokens: rememberTokensProvider,
            rememberMeTokenAge: '2 years',
        })
    },
})

export default authConfig



declare module '@adonisjs/auth/types' {
    interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}


declare module '@adonisjs/core/types' {
    interface EventsList extends InferAuthEvents<Authenticators> {}
}