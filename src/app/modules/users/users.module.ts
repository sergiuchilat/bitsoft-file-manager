import { Module } from '@nestjs/common';
import { UsersController } from '@/app/modules/users/users.controller';
import { UsersService } from '@/app/modules/users/users.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersRepository} from '@/app/modules/users/users.repository';

@Module ({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController]
})
export class UsersModule {}
