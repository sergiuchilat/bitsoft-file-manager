import { HttpException, Injectable } from '@nestjs/common';
import { OauthCredentialEntity } from '@/app/modules/auth/passport-js/entities/oauth-credential.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '@/app/modules/users/users.service';
import { v4 } from 'uuid';
import { TokenGeneratorService } from '@/app/modules/common/token-generator.service';
import AppConfig from '@/config/app-config';
import { JwtService } from '@nestjs/jwt';
import { OauthProvider } from '@/app/modules/common/enums/provider.enum';

@Injectable ()
export class PassportJsService {
  constructor (
    @InjectRepository (OauthCredentialEntity) private readonly oauthCredentialRepository: Repository<OauthCredentialEntity>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }

  async login (
    req: any,
    provider: OauthProvider,
  ): Promise<any> {
    if (!req?.user) {
      return 'No user from passport-js';
    }

    const tokenCode = v4 ();

    const existingCredentials = await this.oauthCredentialRepository.findOne ({
      where: {
        provider: provider,
        provider_user_id: req.user.id,
      },
      relations: ['user']
    });

    if (existingCredentials?.id) {
      console.log ('ExistingCredentials', existingCredentials);
      await this.oauthCredentialRepository.update (existingCredentials.id, {
        token_code: tokenCode
      });

      return {
        token_code: tokenCode
      };
    }

    let existingUser = await this.usersService.findExistingUser (req.user.email, OauthProvider.CLASSIC);

    if (!existingUser) {
      existingUser = await this.usersService.create (req.user.email, req.user.firstName, req.user.lastName);
    }

    console.log ('createdUser', existingUser);


    const createdOauthCredentials = await this.oauthCredentialRepository.save ({
      user_id: existingUser.id,
      email: req.user.email,
      provider: provider,
      provider_user_id: req.user.id,
      token_code: tokenCode,
      photo: req.user.photo
    });

    console.log ('createdOauthCredentials', createdOauthCredentials);

    return {
      token_code: tokenCode
    };
  }

  async getTokenByCode (code: string) {
    const existingCredentials = await this.oauthCredentialRepository.findOne ({
      where: { token_code: code },
      relations: ['user']
    });

    if (!existingCredentials) {
      throw new HttpException ('Not found', 404);
    }

    await this.oauthCredentialRepository.update (existingCredentials.id, {
      token_code: null
    });

    return {
      token: this.jwtService.sign (TokenGeneratorService.generatePayload (
        existingCredentials.user.uuid,
        existingCredentials.provider,
        {
          email: existingCredentials.email,
          name: existingCredentials.user.name,
          photo: existingCredentials.photo
        }
      ), {
        secret: AppConfig.jwt.secret,
        expiresIn: AppConfig.jwt.expiresIn
      }),
      refresh_token: null
    };
  }
}
