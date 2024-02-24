import { middleware } from '#start/kernel'
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#auth/controllers/auth.controller')
const ProfileController = () => import('#profile/controllers/profile_controller')
const AuthSpotifyController = () => import('#auth/controllers/auth_spotify.controller')

import { trace } from '@opentelemetry/api'

router.get('/', async ({ response }: HttpContext) =>
  response.ok({ uptime: Math.round(process.uptime()) })
)

router.get('/health', async ({ response }: HttpContext) => {
  response.noContent()
})

// Tracer data
const name = 'beapuls-api'
const version = '1.0.0'
const tracer = trace.getTracer(name, version)

router.get('/trace', async ({ response }: HttpContext) => {
  const span = tracer.startSpan('cal /trace route api')
  console.log(span)
  span.end()
})

router
  .group(() => {
    router
      .group(() => {
        // Unlogged
        // Auth - User
        router.post('login', [AuthController, 'login'])
        router.post('register', [AuthController, 'register'])

        // Auth - Spotify
        router.get('spotify', [AuthSpotifyController, 'authorize'])
        router.get('spotify/callback', [AuthSpotifyController, 'callback'])

        // Others
        router.get('success', [AuthController, 'success'])

        // Logged
        router
          .group((): void => {
            router.post('logout', [AuthController, 'logout'])
            router.get('profile', [ProfileController, 'getUserInfo'])
            router.post('profile', [ProfileController, 'createUserProfile'])
            // router.get('profile/avatar', [ProfileController, 'getUserAvatar'])
            // router.post('profile/avatar', [ProfileController, 'uploadUserAvatar'])
          })
          .use(
            middleware.auth({
              guards: ['api'],
            })
          )
      })
      .prefix('auth')
  })
  .prefix('api')
