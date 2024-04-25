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
    private readonly usersRepository: UsersRepository
  ) {
  }

  async create (
    email = null,
    firstName = null,
    lastName = null,
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
      firstName: firstName || null,
      lastName: lastName || null
    });
  }

  private async findExistingUser (
    email: string,
    provider: OauthProvider = null
  ): Promise<UserEntity> {

    if(provider === OauthProvider.GOOGLE) {
      return (await this.findExistingUserForGoogleProvider(email)).user;
    }

    return null;
  }

  private async findExistingUserForGoogleProvider(email: string){
    return null;// await this.classicAuthService.findUserByEmail(email);
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
