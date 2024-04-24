import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '@/app/modules/users/users.controller';
import { UsersService } from '@/app/modules/users/users.service';
import { UserEntity } from '@/app/modules/users/user.entity';


@Module ({
  imports: [
    TypeOrmModule.forFeature ([
      UserEntity
    ])
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {
}
