import {DataSource, Repository, UpdateResult} from 'typeorm';
import {UserEntity} from '@/app/modules/users/user.entity';
import {PageOptionsDto} from '@/app/response/dto/paginate-meta-response.dto';
import {Injectable, NotFoundException} from '@nestjs/common';
import {UserStatusEnum} from '@/app/modules/common/enums/user-status.enum';

export interface UserRepository {
  findAndCountAll(pageOptionsDto: PageOptionsDto): Promise<[UserEntity[], number]>
  findByUUID(uuid: string): Promise<UserEntity>;
  findByUUIDWithAuthMethods(uuid: string): Promise<UserEntity>;
  block(uuid: string): Promise<UpdateResult>;
  unblock(uuid: string): Promise<UpdateResult>;
  this: Repository<UserEntity>;
}

@Injectable()
export class UsersRepository extends Repository<UserEntity> {

  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }
  async findByEmail (email: string): Promise<UserEntity> {
    return await this.findOne ({
      where: {
        email: email
      }
    });
  }

  async findAndCountAll (pageOptionsDto: PageOptionsDto): Promise<[UserEntity[], number]> {
    const [entities, count] = await this.findAndCount({
      order: {
        [pageOptionsDto.orderBy || 'id']: pageOptionsDto.order,
      },
      take: pageOptionsDto.per_page,
      skip: (pageOptionsDto.page - 1) * pageOptionsDto.per_page
    });

    return [entities, count];
  }

  async findByUUID (uuid: string)  {
    const user = await this.findOne({where: {uuid}});

    if(!user) {
      throw new NotFoundException(`User with uuid: ${uuid} not found!`);
    }

    return user;
  }

  async findByUUIDWithAuthMethods (uuid: string)  {
    const user = await this.findOne({where: {uuid}, relations: ['classicAuth', 'oAuth']});

    if(!user) {
      throw new NotFoundException(`User with uuid: ${uuid} not found!`);
    }

    return user;
  }

  async block (uuid: string)  {
    return this.update({uuid}, {status: UserStatusEnum.BLOCKED});
  }

  async unblock (uuid: string)  {
    return this.update({uuid}, {status: UserStatusEnum.ACTIVE});
  }

}
