import { Module } from '@nestjs/common';
import { ClassicAuthService } from '@/app/modules/classic-auth/services/classic-auth.service';
import { ClassicAuthController } from '@/app/modules/classic-auth/controllers/classic-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassicAuthEntity } from '@/app/modules/classic-auth/entities/classic-auth.entity';
import { JwtService } from '@nestjs/jwt';

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
