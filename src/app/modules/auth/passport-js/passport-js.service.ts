import { HttpException, Injectable } from '@nestjs/common';
import { OauthCredentialEntity } from '@/app/modules/auth/passport-js/entities/oauth-credential.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthProvider } from '@/app/modules/auth/passport-js/enums/provider.enum';
import { UsersService } from '@/app/modules/users/users.service';
import { v4 } from 'uuid';
import { TokenGeneratorService } from '@/app/modules/common/token-generator.service';
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


    //const userOwnedEmail = await this.usersService.findUserByEmail (req.user.email);
    // let userEmail = null;
    // if(!userOwnedEmail) {
    //   userEmail = req.user.email || null;
    // }
    const userEmail = req.user.email || null;
    const createdUser = await this.usersService.create (userEmail, req.user.firstName, req.user.lastName);

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
    const existingCredentials = await this.oauthCredentialRepository.findOne ({
      where: { token_code: code },
      relations: ['user']
    });
    if (!existingCredentials) {
      throw new HttpException('Not found', 404);
    }

    return {
      token: this.jwtService.sign (TokenGeneratorService.generatePayload (
        existingCredentials.user.uuid,
        existingCredentials.provider,
        {
          email: existingCredentials.email,
          name: existingCredentials.user.fullName,
        }
      ), {
        secret: AppConfig.jwt.secret,
        expiresIn: AppConfig.jwt.expiresIn
      }),
      refresh_token: null
    };
  }
}
