import { Module } from '@nestjs/common';
import { FileManagerController } from '@/app/modules/file-manager/file-manager.controller';
import { StorageProvidersModule } from '@/app/modules/file-manager/storage-providers/storage-providers.module';
import { FileManagerService } from '@/app/modules/file-manager/file-manager.service';

@Module({
  controllers: [FileManagerController],
  providers: [FileManagerService],
  imports: [StorageProvidersModule]
})
export class FileManagerModule {}