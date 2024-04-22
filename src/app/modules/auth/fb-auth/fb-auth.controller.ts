import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth: Facebook')
@Controller({
  version: '1',
  path: '/auth/fb'
})
export class FbAuthController {
  constructor() {}

  @Get('login')
  handleLogin() {
    return 'Facebook login(needs to be implemented)';
  }

  @Get('complete')
  handleComplete() {
    return 'Facebook complete(needs to be implemented)';
  }

  @Get('status')
  getStatus(){
    return 'Facebook status(needs to be implemented)';
  }
}