import { StorageProviderName } from '@/app/modules/file-manager/storage-providers/enums/storage.provider.name.enum';

export interface AbstractStorageProvider {
  upload(fileContent: Object, fileName: string, rootDirectory: string, folder: string) : void | Promise<void>;
  getName() : StorageProviderName;
}