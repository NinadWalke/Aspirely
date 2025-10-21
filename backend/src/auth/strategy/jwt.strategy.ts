import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // default 'jwt'
  constructor(
    config: ConfigService,  // not 'private' here, because the error 'super' must be called pops 
    private prisma: PrismaService,
  ) {
    const JWT_SECRET = config.get('JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }
  async validate(payload: { sub: string; email: string }) {
    // helps add data to req object
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if(user) {
      const {password, ...sanitizedUser} = user;
      return sanitizedUser;
    }
    // If user is null, it returns a 401 error
    return user; // this value is appended to the req object as the user (i.e. req.user)
  }
}
