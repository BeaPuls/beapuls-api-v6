import { defineConfig } from '@adonisjs/auth';
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens';
const authConfig = defineConfig({
    default: 'api',
    guards: {
        api: tokensGuard({
            provider: tokensUserProvider({
                tokens: 'accessTokens',
                model: () => import('#auth/models/user'),
            }),
        }),
    },
});
export default authConfig;
//# sourceMappingURL=auth.js.map