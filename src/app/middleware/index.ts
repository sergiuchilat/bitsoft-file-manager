import { IpFilterMiddleware } from '@/app/middleware/middlewares/ip-filter.middleware';
import { FileManagerController } from '@/app/modules/file-manager/file-manager.controller';

export default [
  {
    guard: IpFilterMiddleware,
    routes: FileManagerController,
  }
];
