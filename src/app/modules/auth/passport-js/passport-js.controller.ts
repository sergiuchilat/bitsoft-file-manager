import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleGuard } from '@/app/modules/auth/passport-js/guards/google.guard';
import { VkGuard } from '@/app/modules/auth/passport-js/guards/vk.guard';
import { FbGuard } from '@/app/modules/auth/passport-js/guards/fb.guard';
import { PassportJsService } from '@/app/modules/auth/passport-js/passport-js.service';
import { OauthProvider } from '@/app/modules/auth/passport-js/enums/provider.enum';

@Controller({
  version: '1',
  path: '/auth'
})
@ApiTags('Auth: PassportJs')
export class PassportJsController {

  constructor(
    private readonly passportJsService: PassportJsService
  ) {}

  @Get('google/login')
  @UseGuards(GoogleGuard)
  handleGoogleLogin() {
    return 'Google login';
  }

  @Get('google/complete')
  @UseGuards(GoogleGuard)
  async handleGoogleComplete(@Request() req, @Response() res){
    return this.passportJsService.login(req, OauthProvider.GOOGLE);
    //res.redirect('http://localhost:3000');
  }

  @Get('vk/login')
  @UseGuards(VkGuard)
  handleVkLogin() {
    return 'VK login';
  }

  @Get('vk/complete')
  @UseGuards(VkGuard)
  handleVkComplete(@Request() req) {
    return this.passportJsService.login(req, OauthProvider.VK);
  }

  @Get('fb/login')
  @UseGuards(FbGuard)
  handleFbLogin() {
    return 'FB login';
  }

  @Get('fb/complete')
  @UseGuards(FbGuard)
  async handleFbComplete(@Request() req){
    return await this.passportJsService.login(req, OauthProvider.FACEBOOK);
  }

}