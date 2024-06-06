import { StorageProviderName } from '@/app/modules/file-manager/storage-providers/enums/storage.provider.name.enum';
import { AccessLevel } from '@/app/modules/file-manager/access-management/enums/access-level.enum';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDate, IsEnum, IsString, IsUUID, ValidateNested } from 'class-validator';

export class BasicAccessDTO {
  @ApiProperty({
    example: '2024-05-24T04:08:06.013Z',
  })
  @IsDate()
  read?: Date;
  @ApiProperty({
    example: '2024-05-24T04:08:06.013Z',
  })
  @IsDate()
  write?: Date;
}

export class UserAccessDTO {
  @IsUUID()
  @ApiProperty()
  user_uuid: string;
  @IsEnum(AccessLevel)
  @ApiProperty()
  level: AccessLevel;
  @IsUUID()
  @ApiProperty()
  until?: Date;
}

export class AccessDTO {
  @IsBoolean()
  @ApiProperty()
  public: boolean;
  @ApiProperty({type: [BasicAccessDTO]})
  @ValidateNested()
  @Type(() => BasicAccessDTO)
  link: BasicAccessDTO;
  @ApiProperty({type: [BasicAccessDTO]})
  @ValidateNested()
  @Type(() => BasicAccessDTO)
  authorized: BasicAccessDTO;
  @ApiProperty({type: [UserAccessDTO]})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserAccessDTO)
  user: UserAccessDTO[];
}

export class UploadFileRequestDto {
  //todo blob content
  @Expose()
  @ApiProperty()
  @IsString()
  name: string;
  @Expose()
  @ApiProperty()
  @IsUUID()
  owner: string;
  @Expose()
  @ApiProperty()
  @IsEnum(StorageProviderName)
  provider: StorageProviderName;
  @Expose()
  @ApiProperty()
  @IsString() //todo validation pattern
  folder: string;
  @Expose()
  @ApiProperty()
  @ValidateNested()
  @Type(() => AccessDTO)
  access: AccessDTO
}