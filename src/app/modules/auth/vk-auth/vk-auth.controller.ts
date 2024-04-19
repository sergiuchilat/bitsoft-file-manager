import { Controller, Get, HttpException, HttpStatus, Req, Res, Session } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { VkAuthService } from '@/app/modules/auth/vk-auth/vk-auth.service';


@ApiTags('VK Auth')
@Controller({
  version: '1',
  path: 'auth/vk',
})
export class VkAuthController {
  constructor(
    private readonly vkAuthService: VkAuthService,
  ) {}

  @Get('login')
  async handleLogin(@Res() res: Response) {
    res.redirect(this.vkAuthService.generateLoginUrl());
  }

  @Get('complete')
  async handleComplete(
    @Req() req: Request,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const vkCode = req?.query?.code;
    session.user = await this.vkAuthService.handleCompleteLogin(vkCode);
    res
      .status(HttpStatus.OK)
      .send('VK login complete');
  }

  @Get('status')
  async getStatus(@Session() session: Record<string, any>) {

    if (session.user) {
      return this.vkAuthService.getAuthorizedUser (session.user);
    }
    throw new HttpException('User is not logged in', 401);
  }


}