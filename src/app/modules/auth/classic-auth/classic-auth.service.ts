import { v4 } from 'uuid';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { DataSource, IsNull, Not } from 'typeorm';
import { ClassicAuthEntity } from '@/app/modules/auth/classic-auth/classic-auth.entity';
import { ClassicAuthRepository } from '@/app/modules/auth/classic-auth/classic-auth.repository';
import ClassicAuthLoginPayloadDto from '@/app/modules/auth/classic-auth/dto/classic-auth-login.payload.dto';
import ClassicAuthRegisterPayloadDto from '@/app/modules/auth/classic-auth/dto/classic-auth-register.payload.dto';
import ClassicAuthRegisterResponseDto from '@/app/modules/auth/classic-auth/dto/classic-auth-register.response.dto';
import AppConfig from '@/config/app-config';
import { JwtService } from '@nestjs/jwt';
import { TokenGeneratorService } from '@/app/modules/common/token-generator.service';
import { MailerService } from '@/app/modules/auth/classic-auth/mailer.service';
import { UsersService } from '@/app/modules/users/users.service';
import { plainToInstance } from 'class-transformer';
import AuthLoginResponseDto from '@/app/modules/common/dto/auth-login.response.dto';
import { OauthProvider } from '@/app/modules/common/enums/provider.enum';
import { AuthMethodStatus } from '@/app/modules/common/enums/auth-method.status';

@Injectable ()
export class ClassicAuthService {
  constructor (
    @InjectRepository (ClassicAuthEntity)
    private readonly classicAuthRepository: ClassicAuthRepository,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {
  }

  async login (classicAuthLoginPayloadDto: ClassicAuthLoginPayloadDto): Promise<AuthLoginResponseDto> {
    const existingUser = await this.classicAuthRepository.findOne ({
      where: {
        email: classicAuthLoginPayloadDto.email,
        user_id: Not (IsNull ())
      },
      relations: ['user']
    });
    const passwordMatch = await compare (classicAuthLoginPayloadDto.password, existingUser?.password || '');

    if (existingUser && passwordMatch) {
      return {
        token: this.jwtService.sign (TokenGeneratorService.generatePayload (
          existingUser.user.uuid,
          OauthProvider.CLASSIC,
          {
            email: existingUser.email,
            name: existingUser.user.name,
            isActive: existingUser.status === AuthMethodStatus.ACTIVE,
          }
        ), {
          secret: AppConfig.jwt.secret,
          expiresIn: AppConfig.jwt.expiresIn
        }),
        refresh_token: null
      };
    }

    throw new HttpException ('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  async register (classicAuthRegisterPayloadDto: ClassicAuthRegisterPayloadDto): Promise<ClassicAuthRegisterResponseDto> {
    const activationCode = v4 ();

    try {
      // check if Google Credentials already exist for this email
      let existingUser = await this.usersService.findExistingUser (
        classicAuthRegisterPayloadDto.email,
        OauthProvider.CLASSIC
      );

      if (!existingUser) {
        existingUser = await this.usersService.create (
          classicAuthRegisterPayloadDto.email,
          classicAuthRegisterPayloadDto.name
        );
      }

      const registeredClassicCredentials = await this.classicAuthRepository.save({
        ...classicAuthRegisterPayloadDto,
        activation_code: activationCode,
        status: AuthMethodStatus.NEW,
        name: classicAuthRegisterPayloadDto.name,
        password: await hash (classicAuthRegisterPayloadDto.password, 10),
        user_id: existingUser.id
      });


      await this.mailerService.sendActivationEmail (
        classicAuthRegisterPayloadDto.email,
        this.generateActivationLink(activationCode),
        classicAuthRegisterPayloadDto.name
      );

      return plainToInstance (
        ClassicAuthRegisterResponseDto,
        registeredClassicCredentials
      );

    } catch (e) {
      throw new HttpException ('Error registering user', HttpStatus.CONFLICT);
    }
  }

  async activate (token: string) {

    // await this.classicAuthRepository.delete ({
    //   status: AuthMethodStatusEnum.NEW,
    //   created_at: LessThan (new Date (new Date ().getTime () - AppConfig.authProviders.classic.code_expires_in *
    // 1000)) });

    // const test = await this.classicAuthRepository.find({
    //   where: {
    //     status: AuthMethodStatusEnum.NEW,
    //     created_at: LessThan (new Date (new Date ().getTime () - AppConfig.authProviders.classic.code_expires_in *
    //       1000))
    //   }});
    //
    // console.log('test', test);

    const existingClassicCredentials = await this.classicAuthRepository.findOne ({
      where: {
        activation_code: token,
        status: AuthMethodStatus.NEW
      }
    });

    if (!existingClassicCredentials) {
      throw new HttpException ('Invalid token', HttpStatus.NOT_FOUND);
    }



    const result = await this.classicAuthRepository.update ({
      activation_code: token,
      status: AuthMethodStatus.NEW
    }, {
      status: AuthMethodStatus.ACTIVE,
      user_id: existingClassicCredentials.user_id,
      activation_code: null,
      name: existingClassicCredentials.name
    });

    if (!result?.affected) {
      throw new HttpException ('Invalid token', HttpStatus.NOT_FOUND);
    }

    return {
      token: token,
      status: AuthMethodStatus.ACTIVE
    };
  }

  async startResetPassword (email: string) {
    const credentials = await this.classicAuthRepository.findOne ({
      where: {
        email: email
      },
      relations: ['user']
    });

    if (!credentials) {
      throw new HttpException ('User not found', HttpStatus.NOT_FOUND);
    }

    const resetCode = v4 ();

    await this.classicAuthRepository.update ({
      email: email
    }, {
      reset_password_code: resetCode
    });

    await this.mailerService.sendResetPasswordEmail (
      email,
      `${credentials.user.name}`,
      this.generateResetPasswordLink (resetCode)
    );

    return {
      email: email,
      status: AuthMethodStatus.NEW
    };
  }

  private generateActivationLink (token: string) {
    return process.env.CLASSIC_AUTH_ACTIVATION_LINK
      .replace ('{token}', token);
  }

  private generateResetPasswordLink (token: string) {
    return process.env.CLASSIC_AUTH_RESET_PASSWORD_LINK
      .replace ('{token}', token);
  }
}
