import { Repository} from 'typeorm';
import {UserEntity} from '@/app/modules/users/user.entity';
import {PageOptionsDto} from '@/app/response/dto/paginate-meta-response.dto';
import UsersListResponseDto from '@/app/modules/users/dto/user-item.response.dto';
import {NotFoundException} from '@nestjs/common';
import {UserStatusEnum} from '@/app/modules/common/enums/user-status.enum';

export interface UserRepository extends Repository<UserEntity> {
  this: Repository<UserEntity>;
  findAndCountAll(pageOptionsDto: PageOptionsDto): Promise<[UsersListResponseDto[], number]>
  findByUUID(uuid: string): Promise<UserEntity>;
  findByUUIDWithAuthMethods(uuid: string): Promise<UserEntity>;
  block(userEntity: UserEntity): Promise<UserEntity>;
  unblock(userEntity: UserEntity): Promise<UserEntity>;
}

export const customUsersRepository: Pick<UserRepository, any> = {
  async findByEmail (email: string): Promise<UserEntity> {
    return await this.findOne ({
      where: {
        email: email
      }
    });
  },

  async findAndCountAll (pageOptionsDto: PageOptionsDto) {
    const [entities, count] = await this.findAndCount({
      order: {
        [pageOptionsDto.orderBy || 'id']: pageOptionsDto.order,
      },
      take: pageOptionsDto.per_page,
      skip: (pageOptionsDto.page - 1) * pageOptionsDto.per_page
    });

    return [entities, count];
  },

  async findByUUID (uuid: string)  {
    const user = await this.findOne({where: {uuid}});

    if(!user) {
      throw new NotFoundException(`User with uuid: ${uuid} not found!`);
    }

    return user;
  },

  async findByUUIDWithAuthMethods (uuid: string)  {
    const user = await this.findOne({where: {uuid}, relations: ['classicAuth', 'oAuth']});

    if(!user) {
      throw new NotFoundException(`User with uuid: ${uuid} not found!`);
    }

    return user;
  },

  async block (userEntity: UserEntity)  {
    return this.update({id: userEntity.id}, {status: UserStatusEnum.BLOCKED});
  },

  async unblock (userEntity: UserEntity)  {
    return this.update({id: userEntity.id}, {status: UserStatusEnum.ACTIVE});}
};
