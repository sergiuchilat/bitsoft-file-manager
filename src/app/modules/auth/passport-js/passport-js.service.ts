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

    // if existingCredentials then
    //   update token_code
    // else
    //   insert

    const existingCredentials = await this.oauthCredentialRepository.findOne ({
      where: {
        provider: provider,
        provider_user_id: req.user.id,
      },
      relations: ['user']
    });

    if (existingCredentials) {
      console.log ('ExistingCredentials', existingCredentials);
      await this.oauthCredentialRepository.update (existingCredentials.id, {
        token_code: tokenCode
      });
    }

    //const userOwnedEmail = await this.usersService.findUserByEmail (req.user.email);
    // let userEmail = null;
    // if(!userOwnedEmail) {
    //   userEmail = req.user.email || null;
    // }

    // const existingUser = await this.findExistingUser (provider);

    const existingUser = this.usersService.findExistingUser (req.user.email, provider);

    const userEmail = req.user.email || null;
    const createdUser = await this.usersService.create (userEmail, req.user.firstName, req.user.lastName);

    console.log ('createdUser', createdUser);


    const createdOauthCredentials = await this.oauthCredentialRepository.save ({
      user_id: createdUser.id,
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

  private async findExistingUser (currentProvider: OauthProvider) {
    let existingUser = null;

    if (currentProvider === OauthProvider.CLASSIC) {
      existingUser = await this.findUserWithGoogleAuth ();
      if (existingUser) {
        return existingUser;
      }
    }

    if (currentProvider === OauthProvider.GOOGLE) {
      existingUser = await this.findUserWithClassicAuth ();
      if (existingUser) {
        return existingUser;
      }
    }

    return existingUser;
  }

  private async findUserWithClassicAuth () {
    return null;
  }

  private async findUserWithGoogleAuth () {
    return null;
  }
}
