import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@/app/modules/users/entities/user.entity';

@Entity('classic_auth_credentials')
export class ClassicAuthEntity {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({
    length: 255,
    unique: true,
    nullable: false,
  })
    email: string;

  @Column({
    length: 60,
    nullable: false,
  })
    password: string;

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