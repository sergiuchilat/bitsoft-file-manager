import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClassicAuthEntity } from '@/app/modules/auth/classic-auth/classic-auth.entity';
import { OauthCredentialEntity } from '@/app/modules/auth/passport-js/entities/oauth-credential.entity';

@Entity ('users')
export class UserEntity {
  @PrimaryGeneratedColumn ()
    id: number;

  @Column ({
    length: 36,
    nullable: false,
    unique: true,
  })
    uuid: string;

  @Column ({
    length: 255,
    nullable: true,
  })
    name: string;

  @Column ({
    length: 255,
    nullable: true,
  })
    email: string;

  @Column({
    type: 'varchar',
    length: 39,
    nullable: true
  })
  last_login_ip: string;

  @OneToOne (() => ClassicAuthEntity, (classicAuth) => classicAuth.user)
    classicAuth: ClassicAuthEntity;

  @OneToMany (() => OauthCredentialEntity, (oAuth) => oAuth.user)
    oAuth: OauthCredentialEntity;
}
