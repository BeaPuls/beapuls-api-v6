export class ApiResponse<T> {
  constructor(
    public statusCode: number,
    public message: string,
    public data: T
  ) {}

  static response<T>(
    ctx: any,
    data: T,
    message: string = 'Success',
    httpCode: number = 200
  ): object {
    return ctx.response.status(httpCode).send({
      success: true,
      message: message,
      data: data,
    })
  }
}
