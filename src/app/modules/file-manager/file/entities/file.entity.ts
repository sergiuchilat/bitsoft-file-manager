import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MimeType } from '@/app/modules/file-manager/enums/mime-types.enum';
import { StorageProviderName } from '@/app/modules/file-manager/storage-providers/enums/storage.provider.name.enum';

@Entity({name: "files"})
export class FileEntity {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column({
    type: 'varchar',
    length: 36,
    unique: true
  })
  uuid: string;
  @Column({
    type: "varchar",
    length: 255
  })
  name?: string;
  @Column({
    type: "enum",
    enum: MimeType
  })
  mimeType: MimeType;
  @Column() //todo should place type?
  size: number;
  @Column({
    type: 'enum',
    enum: StorageProviderName,
    default: () => StorageProviderName.LOCAL
  })
  storageProvider: StorageProviderName;
  @Column({
    type: 'varchar',
    length: 512
  })
  folder: string;
  @Column({
    type: 'boolean'
  })
  isPublic: boolean;
  @Column({
    type: 'varchar',
    length: 36
  })
  owner: string;
  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date; //todo find column naming strategy camel->snake

  @Column({
    type: 'varchar',
    length: 36
  })
  createdBy: string; //todo no default value?
  @Column({
    type: 'varchar',
    length: 36
  })
  updatedBy: string;
}