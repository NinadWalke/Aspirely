import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForgotDto, LoginDto, ProfileDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import type { Request, Response } from 'express';

// -- Types of Exceptions --
// Exception	HTTP Status
// BadRequestException	        400
// UnauthorizedException	    401
// ForbiddenException	        403
// NotFoundException	        404
// ConflictException	        409
// InternalServerErrorException	500

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {} // import JwtService as jwt to help us access async signing of tokens
  async signUserUp(dto: SignUpDto, res: Response) {
    try {
      // generate password hash
      const password = await argon.hash(dto.password);
      // check existing user
      const userExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (userExists) throw new ConflictException('Email already registered!');
      // save the new user to database
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          dob: dto.dob,
          username: dto.username.toLowerCase(),
          name: dto.name,
          password: password,
        },
      });
      // send access_token & refresh_token
      const accessToken = await this.signToken(
        newUser.id,
        newUser.email,
        newUser.name,
      );
      const refreshToken = await this.signRefreshToken(newUser.id, newUser.email, newUser.name);
      await this.updateRefreshTokenHash(newUser.id, refreshToken);
      // send rt in cookie
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      // return the new user
      const safeUser = {
        id: newUser.id,
        userame: newUser.username,
        dob: newUser.dob,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
      };
      return { message: 'Sign Up successful!', accessToken, user: safeUser };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(error); // log unexpected errors
      throw new InternalServerErrorException(
        'Something went wrong during login',
      );
    }
  }
  async logUserIn(dto: LoginDto, res: Response) {
    try {
      // check existing user
      const existingUser = await this.prisma.user.findUnique({
        where: { username: dto.username.toLowerCase() },
      });
      if (!existingUser) throw new ForbiddenException('Credentials invalid');
      // verify the password
      const passValid = await argon.verify(existingUser.password, dto.password);
      if (!passValid) throw new ForbiddenException('Credentials invalid');
      // return the new user [confirmed login]
      const safeUser = {
        id: existingUser.id,
        userame: existingUser.username.toLowerCase(),
        dob: existingUser.dob,
        email: existingUser.email.toLowerCase(),
        name: existingUser.name,
        createdAt: existingUser.createdAt,
      };
      // access & refresh token flow
      const accessToken = await this.signToken(
        existingUser.id,
        existingUser.email,
        existingUser.name,
      );
      const refreshToken = await this.signRefreshToken(existingUser.id, existingUser.email, existingUser.name);
      await this.updateRefreshTokenHash(existingUser.id, refreshToken);
      // send rt in cookie
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      return { accessToken, user: safeUser };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(error); // log unexpected errors
      throw new InternalServerErrorException(
        'Something went wrong during login',
      );
    }
  }
  async logUserOut(userId: string, res: Response) {
    // Remove refresh token hash from DB so it's no longer valid
    await this.prisma.user.updateMany({
      where: { id: userId },
      data: { refreshToken: null },
    });

    // Clear the cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { message: 'Logged out successfully' };
  }
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const { password, refreshToken, ...safeUser } = user;
    return safeUser;
  }
  async updateUserProfile(userId: string, dto: ProfileDto) {
    const updatedProfile = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
      },
    });
    if (!updatedProfile) throw new NotFoundException('Profile not found');
    const { password, refreshToken, ...safeProfile } = updatedProfile;
    return safeProfile;
  }
  async getAnotherUserProfile(userId: string) {
    const anotherUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!anotherUser) throw new NotFoundException('User not found');
    const { password, ...safeUser } = anotherUser;
    return safeUser;
  }
  async sendUsernameToEmail(dto: ForgotDto) {
    const requiredUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!requiredUser) return new NotFoundException('User does not exist');
    return {
      status: 200,
      message: `Username: ${requiredUser.username} | Mail sent to ${dto.email}`,
    };
  }
  async sendPasswordResetToEmail(dto: ForgotDto) {
    const requiredUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!requiredUser) return new NotFoundException('User does not exist');
    return {
      status: 200,
      message: `Password reset instructions mailed to ${dto.email}`,
    };
  }
  async resetThePasswordAfterVerifyingToken() {
    return { status: 200, message: `Password reset successful!` };
  }
  // refresh token
  async refreshTokens(userId: string, refreshToken: string | null) {
    if (!refreshToken)
      throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
    // collect user and refresh token
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken)
      throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
    // check with argon if rt is valid
    const isValid = await argon.verify(user.refreshToken, refreshToken);
    if (!isValid) throw new ForbiddenException('Access Denied');
    // create new access token & refresh token
    const accessToken = await this.signToken(userId, user.email, user.name);
    const newRefreshToken = await this.signRefreshToken(userId, user.email, user.name);
    // update new rt in user
    await this.updateRefreshTokenHash(userId, newRefreshToken);
    return { accessToken, newRefreshToken };
  }
  // -- helper functions --
  // sign access tokens
  signToken(userId: string, email: string, name: string): Promise<string> {
    const payload = { sub: userId, email, name };
    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }
  // sign refresh tokens
  async signRefreshToken(userId: string, email: string, name: string): Promise<string> {
    const payload = { sub: userId, email, name };
    return this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });
  }
  // update refresh tokens in DB
  async updateRefreshTokenHash(userId: string, token: string) {
    const hash = await argon.hash(token);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }
}
