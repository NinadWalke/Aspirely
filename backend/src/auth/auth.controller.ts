import { Body, Controller, Get, HttpCode, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotDto, LoginDto, ProfileDto, SignUpDto } from './dto';
import { JwtGuard, RolesGuard } from 'src/core/guard';
import { GetUser, Roles } from 'src/core/decorator';
import type { Request, Response} from 'express';

import type { User } from '@prisma/client';
import { RefreshTokenGuard } from 'src/core/guard/refresh-token.guard';

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
  signup(@Body() dto: SignUpDto, @Res({passthrough: true}) res: Response) {
    return this.authService.signUserUp(dto, res);
  }
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({passthrough: true}) res: Response) {
    return await this.authService.logUserIn(dto, res);
  }
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@GetUser() user: User, @Res({passthrough: true}) res: Response) {
    return this.authService.logUserOut(user.id, res);
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@GetUser() user: User, @Res({passthrough: true}) res: Response) {
    const userId = user.id;
    const refreshToken = user.refreshToken;
    const {accessToken, newRefreshToken} = await this.authService.refreshTokens(userId, refreshToken);
    // set new refresh token cookie
    res.cookie('refresh_token', newRefreshToken, {httpOnly: true, secure: true, sameSite: 'strict'});
    return {accessToken};
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
