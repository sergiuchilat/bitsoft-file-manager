import { Module } from '@nestjs/common';
import { GoogleAuthController } from '@/app/modules/auth/google-auth/google-auth.controller';
import { GoogleAuthStrategy } from '@/app/modules/auth/google-auth/google-auth.strategy';
import { GoogleAuthService } from '@/app/modules/auth/google-auth/google-auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleAuthEntity } from '@/app/modules/auth/google-auth/google-auth.entity';
import { SessionSerializerService } from '@/app/modules/auth/google-auth/session-serializer.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@/app/modules/users/user.entity';
import { UsersService } from '@/app/modules/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GoogleAuthEntity,
      UserEntity
    ])
  ],
  providers: [
    GoogleAuthStrategy,
    UsersService,
    GoogleAuthService,
    SessionSerializerService,
    JwtService,
    {
      provide: 'GOOGLE_AUTH_SERVICE',
      useClass: GoogleAuthService
    }
  ],
  controllers: [GoogleAuthController]
})
export class GoogleAuthModule {}