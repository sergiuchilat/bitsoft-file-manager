import { Module } from '@nestjs/common';
import { AppleAuthController } from '@/app/modules/auth/apple-auth/apple-auth.controller';

@Module({
  imports: [],
  controllers: [AppleAuthController],
  providers: []
})
export class AppleAuthModule {}