import { Module } from '@nestjs/common';
import { VkAuthController } from '@/app/modules/auth/vk-auth/vk-auth.controller';
import { HttpModule } from '@nestjs/axios';
import { VkAuthService } from '@/app/modules/auth/vk-auth/vk-auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VkAuthEntity } from '@/app/modules/auth/vk-auth/vk-auth.entity';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@/app/modules/users/user.entity';
import { UsersService } from '@/app/modules/users/users.service';

@Module ({
  imports: [
    HttpModule.register ({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature ([
      VkAuthEntity,
      UserEntity
    ])
  ],
  providers: [
    {
      provide: 'VK_AUTH_SERVICE',
      useClass: VkAuthService
    },
    UsersService,
    VkAuthService,
    JwtService
  ],
  controllers: [VkAuthController],
})
export class VkAuthModule {
}