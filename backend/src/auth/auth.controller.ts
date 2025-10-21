import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto';
import { JwtGuard } from './guard';
import type { User } from '@prisma/client';
import { GetUser } from './decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get()
  isAuthenticated(@GetUser() user: User) {
    if (user) return { isAuth: true, user: user };
    return { isAuth: false };
  }
  @Post('register')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signUserUp(dto);
  }
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.logUserIn(dto);
  }
  @UseGuards(JwtGuard)
  @Get('profile')
  getUserProfile() {
    return {profile: 'These are the user profile details'};
  }
  @Post('forgot-username')
  sendUsernameToEmail() {
    return '';
  }
  @Post('forgot-password')
  sendPasswordResetInstructions() {
    return '';
  }
  @Post('reset-password')
  resetThePasswordAfterVerifyingToken() {
    return '';
  }
}
