import { Env } from '@adonisjs/core/env';
export default await Env.create(new URL('../', import.meta.url), {
    NODE_ENV: Env.schema.enum(['development', 'production', 'test']),
    PORT: Env.schema.number(),
    APP_KEY: Env.schema.string(),
    HOST: Env.schema.string({ format: 'host' }),
    LOG_LEVEL: Env.schema.string(),
    CACHE_VIEWS: Env.schema.boolean(),
    DB_HOST: Env.schema.string({ format: 'host' }),
    DB_PORT: Env.schema.number(),
    DB_USER: Env.schema.string(),
    DB_PASSWORD: Env.schema.string.optional(),
    DB_DATABASE: Env.schema.string(),
    SESSION_DRIVER: Env.schema.enum(['cookie', 'memory']),
    TZ: Env.schema.enum(['UTC']),
    SPOTIFY_CLIENT_ID: Env.schema.string(),
    SPOTIFY_CLIENT_SECRET: Env.schema.string(),
    SPOTIFY_URL: Env.schema.string.optional({ format: 'url' }),
    SPOTIFY_CALLBACK_URL: Env.schema.string.optional({ format: 'url' }),
    SPOTIFY_SUCCESS_URL: Env.schema.string.optional({ format: 'url' }),
    BASE_API_URL: Env.schema.string({ format: 'url' }),
});
//# sourceMappingURL=env.js.map