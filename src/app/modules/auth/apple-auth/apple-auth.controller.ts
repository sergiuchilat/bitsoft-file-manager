import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth: Apple')
@Controller({
  version: '1',
  path: '/auth/apple'
})
export class AppleAuthController {
  constructor() {}

  @ApiOperation({ summary: 'Apple login' })
  @Get('login')
  handleLogin() {
    return 'Apple login';
  }

  @ApiOperation({ summary: 'Apple complete' })
  @Get('complete')
  handleComplete() {
    return 'Apple complete';
  }

  @ApiOperation({ summary: 'Apple status' })
  @Get('status')
  getStatus() {
    return 'Apple status';
  }
}