import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForgotDto, LoginDto, ProfileDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { User } from '@prisma/client';
import { GetUser } from './decorator';

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
  async signUserUp(dto: SignUpDto) {
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
          email: dto.email,
          dob: dto.dob,
          username: dto.username,
          name: dto.name,
          password: password,
        },
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

      return { message: 'Sign Up successful!', user: safeUser };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(error); // log unexpected errors
      throw new InternalServerErrorException(
        'Something went wrong during login',
      );
    }
  }
  async logUserIn(dto: LoginDto) {
    try {
      // check existing user
      const existingUser = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });
      if (!existingUser) throw new ForbiddenException('Credentials invalid');
      // verify the password
      const passValid = await argon.verify(existingUser.password, dto.password);
      if (!passValid) throw new ForbiddenException('Credentials invalid');
      // return the new user [confirmed login]
      const safeUser = {
        id: existingUser.id,
        userame: existingUser.username,
        dob: existingUser.dob,
        email: existingUser.email,
        name: existingUser.name,
        createdAt: existingUser.createdAt,
      };
      return this.signToken(safeUser.id, safeUser.email, safeUser.name);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(error); // log unexpected errors
      throw new InternalServerErrorException(
        'Something went wrong during login',
      );
    }
  }
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    console.log(user);
    if (!user) throw new NotFoundException('User not found');
    const { password, ...safeUser } = user;
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
    const { password, ...safeProfile } = updatedProfile;
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
    const requiredUser = await this.prisma.user.findUnique(({where: {email: dto.email}}));
    if(!requiredUser) return new NotFoundException('User does not exist');
    return {status: 200, message: `Username: ${requiredUser.username} | Mail sent to ${dto.email}`}
  }
  async sendPasswordResetToEmail(dto: ForgotDto) {
    const requiredUser = await this.prisma.user.findUnique(({where: {email: dto.email}}));
    if(!requiredUser) return new NotFoundException('User does not exist');
    return {status: 200, message: `Password reset instructions mailed to ${dto.email}`}
  }
  async resetThePasswordAfterVerifyingToken() {
    return {status: 200, message: `Password reset successful!`};
  }
  // helper function to sign tokens
  signToken(userId: string, email: string, name: string): Promise<string> {
    const payload = { sub: userId, email, name };
    return this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
