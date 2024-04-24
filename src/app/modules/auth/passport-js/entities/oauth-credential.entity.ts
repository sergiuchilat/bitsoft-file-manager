import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from '@/app/modules/users/user.entity';
import { OauthProvider } from '@/app/modules/auth/passport-js/enums/provider.enum';

@Entity({
  name: 'credentials_oauth',
})
@Unique('oauth_provider_user_id', ['provider', 'provider_user_id'])

export class OauthCredentialEntity {
  @PrimaryGeneratedColumn()
    id: string;

  @Column ({
    length: 255,
    nullable: true,
  })
    email: string;

  @Column({
    length: 512,
    nullable: true,
  })
    photo: string;

  @Column({
    nullable: false,
  })
    user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
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

  @Column({
    length: 36,
    nullable: true,
  })
    token_code: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
