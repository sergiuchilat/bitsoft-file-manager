import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@/app/modules/users/user.entity';

@Entity({
  name: 'auth_credentials_vk'
})
export class VkAuthEntity {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({
    length: 255,
    unique: true,
    nullable: true,
  })
    email: string;

  @Column({
    nullable: false,
  })
    user_id: number;

  @Column({
    nullable: false,
  })
    vk_id: number;

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id'
  })
    user: UserEntity;

}