import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth: Steam')
@Controller({
  version: '1',
  path: '/auth/steam'
})
export class SteamAuthController {

  constructor() {}

  @ApiOperation({ summary: 'Steam login(needs to be implemented)' })
  @Get('login')
  handleLogin() {
    return 'Steam login';
  }

  @ApiOperation({ summary: 'Steam auth complete(needs to be implemented)' })
  @Get('complete')
  handleComplete() {
    return 'Steam auth complete';
  }

  @ApiOperation({ summary: 'Steam auth status(needs to be implemented)' })
  @Get('status')
  getStatus(){
    return 'Steam status';
  }
}