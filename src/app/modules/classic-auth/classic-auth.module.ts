import { Module } from '@nestjs/common';
import { ClassicAuthService } from '@/app/modules/classic-auth/services/classic-auth.service';
import { ClassicAuthController } from '@/app/modules/classic-auth/controllers/classic-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassicAuthEntity } from '@/app/modules/classic-auth/entities/classic-auth.entity';
import { UserEntity } from '@/app/modules/users/entities/user.entity';
import { UsersService } from '@/app/modules/users/services/users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassicAuthEntity,
      UserEntity
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRES_IN }
    })
  ],
  providers: [ClassicAuthService, UsersService],
  controllers: [ClassicAuthController]
})
export class ClassicAuthModule {}
