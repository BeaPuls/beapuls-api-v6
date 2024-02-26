import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';
const AuthController = () => import('#auth/controllers/auth.controller');
const ProfileController = () => import('#profile/controllers/profile_controller');
const AuthSpotifyController = () => import('#auth/controllers/auth_spotify.controller');
router.get('/', async ({ response }) => response.ok({ uptime: Math.round(process.uptime()) }));
router.get('/health', async ({ response }) => {
    response.noContent();
});
router
    .group(() => {
    router
        .group(() => {
        router.post('login', [AuthController, 'login']);
        router.post('register', [AuthController, 'register']);
        router.get('spotify', [AuthSpotifyController, 'authorize']);
        router.get('spotify/callback', [AuthSpotifyController, 'callback']);
        router.get('success', [AuthController, 'success']);
        router
            .group(() => {
            router.post('logout', [AuthController, 'logout']);
            router.get('profile', [ProfileController, 'getUserInfo']);
            router.post('profile', [ProfileController, 'createUserProfile']);
        })
            .use(middleware.auth({
            guards: ['api'],
        }));
    })
        .prefix('auth');
})
    .prefix('api');
//# sourceMappingURL=routes.js.map