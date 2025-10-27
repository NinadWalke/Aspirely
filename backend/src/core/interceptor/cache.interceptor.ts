import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, any>(); // simple in memory cache
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request; // extract request method and url

    // Skip caching for unauthenticated users [at public routes]
    if((!request.user || !request.user.id) || method !== "GET") {
      return next.handle();  
    }
    // cache key for authenticated users with their id
    const cacheKey = `${method}-${url}-${request.user?.id}`; // create a key value from our cache map

    // if cache hit, return
    if (this.cache.has(cacheKey)) {
      console.log(`Cache hit for ${cacheKey}`);
      return of(this.cache.get(cacheKey)); // return Observable
    }
    console.log(`Cache miss for ${cacheKey}`);
    // handle miss
    return next.handle().pipe(
      tap((responseData) => {
        console.log(`Caching response for: ${cacheKey}`); // print to console
        this.cache.set(cacheKey, responseData); // cache the response in memory with curr key
        // TTL (Time to live) -> Clear after 30s
        setTimeout(() => this.cache.delete(cacheKey), 30_000); // delete after 30 seconds
      }),
    );
  }
}
