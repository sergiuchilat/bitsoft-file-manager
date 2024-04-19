import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/app/modules/users/entities/user.entity';
import { UsersRepository } from '@/app/modules/users/repositories/users.repository';
import { v4 } from 'uuid';

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
}
