import { ErrorCode } from '#exceptions/error_code'
import { Exception } from '@adonisjs/core/exceptions'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new UnAuthorizedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class BadRequestException extends Exception {
  constructor(message?: string, code?: string) {
    super(message ?? ErrorCode.BAD_REQUEST, {
      status: 400,
      code,
    })
  }
}
