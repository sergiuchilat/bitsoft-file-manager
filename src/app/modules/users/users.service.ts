import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { UserEntity } from '@/app/modules/users/user.entity';
import { OauthProvider } from '@/app/modules/common/enums/provider.enum';
import {PageDto, PageMetaDto, PageOptionsDto} from '@/app/response/dto/paginate-meta-response.dto';
import UsersListResponseDto from '@/app/modules/users/dto/users-list.response.dto';
import { UserRepository} from '@/app/modules/users/users.repository';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable ()
export class UsersService {
  constructor (
      @InjectRepository(UserEntity) private readonly userRepository: UserRepository
  ) {
  }

  async getList (pageOptionsDto: PageOptionsDto): Promise<PageDto<UsersListResponseDto>> {
    const [entities, itemCount] = await this.userRepository.findAndCountAll(pageOptionsDto);
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto,
    });

    return new PageDto(
      entities,
      pageMetaDto,
    );
  }

  async getByUUID (uuid: string) {
    return this.userRepository.findByUUID(uuid);
  }

  async block (uuid: string) {
    const user = await this.userRepository.findByUUID(uuid);

    return this.userRepository.block(user);
  }

  async unblock (uuid: string) {
    const user = await this.userRepository.findByUUID(uuid);

    return this.userRepository.unblock(user);
  }

  async create (
    email: string = null,
    name: string = null,
    provider: OauthProvider = null
  ): Promise<UserEntity> {

    const existingUser = await this.findExistingUser (email, provider);
    console.log ('existingUser', existingUser);

    if (existingUser) {
      return existingUser;
    }

    return await this.userRepository.save ({
      uuid: v4(),
      email: email || null,
      name: name || null
    });
  }

  async findExistingUser (
    email: string,
    requestProvider: OauthProvider = null
  ): Promise<UserEntity> {

    if (requestProvider === OauthProvider.CLASSIC) {
      return this.userRepository.findOne ({
        where: {
          oAuth: {
            email
          }
        },
        relations: ['oAuth']
      });
    }

    if (requestProvider === OauthProvider.GOOGLE) {
      return this.userRepository.findOne ({
        where: {
          classicAuth: {
            email
          }
        },
        relations: ['classicAuth']
      });
    }

    return null;
  }

  async delete (uuid: string): Promise<void> {
    const user = await this.userRepository.findByUUIDWithRelations(uuid);

    if (user.classicAuth) {
      await this.userRepository.manager.remove(user.classicAuth);
    }

    if (Array.isArray(user.oAuth) && user.oAuth.length) {
      await Promise.all(user.oAuth.map(async (oAuth) => {
        await this.userRepository.manager.remove(oAuth);
      }));
    }

    await this.userRepository.delete({ uuid });
  }
}

