import { Module } from '@nestjs/common';
import { XAuthController } from '@/app/modules/auth/x-auth/x-auth.controller';

@Module({
  imports: [],
  controllers: [XAuthController],
  providers: []
})
export class XAuthModule {}