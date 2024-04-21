import { Module } from '@nestjs/common';
import { ClassicAuthService } from './classic-auth.service';
import { ClassicAuthController } from './classic-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassicAuthEntity } from './classic-auth.entity';
import { UserEntity } from '@/app/modules/users/entities/user.entity';
import { UsersService } from '@/app/modules/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassicAuthEntity,
      UserEntity
    ]),
    HttpModule.register ({
      timeout: 5000,
      maxRedirects: 5,
    })
  ],
  providers: [ClassicAuthService, UsersService, JwtService],
  controllers: [ClassicAuthController]
})
export class ClassicAuthModule {}
