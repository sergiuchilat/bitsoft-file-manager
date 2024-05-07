import { Module } from '@nestjs/common';
import { UsersController } from '@/app/modules/users/users.controller';
import { UsersService } from '@/app/modules/users/users.service';
import {getDataSourceToken, getRepositoryToken} from '@nestjs/typeorm';
import {UserEntity} from '@/app/modules/users/user.entity';
import {DataSource} from 'typeorm';
import {customUsersRepository} from '@/app/modules/users/users.repository';

@Module ({
  providers: [ {
    provide: getRepositoryToken(UserEntity),
    inject: [getDataSourceToken()],
    useFactory(datasource: DataSource) {
      return datasource.getRepository(UserEntity).extend(customUsersRepository);
    },
  }, UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
