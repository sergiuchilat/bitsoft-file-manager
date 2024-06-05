import { Module } from '@nestjs/common';
import {
  DoStorageProviderService
} from '@/app/modules/file-manager/storage-providers/impl/digital-ocean/do-storage-provider.service';
import {
  LocalStorageProviderService
} from '@/app/modules/file-manager/storage-providers/impl/local/local-storage-provider.service';

@Module({
  providers: [
    DoStorageProviderService,
    LocalStorageProviderService,
    {
      provide: 'StorageProviders',
      useFactory: (doStorageProvider: DoStorageProviderService, localStorageProvider: LocalStorageProviderService) => {
        return [doStorageProvider, localStorageProvider];
      },
      inject: [DoStorageProviderService, LocalStorageProviderService],
    }
  ],
  exports: ['StorageProviders']
})
export class StorageProvidersModule{}
