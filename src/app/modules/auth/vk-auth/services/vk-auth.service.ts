import { Injectable } from '@nestjs/common';
import AppConfig from '@/config/app-config';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { VkAuthEntity } from '@/app/modules/auth/vk-auth/entities/vk-auth.entity';
import { VkAuthRepository } from '@/app/modules/auth/vk-auth/repositories/vk-auth.repository';
import { UsersService } from '@/app/modules/users/services/users.service';
import { DataSource } from 'typeorm';

@Injectable ()
export class VkAuthService {
  constructor (
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
    @InjectRepository (VkAuthEntity) private readonly vkAuthRepository: VkAuthRepository,
  ) {
  }

  generateLoginUrl (): string {
    return [
      `https://oauth.vk.com/authorize?client_id=${ AppConfig.authProviders.vk.clientId }`,
      `&redirect_uri=${ AppConfig.authProviders.vk.redirectURL }`,
      '&scope=email&response_type=token',
    ].join ('');
  }

  async handleCompleteLogin (vkCode: any) {
    try {
      const accessTokenGetUrl = [
        `https://oauth.vk.com/access_token?code=${ vkCode }`,
        `&client_id=${ AppConfig.authProviders.vk.clientId }`,
        `&client_secret=${ AppConfig.authProviders.vk.accessToken }`,
        `&redirect_uri=${ AppConfig.authProviders.vk.redirectURL }`,
        '&scope=email&response_type=token'
      ].join ('');

      this.httpService.axiosRef.post (accessTokenGetUrl,)
        .then (async (response) => {
          console.log ('response', response.data);
          const userInfo =  await this.getUserInfo (response.data.access_token);
          console.log ('userInfo', userInfo);
          await this.register(response.data.user_id);
          return {};
        })
        .catch (error => {
          console.error ('error', error);
          return error;
        });

    } catch (error) {
      console.error ('error', error);
    }
  }

  private async getUserInfo (accessToken: string) {
    try {
      const userInfoGetUrl = 'https://api.vk.com/method/users.get?access_token=' + accessToken + '&fields=name_case&v=5.89';

      this.httpService.axiosRef.post (userInfoGetUrl,)
        .then (response => {
          return response.data;
        })
        .catch (error => {
          console.error ('error', error);
          return error;
        });
    } catch (e) {
      console.error (e);
    }
  }

  async login () {
    return 'login';
  }

  async register (vkId: number) {
    const existingUser = await this.vkAuthRepository.findOne ({
      where: {
        vk_id: vkId,
      },
    });

    if(existingUser) {
      return existingUser;
    }

    return this.registerUser(vkId);
  }

  async registerUser(vkId: number): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner ();
    await queryRunner.connect ();
    await queryRunner.startTransaction ();
    let registeredUser = null;
    try {
      const createdUserEntity = await this.userService.create();
      registeredUser = await this.vkAuthRepository.save({
        vk_id: vkId,
        user: createdUserEntity
      });
      await queryRunner.commitTransaction();
    } catch (e){
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return registeredUser;
  }
}