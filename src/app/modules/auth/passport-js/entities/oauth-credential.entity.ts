import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@/app/modules/users/user.entity';
import { OauthProvider } from '@/app/modules/auth/passport-js/enums/provider.enum';

@Entity({
  name: 'credentials_oauth',
})
export class OauthCredentialEntity {
  @PrimaryGeneratedColumn()
    id: string;

  @Column ({
    length: 255,
    unique: true,
    nullable: true,
  })
    email: string;
  @Column({
    nullable: false,
  })
    user_id: number;

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id'
  })
    user: UserEntity;

  @Column({
    type: 'enum',
    enum: OauthProvider,
    nullable: false,
  })
    provider: OauthProvider;

  @Column({
    length: 255,
    nullable: false,
  })
    provider_user_id: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}