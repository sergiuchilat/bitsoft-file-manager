import { Module } from '@nestjs/common';
import { GoogleAuthController } from '@/app/modules/auth/google-auth/controllers/google-auth.controller';
import { GoogleStrategy } from '@/app/modules/auth/google-auth/strategies/google.strategy';

@Module({
  imports: [],
  providers: [GoogleStrategy],
  controllers: [GoogleAuthController]
})
export class GoogleAuthModule {}