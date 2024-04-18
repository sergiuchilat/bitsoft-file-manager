import { Repository } from 'typeorm';
import { UserEntity } from '@/app/modules/users/entities/user.entity';

export interface UsersRepository extends Repository<UserEntity> {
  this: Repository<UserEntity>;
}