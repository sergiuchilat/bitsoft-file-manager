import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import { UserEntity } from '@/app/modules/users/user.entity';
import { UsersRepository } from '@/app/modules/users/users.repository';
import { OauthProvider } from '@/app/modules/common/enums/provider.enum';

@Injectable ()
export class UsersService {
  constructor (
    @InjectRepository (UserEntity)
    private readonly usersRepository: UsersRepository,
  ) {
  }

  async create (
    email = null,
    name = null,
    provider: OauthProvider = null
  ): Promise<UserEntity> {

    const existingUser = await this.findExistingUser (email, provider);
    console.log ('existingUser', existingUser);

    if (existingUser) {
      return existingUser;
    }

    return await this.usersRepository.save ({
      uuid: v4 (),
      email: email || null,
      name: name || null
    });
  }

  async findExistingUser (
    email: string,
    requestProvider: OauthProvider = null
  ): Promise<UserEntity> {

    if (requestProvider === OauthProvider.CLASSIC) {
      return this.usersRepository.findOne ({
        where: {
          oAuth: {
            email
          }
        },
        relations: ['oAuth']
      });
    }

    if (requestProvider === OauthProvider.GOOGLE) {
      return this.usersRepository.findOne ({
        where: {
          classicAuth: {
            email
          }
        },
        relations: ['classicAuth']
      });
    }

    return null;
  }

  async delete (id: number): Promise<void> {
    await this.usersRepository.delete ({ id });
  }
}
