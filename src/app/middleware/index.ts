import { ProcessIpMiddleware } from '@/app/middleware/middlewares/process-ip.middleware';
import { ClassicAuthController } from '@/app/modules/auth/classic-auth/classic-auth.controller';
import { PassportJsController } from '@/app/modules/auth/passport-js/passport-js.controller';
import { ParseTokenMiddleware } from '@/app/middleware/middlewares/parse-token.middleware';

export default [
  {
    guard: ParseTokenMiddleware,
    routes: ClassicAuthController,
  },
  {
    guard: ParseTokenMiddleware,
    routes: PassportJsController,
  },
  {
    guard: ProcessIpMiddleware,
    routes: ClassicAuthController,
  },
  {
    guard: ProcessIpMiddleware,
    routes: PassportJsController,
  },
];
