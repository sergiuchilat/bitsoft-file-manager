import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@/app/modules/users/entities/user.entity';

@Entity ('auth_credentials_google')
export class GoogleAuthEntity {
  @PrimaryGeneratedColumn ()
    id: number;

  @Column ({
    length: 255,
    unique: true,
    nullable: false,
  })
    email: string;

  @Column ({
    length: 128,
    nullable: false,
  })
    name: string;

  @Column ({
    length: 255,
    nullable: false,
  })
    google_id: string;

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
}