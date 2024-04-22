import { Injectable } from '@nestjs/common';
import { GoogleUserDetails } from '@/app/modules/auth/google-auth/google-user-details.type';
import { GoogleAuthRepository } from '@/app/modules/auth/google-auth/google-auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleAuthEntity } from '@/app/modules/auth/google-auth/google-auth.entity';
import { DataSource } from 'typeorm';
import { TokenGeneratorService } from '@/app/modules/common/token-generator.service';
import { AuthMethodsEnum } from '@/app/modules/common/auth-methods.enum';
import AppConfig from '@/config/app-config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/app/modules/users/users.service';

@Injectable ()
export class GoogleAuthService {
  constructor (
    private readonly dataSource: DataSource,
    @InjectRepository (GoogleAuthEntity) private readonly googleAuthRepository: GoogleAuthRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {
  }

  async validateUser (userDetails: GoogleUserDetails): Promise<any> {
    const existingUser = await this.googleAuthRepository.findOne ({
      where: {
        email: userDetails.email
      }
    });

    if (existingUser) {
      return existingUser;
    }

    return this.registerUser (userDetails);
  }

  async registerUser (userDetails: GoogleUserDetails): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner ();
    await queryRunner.connect ();
    await queryRunner.startTransaction ();
    let registeredUser = null;
    try {
      const createdUserEntity = await this.usersService.create ();
      registeredUser = await this.googleAuthRepository.save ({
        email: userDetails.email,
        name: userDetails.name,
        google_id: userDetails.googleId,
        user: createdUserEntity
      });
      await queryRunner.commitTransaction ();
    } catch (e) {
      await queryRunner.rollbackTransaction ();
    } finally {
      await queryRunner.release ();
    }

    return registeredUser;
  }

  async findUser (id: number): Promise<any> {
    return await this.googleAuthRepository.findOne ({
      where: {
        id: id
      }
    });
  }

  async getAuthorizedUser (user: any) {
    const existingUser = await this.googleAuthRepository.findOne ({
      where: {
        email: user.email
      },
      relations: ['user']
    });

    return {
      token: this.jwtService.sign (TokenGeneratorService.generatePayload (
        existingUser.user.uuid,
        AuthMethodsEnum.GOOGLE_OAUTH,
        {
          email: existingUser.email,
          name: existingUser.name,
        }
      ), {
        secret: AppConfig.jwt.secret,
        expiresIn: AppConfig.jwt.expiresIn
      })
    };
  }
}