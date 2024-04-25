import { v4 } from 'uuid';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { DataSource } from 'typeorm';
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
        email: classicAuthLoginPayloadDto.email
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
            name: existingUser.user.fullName,
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
    const queryRunner = this.dataSource.createQueryRunner ();
    await queryRunner.connect ();
    await queryRunner.startTransaction ();
    let registeredUser = null;
    let success = false;
    const activationCode = v4 ();

    try {
      const createdUserEntity = await this.usersService.create (classicAuthRegisterPayloadDto.name, classicAuthRegisterPayloadDto.email);
      registeredUser = await queryRunner.manager.save (ClassicAuthEntity, {
        ...classicAuthRegisterPayloadDto,
        password: await this.encodePassword (classicAuthRegisterPayloadDto.password),
        activation_code: activationCode,
        user: createdUserEntity,
      });
      await queryRunner.commitTransaction ();
      success = true;
    } catch (e) {
      await queryRunner.rollbackTransaction ();
      throw new HttpException ('Error registering user', HttpStatus.CONFLICT);
    } finally {
      await queryRunner.release ();

      if (success) {
        await this.mailerService.sendActivationEmail (
          classicAuthRegisterPayloadDto.email,
          classicAuthRegisterPayloadDto.name,
          this.generateActivationLink(activationCode)
        );
      }
    }

    return plainToInstance (
      ClassicAuthRegisterResponseDto,
      registeredUser
    );
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

    const result = await this.classicAuthRepository.update ({
      activation_code: token,
      status: AuthMethodStatus.NEW
    }, {
      status: AuthMethodStatus.ACTIVE
    });

    if (!result?.affected) {
      throw new HttpException ('Invalid token', HttpStatus.NOT_FOUND);
    }

    return {
      token: token,
      status: AuthMethodStatus.ACTIVE
    };
  }

  async findUserByEmail (email: string) {
    return await this.classicAuthRepository.findOne ({
      where: {
        email: email
      },
      relations: ['user']
    });
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
      `${credentials.user.fullName}`,
      this.generateResetPasswordLink (resetCode)
    );

    return {
      email: email,
      status: AuthMethodStatus.NEW
    };
  }

  private async encodePassword (password: string) {
    return await hash (password, 10);
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
