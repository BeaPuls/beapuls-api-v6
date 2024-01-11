/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';

const AuthController = () => import('#auth/controllers/auth_controller');


router.get('/', async ({response}) => response.ok({uptime: Math.round(process.uptime())}))


router.get('/health', async ({ response }) => {
    response.noContent()
})


router.get('/signin', [AuthController, 'create'])
router.get('/signin-callback', [AuthController, 'store'])

