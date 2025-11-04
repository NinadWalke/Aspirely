import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Request } from "express";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
      const JWT_REFRESH_SECRET = config.get('JWT_REFRESH_SECRET');
        super({
          jwtFromRequest: ExtractJwt.fromExtractors([
            (req: Request) => req.cookies?.['refresh_token'],
          ]),
            secretOrKey: JWT_REFRESH_SECRET,
            passReqToCallback: true, // needed to access req inside validate()
          });
      }
    validate(req: Request, payload: { sub: string }) {
        const refreshToken = req.cookies['refresh_token'];
        return { ...payload, refreshToken };
      }
}