import { Module } from '@nestjs/common';
import { GoogleAuthController } from '@/app/modules/auth/google-auth/google-auth.controller';
import { GoogleAuthStrategy } from '@/app/modules/auth/google-auth/google-auth.strategy';
import { GoogleAuthService } from '@/app/modules/auth/google-auth/google-auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleAuthEntity } from '@/app/modules/auth/google-auth/google-auth.entity';
import { UsersService } from '@/app/modules/users/services/users.service';
import { UserEntity } from '@/app/modules/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { SessionSerializer } from '@/app/modules/auth/google-auth/session-serializer';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GoogleAuthEntity,
      UserEntity
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRES_IN }
    })
  ],
  providers: [
    GoogleAuthStrategy,
    UsersService,
    SessionSerializer,
    {
      provide: 'GOOGLE_AUTH_SERVICE',
      useClass: GoogleAuthService
    }
  ],
  controllers: [GoogleAuthController]
})
export class GoogleAuthModule {}