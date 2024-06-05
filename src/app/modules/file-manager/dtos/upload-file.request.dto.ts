import { StorageProviderName } from '@/app/modules/file-manager/storage-providers/enums/storage.provider.name.enum';
import { AccessLevel } from '@/app/modules/file-manager/access-management/enums/access-level.enum';
import { AccessType } from '@/app/modules/file-manager/access-management/enums/access-type.enum';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';

export class UploadFileRequestDto {
  @Expose()
  @IsString()
  name: string;
  @Expose()
  @IsEnum(StorageProviderName)
  provider: StorageProviderName;
  @Expose()
  @IsString()
  folder: string;
  @Expose()
  @IsEnum(AccessLevel)
  accessLevel: AccessLevel;
  @Expose()
  @IsEnum(AccessType)
  accessType: AccessType;
  @Expose()
  @ApiProperty({
    example: '2024-05-24T04:08:06.013Z',
  })
  accessUntil: Date;
  @Expose()
  @IsArray() //todo use group validations so allowedUsers are not empty if accessType is User
  allowedUsers: UUID[]
}