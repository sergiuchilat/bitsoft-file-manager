import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from '@/app/modules/auth/google-auth/guards/google-oauth.guard';

@ApiTags('Google Authentication')
@Controller({
  version: '1',
  path: '/auth/google'
})
export class GoogleAuthController {
  constructor() {}

  @Get('login')
  @UseGuards(GoogleOauthGuard)
  handleLogin() {
    return 'Google login';
  }

  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  handleRedirect() {
    return 'Google redirect';
  }
}