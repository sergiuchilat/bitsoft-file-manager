import { Module } from '@nestjs/common';
import { FileManagerController } from '@/app/modules/file-manager/file-manager.controller';
import { StorageProvidersModule } from '@/app/modules/file-manager/storage-providers/storage-providers.module';
import { FileManagerService } from '@/app/modules/file-manager/file-manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '@/app/modules/file-manager/file/entities/file.entity';

@Module({
  controllers: [FileManagerController],
  providers: [FileManagerService],
  imports: [StorageProvidersModule, TypeOrmModule.forFeature([FileEntity])]
})
export class FileManagerModule {}