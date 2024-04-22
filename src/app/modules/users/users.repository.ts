import { Repository } from 'typeorm';
import { UserEntity } from '@/app/modules/users/user.entity';

export interface UsersRepository extends Repository<UserEntity> {
  this: Repository<UserEntity>;
}