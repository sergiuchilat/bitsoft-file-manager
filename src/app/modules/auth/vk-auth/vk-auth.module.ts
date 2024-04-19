import { Module } from '@nestjs/common';
import { VkAuthController } from '@/app/modules/auth/vk-auth/controllers/vk-auth.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  })],
  providers: [],
  controllers: [VkAuthController],
})
export class VkAuthModule {}