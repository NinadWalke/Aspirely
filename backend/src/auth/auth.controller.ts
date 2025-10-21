import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get()  
  isAuthenticated() {
    return { isAuth: this.authService.isUserAuthenticated() };
  }
  @Post('register')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signUserUp(dto);
  }
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.logUserIn(dto);
  }
  @Get('profile')
  getUserProfile() {
    return '';
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
