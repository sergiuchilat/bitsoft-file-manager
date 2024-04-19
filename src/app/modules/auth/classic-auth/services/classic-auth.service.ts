import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { DataSource, LessThan } from 'typeorm';
import { UsersService } from '@/app/modules/users/services/users.service';
import { AuthMethodsEnum } from '@/app/modules/common/auth-methods.enum';
import { ClassicAuthEntity } from '@/app/modules/auth/classic-auth/entities/classic-auth.entity';
import { ClassicAuthRepository } from '@/app/modules/auth/classic-auth/repositories/classic-auth.repository';
import ClassicAuthLoginPayloadDto from '@/app/modules/auth/classic-auth/dto/classic-auth-login.payload.dto';
import ClassicAuthLoginResponseDto from '@/app/modules/auth/classic-auth/dto/classic-auth-login.response.dto';
import ClassicAuthRegisterPayloadDto from '@/app/modules/auth/classic-auth/dto/classic-auth-register.payload.dto';
import ClassicAuthRegisterResponseDto from '@/app/modules/auth/classic-auth/dto/classic-auth-register.response.dto';
import { v4 } from 'uuid';
import AppConfig from '@/config/app-config';
import { AuthMethodStatusEnum } from '@/app/modules/common/auth-method-status.enum';

@Injectable ()
export class ClassicAuthService {
  constructor (
    @InjectRepository (ClassicAuthEntity)
    private readonly classicAuthRepository: ClassicAuthRepository,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource
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

    if(existingUser && passwordMatch) {
      return this.usersService.generateToken(existingUser.user, AuthMethodsEnum.CLASSIC);
    }

    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  async register (classicAuthRegisterPayloadDto: ClassicAuthRegisterPayloadDto): Promise<ClassicAuthRegisterResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner ();
    await queryRunner.connect ();
    await queryRunner.startTransaction ();
    let registeredUser = null;

    try {

      console.log('AppConfig.authProviders.classic.code_expires_in', AppConfig.authProviders.classic.code_expires_in);
      console.log('Date.now()', new Date(Date.now()));
      console.log('Expires', new Date (Date.now () + AppConfig.authProviders.classic.code_expires_in));
      const createdUserEntity = await this.usersService.create();
      registeredUser = await queryRunner.manager.save (ClassicAuthEntity, {
        ...classicAuthRegisterPayloadDto,
        password: await this.encodePassword (classicAuthRegisterPayloadDto.password),
        activation_code: v4 (),
        activation_code_expires: new Date (new Date().getTime() + AppConfig.authProviders.classic.code_expires_in),
        user: createdUserEntity,
      });
      await queryRunner.commitTransaction ();
    } catch (e) {
      console.log ('Auth classic error', e);
      await queryRunner.rollbackTransaction ();
      throw new HttpException('Error registering user', HttpStatus.CONFLICT);
    } finally {
      await queryRunner.release ();
    }

    return plainToInstance (
      ClassicAuthRegisterResponseDto,
      registeredUser
    );
  }

  async activate (token: string) {

    await this.classicAuthRepository.delete({
      status: AuthMethodStatusEnum.NEW,
      created_at: LessThan(new Date(new Date().getTime() -  AppConfig.authProviders.classic.code_expires_in * 1000))
    });

    const result = await this.classicAuthRepository.update ({
      activation_code: token,
      status: AuthMethodStatusEnum.NEW
    }, {
      status: AuthMethodStatusEnum.ACTIVE
    });

    console.log('Activate result', result);

    if(!result.affected){
      throw new HttpException('Invalid token', HttpStatus.NOT_FOUND);
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
