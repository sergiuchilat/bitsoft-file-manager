import { Module } from '@nestjs/common';
import { VkAuthController } from '@/app/modules/auth/vk-auth/controllers/vk-auth.controller';
import { HttpModule } from '@nestjs/axios';
import { VkAuthService } from '@/app/modules/auth/vk-auth/services/vk-auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VkAuthEntity } from '@/app/modules/auth/vk-auth/entities/vk-auth.entity';
import { UsersService } from '@/app/modules/users/services/users.service';
import { UserEntity } from '@/app/modules/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module ({
  imports: [
    HttpModule.register ({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([
      VkAuthEntity, UserEntity
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRES_IN }
    })
  ],
  providers: [VkAuthService, UsersService],
  controllers: [VkAuthController],
})
export class VkAuthModule {
}