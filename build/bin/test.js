process.env.NODE_ENV = 'test';
import { Ignitor, prettyPrintError } from '@adonisjs/core';
import { apiClient } from '@japa/api-client';
import { configure, processCLIArgs, run } from '@japa/runner';
import 'reflect-metadata';
import env from '../start/env.js';
const APP_ROOT = new URL('../', import.meta.url);
const IMPORTER = (filePath) => {
    if (filePath.startsWith('./') || filePath.startsWith('../')) {
        return import(new URL(filePath, APP_ROOT).href);
    }
    return import(filePath);
};
new Ignitor(APP_ROOT, { importer: IMPORTER })
    .tap((app) => {
    app.booting(async () => {
        await import('../start/env.js');
    });
    app.listen('SIGTERM', () => app.terminate());
    app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate());
})
    .testRunner()
    .configure(async (app) => {
    const { runnerHooks, ...config } = await import('../tests/bootstrap.js');
    processCLIArgs(process.argv.splice(2));
    configure({
        ...app.rcFile.tests,
        ...config,
        ...{
            setup: runnerHooks.setup,
            teardown: runnerHooks.teardown.concat([() => app.terminate()]),
        },
    });
})
    .run(() => run())
    .catch((error) => {
    process.exitCode = 1;
    prettyPrintError(error);
});
configure({
    files: ['tests/**/*.spec.js'],
    plugins: [
        apiClient({
            baseURL: `http://${env.get('HOST')}:${env.get('PORT')}/api`,
        }),
    ],
});
//# sourceMappingURL=test.js.map