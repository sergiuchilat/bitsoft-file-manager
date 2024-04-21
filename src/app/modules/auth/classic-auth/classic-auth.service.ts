import { v4 } from 'uuid';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { UsersService } from '@/app/modules/users/services/users.service';
import { ClassicAuthEntity } from '@/app/modules/auth/classic-auth/classic-auth.entity';
import { ClassicAuthRepository } from '@/app/modules/auth/classic-auth/classic-auth.repository';
import ClassicAuthLoginPayloadDto from '@/app/modules/auth/classic-auth/dto/classic-auth-login.payload.dto';
import ClassicAuthLoginResponseDto from '@/app/modules/auth/classic-auth/dto/classic-auth-login.response.dto';
import ClassicAuthRegisterPayloadDto from '@/app/modules/auth/classic-auth/dto/classic-auth-register.payload.dto';
import ClassicAuthRegisterResponseDto from '@/app/modules/auth/classic-auth/dto/classic-auth-register.response.dto';
import AppConfig from '@/config/app-config';
import { AuthMethodStatusEnum } from '@/app/modules/common/auth-method-status.enum';
import { JwtService } from '@nestjs/jwt';
import { AuthMethodsEnum } from '@/app/modules/common/auth-methods.enum';
import { TokenGeneratorService } from '@/app/modules/common/token-generator.service';
import * as fs from 'node:fs';
import parse from 'node-html-parser';
import { HttpService } from '@nestjs/axios';

@Injectable ()
export class ClassicAuthService {
  constructor (
    @InjectRepository (ClassicAuthEntity)
    private readonly classicAuthRepository: ClassicAuthRepository,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService
  ) {
  }

  async login (classicAuthLoginPayloadDto: ClassicAuthLoginPayloadDto): Promise<ClassicAuthLoginResponseDto> {
    const existingUser = await this.classicAuthRepository.findOne ({
      where: {
        email: classicAuthLoginPayloadDto.email
      },
      relations: ['user']
    });
    const passwordMatch = await compare (classicAuthLoginPayloadDto.password, existingUser?.password || '');

    if (existingUser && passwordMatch) {
      return {
        token: this.jwtService.sign(TokenGeneratorService.generatePayload(
          existingUser.user.uuid,
          AuthMethodsEnum.CLASSIC,
          {
            email: existingUser.email,
            name: existingUser.user.name,
          }
        ), {
          secret: AppConfig.jwt.secret,
          expiresIn: AppConfig.jwt.expiresIn
        })
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

    try {
      const createdUserEntity = await this.usersService.create (classicAuthRegisterPayloadDto.name);
      registeredUser = await queryRunner.manager.save (ClassicAuthEntity, {
        ...classicAuthRegisterPayloadDto,
        password: await this.encodePassword (classicAuthRegisterPayloadDto.password),
        activation_code: v4 (),
        user: createdUserEntity,
      });
      await queryRunner.commitTransaction ();
      success = true;
    } catch (e) {
      await queryRunner.rollbackTransaction ();
      throw new HttpException ('Error registering user', HttpStatus.CONFLICT);
    } finally {
      await queryRunner.release ();

      if(success) {
        await this.sendActivationEmail (classicAuthRegisterPayloadDto.email);
      }
    }

    return plainToInstance (
      ClassicAuthRegisterResponseDto,
      registeredUser
    );
  }

  async sendActivationEmail (email: string) {
    const notifyServiceUrl = process.env.NOTIFY_SERVICE_URL;
    const notifyServiceApiKey = process.env.NOTIFY_SERVICE_KEY;
    const notifyServiceTemplate = 'registration-confirmation';

    const templateData = fs.readFileSync(`src/data/email-templates/${notifyServiceTemplate}/en.html`, 'utf8');

    const emailBody = templateData
      .replaceAll('{PROJECT_NAME}', 'Project Name')
      .replaceAll('{IMAGE_URL}', 'https://via.placeholder.com/150')
      .replaceAll('{USER_FULL_NAME}', 'User Full Name')
      .replaceAll('{CONFIRM_LINK}', 'http://localhost:3000/activate/123456')
      .replaceAll('{PROJECT_URL}', 'http://localhost:3000');

    try {
      const notifySendUrl = `${notifyServiceUrl}/api/v1/notifications/mail`;
      this.httpService.axiosRef.post (notifySendUrl, {
        'subject': parse(emailBody).querySelector('title').text,
        'body': parse(emailBody).querySelector('body').innerHTML,
        'language': 'en',
        'receivers': [email]
      }, {
        headers: {
          'x-api-key': `${notifyServiceApiKey}`
        }
      })
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
    console.log('BODY', emailBody);

    return emailBody;
  }

  async activate (token: string) {

    // await this.classicAuthRepository.delete ({
    //   status: AuthMethodStatusEnum.NEW,
    //   created_at: LessThan (new Date (new Date ().getTime () - AppConfig.authProviders.classic.code_expires_in * 1000))
    // });

    const result = await this.classicAuthRepository.update ({
      activation_code: token,
      status: AuthMethodStatusEnum.NEW
    }, {
      status: AuthMethodStatusEnum.ACTIVE
    });

    if (!result?.affected) {
      throw new HttpException ('Invalid token', HttpStatus.NOT_FOUND);
    }

    return {
      token: token,
      status: AuthMethodStatusEnum.ACTIVE
    };
  }

  private async encodePassword (password: string) {
    return await hash (password, 10);
  }
}
