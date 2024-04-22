import { Module } from '@nestjs/common';
import { FbAuthController } from '@/app/modules/auth/fb-auth/fb-auth.controller';

@Module ({
  imports: [],
  controllers: [FbAuthController],
  providers: []
})
export class FbAuthModule {}