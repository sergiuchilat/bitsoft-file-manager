import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/app/modules/users/entities/user.entity';
import { UsersRepository } from '@/app/modules/users/repositories/users.repository';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { AuthMethodsEnum } from '@/app/modules/common/auth-methods.enum';
import AppConfig from '@/config/app-config';

@Injectable ()
export class UsersService {
  constructor (
    @InjectRepository(UserEntity)
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService
  ) {
  }

  async findOneByUuid (uuid: string): Promise<UserEntity> {
    return await this.usersRepository.findOneOrFail ({
      where: {
        uuid: uuid
      }
    });
  }

  async create (): Promise<UserEntity> {
    return await this.usersRepository.save ({
      uuid: uuidv4 (),
    });
  }

  async generateToken (user: UserEntity, authMethod: AuthMethodsEnum): Promise<any> {
    const tokenPayload = {
      props: {
        authMethod: authMethod,
        expirationTime: new Date().getTime() + 1000 * 60 * 60 * 24 * 7
      },
      sub: user.uuid
    };

    return {
      token: this.jwtService.sign (tokenPayload, {
        secret: AppConfig.jwt.privateKey,
        algorithm: 'RS256'
      }),
      tokenPayload
    };
  }
}
