import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassicAuthEntity } from '@/app/modules/classic-auth/entities/classic-auth.entity';
import { ClassicAuthRepository } from '@/app/modules/classic-auth/repositories/classic-auth.repository';
import ClassicAuthRegisterPayloadDto from '@/app/modules/classic-auth/dto/classic-auth-register.payload.dto';
import { compare, hash } from 'bcrypt';
import ClassicAuthRegisterResponseDto from '@/app/modules/classic-auth/dto/classic-auth-register.response.dto';
import { plainToInstance } from 'class-transformer';
import ClassicAuthLoginPayloadDto from '@/app/modules/classic-auth/dto/classic-auth-login.payload.dto';
import ClassicAuthLoginResponseDto from '@/app/modules/classic-auth/dto/classic-auth-login.response.dto';
import { DataSource } from 'typeorm';
import { UsersService } from '@/app/modules/users/services/users.service';
import { AuthMethodsEnum } from '@/app/modules/common/auth-methods.enum';

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
      const createdUserEntity = await this.usersService.create();
      registeredUser = await queryRunner.manager.save (ClassicAuthEntity, {
        ...classicAuthRegisterPayloadDto,
        password: await this.encodePassword (classicAuthRegisterPayloadDto.password),
        user: createdUserEntity
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

  private async encodePassword (password: string) {
    return await hash (password, 10);
  }
}
