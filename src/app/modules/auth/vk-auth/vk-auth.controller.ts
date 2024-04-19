import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
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
  async handleComplete(@Req() req: Request, @Res() res: Response) {
    const vkCode = req?.query?.code;
    res
      .status(HttpStatus.OK)
      .send(await this.vkAuthService.handleCompleteLogin(vkCode));
  }


}