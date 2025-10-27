import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  NotAcceptableException,
} from '@nestjs/common';

interface UserRecord {
  count: number;
  windowStart: number;
}

const userRequests = new Map<string, UserRecord>(); // in-memory map to store user requests [replace with redis]

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly LIMIT = 5; // max requests
  private readonly WINDOW = 60_000; // time window in ms (1 min)
  use(req: any, res: any, next: () => void) {
    const userOrIp = req.user?.id || req.ip;
    const now = Date.now(); // current request time
    let record: UserRecord | undefined = userRequests.get(userOrIp); // check if the user record exists (req sent recently)
    // if no record, new request
    if (!record) {
      record = { count: 1, windowStart: now };
      userRequests.set(userOrIp, record); // update the userRequests with current tag
    } else {
      // check if window expired
      if (now - record.windowStart > this.WINDOW) {
        // reset window if the time is valid [req time is ahead of the last window]
        record.count = 1;
        record.windowStart = now;
      } else record.count += 1;
    }
    userRequests.set(userOrIp, record); // save record in memory/redis
    // if record count exceeds, throw TooManyRequestsException
    if (record.count > this.LIMIT) {
      const retryAfter = Math.ceil(
        (this.WINDOW - (now - record.windowStart)) / 1000,
      ); // in seconds
      res.setHeader('Retry-After', retryAfter);
      throw new HttpException(
        `Too many requests sent. Please try again in ${retryAfter} seconds`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    next();
  }
}
