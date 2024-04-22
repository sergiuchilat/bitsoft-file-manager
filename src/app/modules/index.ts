import { ClassicAuthModule } from '@/app/modules/auth/classic-auth/classic-auth.module';
import { GoogleAuthModule } from '@/app/modules/auth/google-auth/google-auth.module';
import { VkAuthModule } from '@/app/modules/auth/vk-auth/vk-auth.module';
import { UsersModule } from '@/app/modules/users/users.module';
import { SteamAuthModule } from '@/app/modules/auth/steam-auth/steam-auth.module';
import { FbAuthModule } from '@/app/modules/auth/fb-auth/fb-auth.module';
import { XAuthModule } from '@/app/modules/auth/x-auth/x-auth.module';
import { AppleAuthModule } from '@/app/modules/auth/apple-auth/apple-auth.module';

export default [
  ClassicAuthModule,
  GoogleAuthModule,
  VkAuthModule,
  SteamAuthModule,
  FbAuthModule,
  XAuthModule,
  AppleAuthModule,
  UsersModule
];
