import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassicAuthEntity } from '@/app/modules/auth/classic-auth/classic-auth.entity';
import { ClassicAuthService } from '@/app/modules/auth/classic-auth/classic-auth.service';
import { ClassicAuthController } from '@/app/modules/auth/classic-auth/classic-auth.controller';

@Module ({
  imports: [
    TypeOrmModule.forFeature ([
      ClassicAuthEntity
    ])
  ],
  providers: [ClassicAuthService, JwtService],
  controllers: [ClassicAuthController]
})
export class UsersModule {
}
