import { Controller, Get, HttpException, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from '@/app/modules/auth/google-auth/google-auth.guard';
import { Request } from 'express';
import { GoogleAuthService } from '@/app/modules/auth/google-auth/google-auth.service';

@ApiTags('Google Authentication')
@Controller({
  version: '1',
  path: '/auth/google'
})
export class GoogleAuthController {

  constructor (
    private readonly googleAuthService: GoogleAuthService
  ) {
  }

  @Get('login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return 'Google login';
  }

  @Get('redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return 'Google redirect';
  }

  @Get('status')
  getStatus(@Req() request: Request){
    if (request.user) {
      return this.googleAuthService.getAuthorizedUser(request.user);
    }
    throw new HttpException('User is not logged in', 401);
  }
}