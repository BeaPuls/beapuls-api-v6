import router from '@adonisjs/core/services/router';
import server from '@adonisjs/core/services/server';
server.errorHandler(() => import('../app/exceptions/handler.js'));
server.use([
    () => import('#middleware/container_bindings_middleware'),
    () => import('../app/middleware/force_json_response_middleware.js'),
    () => import('@adonisjs/cors/cors_middleware'),
]);
router.use([
    () => import('@adonisjs/core/bodyparser_middleware'),
    () => import('@adonisjs/auth/initialize_auth_middleware'),
    () => import('@adonisjs/session/session_middleware'),
]);
export const middleware = router.named({
    guest: () => import('#middleware/guest_middleware'),
    auth: () => import('#middleware/auth_middleware'),
});
//# sourceMappingURL=kernel.js.map