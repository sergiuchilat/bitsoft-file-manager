import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth: X')
@Controller({
  version: '1',
  path: '/auth/x'
})
export class XAuthController {
  constructor() {}

  @ApiOperation({ summary: 'X login(needs to be implemented)' })
  @Get('login')
  handleLogin() {
    return 'X login';
  }

  @ApiOperation({ summary: 'X complete(needs to be implemented)' })
  @Get('complete')
  handleComplete() {
    return 'X complete';
  }

  @ApiOperation({ summary: 'X status(needs to be implemented)' })
  @Get('status')
  getStatus() {
    return 'X status';
  }
}
