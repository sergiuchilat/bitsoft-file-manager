import {DataSource, Repository, UpdateResult} from 'typeorm';
import {UserEntity} from '@/app/modules/users/user.entity';
import {PageDto, PageMetaDto, PageOptionsDto} from '@/app/response/dto/paginate-meta-response.dto';
import {Injectable, NotFoundException} from '@nestjs/common';
import {UserStatusEnum} from '@/app/modules/common/enums/user-status.enum';
import {I18nService} from 'nestjs-i18n';
import UsersListResponseDto from '@/app/modules/users/dto/user-item.response.dto';

export interface UserRepository {
  findAllAndCount(pageOptionsDto: PageOptionsDto): Promise<[UserEntity[], number]>
  findByUUID(uuid: string): Promise<UserEntity>;
  findByUUIDWithAuthMethods(uuid: string): Promise<UserEntity>;
  block(uuid: string): Promise<UpdateResult>;
  unblock(uuid: string): Promise<UpdateResult>;
  this: Repository<UserEntity>;
}

@Injectable()
export class UsersRepository extends Repository<UserEntity> {

  constructor(private readonly dataSource: DataSource,
              private readonly i18n: I18nService,
  ) {
    super(UserEntity, dataSource.createEntityManager());
  }
  async findByEmail (email: string): Promise<UserEntity> {
    return await this.findOne ({
      where: {
        email: email
      }
    });
  }

  async findAllAndCount (pageOptionsDto: PageOptionsDto): Promise<PageDto<UsersListResponseDto>> {
    const [entities, itemCount] = await this.findAndCount({
      order: {
        [pageOptionsDto.orderBy || 'id']: pageOptionsDto.order,
      },
      take: pageOptionsDto.per_page,
      skip: (pageOptionsDto.page - 1) * pageOptionsDto.per_page
    });

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto,
    });

    return new PageDto(
      entities,
      pageMetaDto,
    );
  }

  async findByUUID (uuid: string, request: Request)  {
    const user = await this.findOne({where: {uuid}});

    if(!user) {
      const message = {
        message: this.i18n.t('auth.errors.user_not_found', {
          lang: request.headers['l-localization'] || 'en',
          args: {uuid}
        })
      };
      throw new NotFoundException(message);
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
