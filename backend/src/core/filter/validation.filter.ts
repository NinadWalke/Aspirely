import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';

import { Response } from 'express';

// Validation filter installed to handle class-validator issues, as the default 
// thrown error is bad request. We shape it according to our need
@Catch(BadRequestException)
export class ValidationFilter<T> implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // collect validation error
    const validationErrors = (exception.getResponse() as any);    
    response.status(400).json({
      success: false,
      timestamp: new Date().toISOString(),
      errors: validationErrors
    })
  }
}
