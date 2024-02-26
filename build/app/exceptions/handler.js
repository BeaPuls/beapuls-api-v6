import { ExceptionHandler } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import { DateTime } from 'luxon';
export default class HttpExceptionHandler extends ExceptionHandler {
    debug = !app.inProduction;
    renderStatusPages = app.inProduction;
    async handle(error, ctx) {
        if ((error.code === 'E_VALIDATION_ERROR' && error.status === 422) ||
            error.code === 'E_VALIDATION_ERROR') {
            return ctx.response.unprocessableEntity({
                status: 422,
                path: ctx.request.url(),
                timestamp: DateTime.local(),
                code: 'E_VALIDATION_ERROR',
                message: error.messages,
                detail: 'Problem with the data validation',
            });
        }
        if ((error.code === 'E_AUTHORIZATION_FAILURE' && error.status === 404) ||
            error.code === 'E_ROW_NOT_FOUND') {
            return ctx.response.notFound({
                status: 404,
                path: ctx.request.url(),
                timestamp: DateTime.local(),
                code: 'E_RESOURCE_NOT_FOUND',
                message: 'The requested resource was not found',
                detail: 'Ensure that the resource exists and that you have to correct permissions',
            });
        }
        if (error.code === 'E_ROUTE_NOT_FOUND') {
            return ctx.response.notFound({
                status: 404,
                path: ctx.request.url(),
                timestamp: DateTime.local(),
                code: 'E_ROUTE_NOT_FOUND',
                message: 'The requested route was not found',
                detail: 'Ensure that the route exists',
            });
        }
        if (typeof error.handle === 'function') {
            return error.handle(error, ctx);
        }
        return ctx.response.internalServerError({
            status: 500,
            path: ctx.request.url(),
            timestamp: DateTime.local(),
            code: 'E_INTERNAL_SERVER_ERROR',
            message: 'A internal server error occured',
        });
    }
    async report(error, ctx) {
        return super.report(error, ctx);
    }
}
//# sourceMappingURL=handler.js.map