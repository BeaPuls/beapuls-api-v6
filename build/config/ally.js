import env from '#start/env';
import { defineConfig, services } from '@adonisjs/ally';
const allyConfig = defineConfig({
    spotify: services.spotify({
        clientId: env.get('SPOTIFY_CLIENT_ID'),
        clientSecret: env.get('SPOTIFY_CLIENT_SECRET'),
        callbackUrl: env.get('SPOTIFY_CALLBACK_URL', `${env.get('BASE_API_URL')}/auth/spotify/callback`),
        scopes: ['user-read-email', 'user-top-read', 'user-follow-read'],
    }),
});
export default allyConfig;
//# sourceMappingURL=ally.js.map