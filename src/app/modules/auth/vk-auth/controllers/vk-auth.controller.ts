import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { catchError } from 'rxjs';
import AppConfig from '@/config/app-config';

@ApiTags('VK Auth')
@Controller({
  version: '1',
  path: 'auth/vk',
})
export class VkAuthController {
  constructor(
    private readonly httpService: HttpService,
  ) {

  }

  @Get('login')
  async handleLogin(@Req() req: Request, @Res() res: Response) {
    res.redirect([
      `https://oauth.vk.com/authorize?client_id=${AppConfig.authProviders.vk.clientId}`,
      `&redirect_uri=${AppConfig.authProviders.vk.redirectURL}`,
      '&scope=email&response_type=code',
    ].join(''));
    return 'vk auth';
  }

  @Get('complete')
  handleComplete(@Req() req: Request, @Res() res: Response) {
    try {
      const vkCode = req.query.code;
      console.log('vk auth redirect', vkCode);
      this.httpService.post('https://oauth.vk.com/access_token').pipe(
        catchError((error) => {
          throw `An error happened. Msg: ${JSON.stringify(
            error?.response?.data,
          )}`;
        }),
      );

      const accessTokenGetUrl = [
        `https://oauth.vk.com/access_token?code=${vkCode}`,
        `&client_id=${AppConfig.authProviders.vk.clientId}`,
        `&client_secret=${AppConfig.authProviders.vk.accessToken}`,
        `&redirect_uri=${AppConfig.authProviders.vk.redirectURL}`,
      ].join('');

      this.httpService.axiosRef.post (accessTokenGetUrl, )
        .then (async(response) => {
          console.log ('response', response.data);
          const userInfo = await this.getUserInfo(response.data.access_token);
          console.log('userInfo', userInfo);
          //return response.data;
          res.status(200).send('vk auth complete');
        })
        .catch (error => {
          console.error ('error', error);
          return error;
        });

    } catch (e) {
      console.error(e);
    }
    return 'vk auth complete';
  }

  private async getUserInfo(accessToken: string) {
    try {
      const userInfoGetUrl = 'https://api.vk.com/method?users.get' + accessToken + '&fields=nickname&v=5.131';

      this.httpService.axiosRef.post (userInfoGetUrl, )
        .then (response => {
          console.log ('response', response.data);
          return response.data;
        })
        .catch (error => {
          console.error ('error', error);
          return error;
        });
    } catch (e) {
      console.error(e);
    }
  }
}