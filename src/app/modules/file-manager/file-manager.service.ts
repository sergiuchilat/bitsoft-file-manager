import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AbstractStorageProvider
} from '@/app/modules/file-manager/storage-providers/abstract-storage-provider.interface';
import { StorageProviderName } from '@/app/modules/file-manager/storage-providers/enums/storage.provider.name.enum';
import { UploadFileRequestDto } from '@/app/modules/file-manager/dtos/upload-file.request.dto';
import { v4 } from 'uuid';
import { Repository } from 'typeorm';
import { FileEntity } from '@/app/modules/file-manager/file/entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MimeType } from '@/app/modules/file-manager/enums/mime-types.enum';
import * as path from 'node:path';


@Injectable()
export class FileManagerService implements OnModuleInit {

  constructor(
    @Inject("StorageProviders")
    private readonly storageProviders: AbstractStorageProvider[],
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {}

  onModuleInit() {
    console.log(this.storageProviders);
  }

  async uploadFile(file: any, dto: UploadFileRequestDto) { //todo file logic
    //save file to provider
    const fileUuid = v4();
    const rootDirectory = dto.access.public ? "/public" : "/private";
    this.getSuitableProvider(dto.provider).upload(file, fileUuid, rootDirectory, dto.folder);
    //save file entity
    const fileEntity = await this.fileRepository.save({
      uuid: fileUuid,
      name: dto.name,
      mimeType: MimeType['.aac'],//todo file.mimeType()
      size: 100, //todo file.size
      storageProvider: dto.provider,
      folder: dto.folder,
      isPublic: dto.access.public,
      owner: dto.owner, //todo get user uuid from context
      createdBy: fileUuid, //todo
      updatedAt: fileUuid //todo
    })
    //save access
    //return response
    //
  }

  private getSuitableProvider(name: StorageProviderName) : AbstractStorageProvider {
    return this.storageProviders.find(provider => provider.getName() == name);
  }


}