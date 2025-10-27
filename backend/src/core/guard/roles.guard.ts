import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor (private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if(!requiredRoles) return true;  // no roles req
    // collect request and then the user
    const request = context.switchToHttp().getRequest();  
    const user = request.user;
    return requiredRoles.includes(user?.role);  // return T/F based on if user is authorized or not
  }
}
