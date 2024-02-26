import { ErrorCode } from '#exceptions/error_code';
import { Exception } from '@adonisjs/core/exceptions';
export default class ForbidanException extends Exception {
    constructor(message, code) {
        super(message ?? ErrorCode.FORBIDDEN, {
            status: 403,
            code,
        });
    }
}
//# sourceMappingURL=forbiden.exception.js.map