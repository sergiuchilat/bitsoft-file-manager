import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AbstractStorageProvider
} from '@/app/modules/file-manager/storage-providers/abstract-storage-provider.interface';

@Injectable()
export class FileManagerService implements OnModuleInit {

  constructor(
    @Inject("StorageProviders")
    private readonly storageProviders: AbstractStorageProvider[]
  ) {}

  onModuleInit() {
    console.log(this.storageProviders);
  }


}