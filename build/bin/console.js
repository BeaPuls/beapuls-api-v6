import { Ignitor, prettyPrintError } from '@adonisjs/core';
import 'reflect-metadata';
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
    .ace()
    .handle(process.argv.splice(2))
    .catch((error) => {
    process.exitCode = 1;
    prettyPrintError(error);
});
//# sourceMappingURL=console.js.map