import { AbstractStorageProvider } from '@/app/modules/file-manager/storage-providers/abstract-storage-provider.interface';
import { StorageProviderName } from '../../enums/storage.provider.name.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DoStorageProviderService implements AbstractStorageProvider {

  upload(fileContent: Object, fileName: string): void | Promise<void> {
    throw new Error('Method not implemented.');
  }

  getName(): StorageProviderName {
    return StorageProviderName.DO;
  }

}