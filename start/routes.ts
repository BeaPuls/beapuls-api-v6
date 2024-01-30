import { middleware } from '#start/kernel';
import { HttpContext } from '@adonisjs/core/http';
import router from '@adonisjs/core/services/router';
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


const AuthController = () => import('#auth/controllers/auth_controller');
const SpotifyController = () => import('#auth/controllers/spotify_controller');


router.get('/', async ({response}: HttpContext) => response.ok({uptime: Math.round(process.uptime())}))


router.get('/health', async ({ response }: HttpContext) => {
    response.noContent()
})

router.group(() => {
    // Auth - User
    router.group(() => {
        router.post('signin', [AuthController, 'create'])
        router.post('store', [AuthController, 'store'])
    }).prefix("auth");
    
    
    // Auth - Spotify
    router.group(() => {
        router.get('signin', [SpotifyController, 'create'])
        router.get('signin-callback', [SpotifyController, 'store'])
        router.post('signout', [SpotifyController, 'destroy'])
    }).prefix("spotify");


    router.group((): void => {
        // router.get('profile')
    })
    .middleware(middleware.auth())
}).prefix("api");


