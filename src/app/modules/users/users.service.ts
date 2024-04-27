import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import { UserEntity } from '@/app/modules/users/user.entity';
import { UsersRepository } from '@/app/modules/users/users.repository';
import { OauthProvider } from '@/app/modules/common/enums/provider.enum';

@Injectable ()
export class UsersService {
  constructor (
    @InjectRepository(UserEntity)
    private readonly usersRepository: UsersRepository,
  ) {
  }

  async create (
    email = null,
    name = null,
    provider: OauthProvider = null
  ): Promise<UserEntity> {

    const existingUser = await this.findExistingUser(email, provider);
    console.log('existingUser', existingUser);

    if(existingUser) {
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
    provider: OauthProvider = null
  ): Promise<UserEntity> {

    if(provider === OauthProvider.GOOGLE) {
      console.log('findExistingUserForGoogleProvider', email);
      return this.usersRepository.findOne({
        where: {
          oAuth: {
            email
          }
        },
        relations: ['oAuth']
      });
    }

    return null;
  }

  private async findExistingUserForGoogleProvider(email: string){
    return null;// await this.classicAuthService.findUserByEmail(email);
  }

  private async findExistingUserForClassicProvider(email: string){
    return null;
  }

  async findUserByEmail (email: string){
    return await this.usersRepository.findOne({
      where: {
        email
      }
    });
  }

  async delete (id: number): Promise<void> {
    await this.usersRepository.delete ({id});
  }
}
