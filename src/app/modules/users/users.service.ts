import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import { UserEntity } from '@/app/modules/users/user.entity';
import { UsersRepository } from '@/app/modules/users/users.repository';

@Injectable ()
export class UsersService {
  constructor (
    @InjectRepository(UserEntity)
    private readonly usersRepository: UsersRepository
  ) {
  }

  async findByEmail (email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: {email}
    });
  }

  async create (
    name = null,
    email = null
  ): Promise<UserEntity> {

    const existingUser = await this.findByEmail (email);
    console.log('existingUser', existingUser);

    if(existingUser) {
      return existingUser;
    }

    return await this.usersRepository.save ({
      uuid: v4 (),
      name: name || null,
      email: email || null
    });
  }

  async delete (id: number): Promise<void> {
    await this.usersRepository.delete ({id});
  }
}
