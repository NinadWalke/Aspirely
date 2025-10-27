import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start; // collect ms time taken for request
      const timestamp = new Date().toLocaleString(); // collect the current time of request
      const statusCode = res.statusCode; // collect the status code
      console.log(
        `[${req.method}] ${req.originalUrl} → ${statusCode} | ${duration}ms | ${timestamp}`,
      );
    });
    next();
  }
}
