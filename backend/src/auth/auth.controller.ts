import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotDto, LoginDto, ProfileDto, SignUpDto } from './dto';
import { JwtGuard } from './guard';
import { GetUser } from './decorator';

import type { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Get()
  async isAuthenticated(@GetUser() user: User) {
    if (user) return { isAuth: true, user: user };
    return { isAuth: false };
  }
  @Post('register')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signUserUp(dto);
  }
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.logUserIn(dto);
  }
  @UseGuards(JwtGuard)
  @Get('profile')
  getUserProfile(@GetUser() user: User) {
    return this.authService.getCurrentUser(user.id);
  }
  @UseGuards(JwtGuard)
  @Put('profile')
  updateUserProfile(@GetUser() user: User, @Body() dto: ProfileDto) {
    return this.authService.updateUserProfile(user.id, dto);
  }
  @UseGuards(JwtGuard)
  @Get('profile/:id')
  getAnotherUserProfile(@Param('id') id: string) {
    return this.authService.getAnotherUserProfile(id);
  }
  @Post('forgot-username')
  sendUsernameToEmail(@Body() dto: ForgotDto) {
    return this.authService.sendUsernameToEmail(dto);
  }
  @Post('forgot-password')
  sendPasswordResetInstructions(@Body() dto: ForgotDto) {
    return this.authService.sendPasswordResetToEmail(dto);
  }
  @Post('reset-password')
  resetThePasswordAfterVerifyingToken() {
    return this.authService.resetThePasswordAfterVerifyingToken();
  }
}
