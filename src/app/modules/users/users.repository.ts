import { Repository } from 'typeorm';
import { UserEntity } from '@/app/modules/users/user.entity';

export interface UsersRepository extends Repository<UserEntity> {
  this: Repository<UserEntity>;

  findByEmail (email: string): Promise<UserEntity>;

}

export const customUsersRepository: Pick<UsersRepository, any> = {
  async findByEmail (email: string): Promise<UserEntity> {
    return await this.findOne ({
      where: {
        email: email
      }
    });
  }
};