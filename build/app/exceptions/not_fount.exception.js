import { ErrorCode } from '#exceptions/error_code';
import { Exception } from '@adonisjs/core/exceptions';
export default class NotFountException extends Exception {
    constructor(message, code) {
        super(message ?? ErrorCode.NOT_FOUND, {
            status: 404,
            code,
        });
    }
}
//# sourceMappingURL=not_fount.exception.js.map