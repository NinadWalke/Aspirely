import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, SignUpDto } from './dto';
import * as argon from 'argon2';

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
  constructor(private prisma: PrismaService) {}
  isUserAuthenticated() {
    return false;
  }
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
          name: dto.name,
          password: password,
        },
      });
      // return the new user
      const safeUser = {
        id: newUser.id,
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
        where: { email: dto.email },
      });
      if (!existingUser) throw new ForbiddenException('Credentials invalid');
      // verify the password
      const passValid = await argon.verify(existingUser.password, dto.password);
      if (!passValid) throw new ForbiddenException('Credentials invalid');
      // sign user in
      console.log(`User ${existingUser.email} has logged in successfully!`);
      // return the new user
      const safeUser = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        createdAt: existingUser.createdAt,
      };
      return { message: 'Login successful!', user: safeUser };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(error); // log unexpected errors
      throw new InternalServerErrorException(
        'Something went wrong during login',
      );
    }
  }
}
