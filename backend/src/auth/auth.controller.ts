import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('check')
  isAuthenticated() {
    return { isAuth: this.authService.isUserAuthenticated() };
  }
  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signUserUp(dto);
  }
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.logUserIn(dto);
  }
}
