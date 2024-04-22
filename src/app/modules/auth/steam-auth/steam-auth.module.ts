import { Module } from '@nestjs/common';
import { SteamAuthController } from '@/app/modules/auth/steam-auth/steam-auth.controller';

@Module ({
  imports: [],
  controllers: [SteamAuthController],
  providers: []
})
export class SteamAuthModule {}

