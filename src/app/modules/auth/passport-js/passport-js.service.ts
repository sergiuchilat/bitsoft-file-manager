import { Injectable } from '@nestjs/common';
import { OauthCredentialEntity } from '@/app/modules/auth/passport-js/entities/oauth-credential.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthProvider } from '@/app/modules/auth/passport-js/enums/provider.enum';
import { UsersService } from '@/app/modules/users/users.service';
import { v4 } from 'uuid';

@Injectable ()
export class PassportJsService {
  constructor (
    @InjectRepository (OauthCredentialEntity) private readonly oauthCredentialRepository: Repository<OauthCredentialEntity>,
    private readonly usersService: UsersService
  ) {
  }

  async login (
    req: any,
    provider: OauthProvider,
  ): Promise<any> {
    if (!req?.user) {
      return 'No user from passport-js';
    }

    const existingCredentials = await this.oauthCredentialRepository.findOne ({
      where: {
        provider: provider,
        provider_user_id: req.user.id,
      },
      relations: ['user']
    });

    if (existingCredentials) {
      return existingCredentials;
    }

    const createdUser = await this.usersService.create (
      req.user.firstName,
      req.user.email
    );

    console.log('createdUser', createdUser);

    const credentials = new OauthCredentialEntity ();
    const tokenCode = v4 ();
    credentials.user_id = createdUser.id;
    credentials.email = req.user.email;
    credentials.provider = req.user.provider;
    credentials.provider_user_id = req.user.id;
    credentials.token_code = tokenCode;

    await this.oauthCredentialRepository.save (credentials);
    return {
      token_code: tokenCode
    };
  }
}