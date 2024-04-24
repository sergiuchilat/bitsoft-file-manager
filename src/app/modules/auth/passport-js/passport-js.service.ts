import { HttpException, Injectable } from '@nestjs/common';
import { OauthCredentialEntity } from '@/app/modules/auth/passport-js/entities/oauth-credential.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthProvider } from '@/app/modules/auth/passport-js/enums/provider.enum';
import { UsersService } from '@/app/modules/users/users.service';
import { v4 } from 'uuid';
import { TokenGeneratorService } from '@/app/modules/common/token-generator.service';
import { AuthMethodsEnum } from '@/app/modules/common/auth-methods.enum';
import AppConfig from '@/config/app-config';
import { JwtService } from '@nestjs/jwt';

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


    const createdUser = await this.usersService.create (req.user.email, req.user.firstName, req.user.lastName);

    console.log ('createdUser', createdUser);

    // const credentials = new OauthCredentialEntity ();
    const tokenCode = v4 ();
    // credentials.user_id = createdUser.id;
    // credentials.email = req.user.email;
    // credentials.provider = req.user.provider;
    // credentials.provider_user_id = req.user.id;
    // credentials.token_code = tokenCode;

    await this.oauthCredentialRepository.save ({
      user_id: createdUser.id,
      email: req.user.email,
      provider: provider,
      provider_user_id: req.user.id,
      token_code: tokenCode
    });
    return {
      token_code: tokenCode
    };
  }

  async getTokenByCode (code: string) {
    const existingUser = await this.oauthCredentialRepository.findOne ({
      where: { token_code: code },
      relations: ['user']
    });
    if (!existingUser) {
      throw new HttpException('Not found', 404);
    }

    return {
      token: this.jwtService.sign (TokenGeneratorService.generatePayload (
        existingUser.user.uuid,
        AuthMethodsEnum.CLASSIC,
        {
          email: existingUser.email,
          name: existingUser.user.fullName,
        }
      ), {
        secret: AppConfig.jwt.secret,
        expiresIn: AppConfig.jwt.expiresIn
      }),
      refresh_token: null
    };
  }
}
