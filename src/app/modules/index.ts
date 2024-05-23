import { UsersModule } from '@/app/modules/users/users.module';
import { PassportJsModule } from '@/app/modules/auth/passport-js/passport-js.module';
import { ClassicAuthModule } from '@/app/modules/auth/classic-auth/classic-auth.module';

export default [
  UsersModule,
  ClassicAuthModule,
  PassportJsModule
];
