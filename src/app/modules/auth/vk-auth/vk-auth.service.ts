import { Injectable } from '@nestjs/common';
import AppConfig from '@/config/app-config';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { VkAuthEntity } from '@/app/modules/auth/vk-auth/vk-auth.entity';
import { VkAuthRepository } from '@/app/modules/auth/vk-auth/vk-auth.repository';

import { DataSource } from 'typeorm';
import { TokenGeneratorService } from '@/app/modules/common/token-generator.service';
import { AuthMethodsEnum } from '@/app/modules/common/auth-methods.enum';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/app/modules/users/users.service';

@Injectable ()
export class VkAuthService {
  constructor (
    private readonly dataSource: DataSource,
    @InjectRepository (VkAuthEntity) private readonly vkAuthRepository: VkAuthRepository,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
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

      return this.httpService.axiosRef.post (accessTokenGetUrl,)
        .then (async (response) => {
          const userInfo =  await this.getUserInfo (response.data.access_token);
          console.log ('userInfo', userInfo);
          return this.login(response.data.user_id);
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

  async login (vkId: number) {
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

  async findUser(id: number): Promise<any> {
    return await this.vkAuthRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async getAuthorizedUser(user: any){
    const existingUser = await this.vkAuthRepository.findOne({
      where: {
        vk_id: user.vk_id
      },
      relations: ['user']
    });

    return {
      token: this.jwtService.sign(TokenGeneratorService.generatePayload(
        existingUser.user.uuid,
        AuthMethodsEnum.VK_OAUTH,
        {
          email: existingUser.email,
          name: '',
        }
      ), {
        secret: AppConfig.jwt.secret,
        expiresIn: AppConfig.jwt.expiresIn
      })
    };
  }
}