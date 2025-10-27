import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // collect req and res from express
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // collect status of the exception
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    
    // collect message
    const message  = exception instanceof HttpException ? exception.getResponse() : "Internal Server Error";

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      message
    })
  }
}
