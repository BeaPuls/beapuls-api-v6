import { ErrorCode } from '#exceptions/error_code';
import { Exception } from '@adonisjs/core/exceptions';
export default class BadRequestException extends Exception {
    constructor(message, code) {
        super(message ?? ErrorCode.BAD_REQUEST, {
            status: 400,
            code,
        });
    }
}
//# sourceMappingURL=bad_request.exception.js.map