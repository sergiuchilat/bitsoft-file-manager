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

  async create (name = null): Promise<UserEntity> {
    return await this.usersRepository.save ({
      uuid: v4 (),
      name: name || null
    });
  }

  async delete (id: number): Promise<void> {
    await this.usersRepository.delete ({id});
  }
}
