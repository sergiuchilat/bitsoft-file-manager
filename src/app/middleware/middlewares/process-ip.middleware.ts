import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/app/modules/users/user.entity';
import { UsersRepository } from '@/app/modules/users/users.repository';
import { BlockedIpEntity } from '@/app/modules/blocked-ip/entities/blocked-ip.entity';
import { BlockedIpRepository } from '@/app/modules/blocked-ip/repositories/blocked-ip.repository';

@Injectable()
export class ProcessIpMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UsersRepository,
    @InjectRepository(BlockedIpEntity)
    private readonly blockedIpRepository: BlockedIpRepository,
  ) {}

  async use(request: any, res: any, next: (error?: any) => void): Promise<void> {
    const ip = request.connection.remoteAddress;
    const userUuid = request.user.uuid;

    const ipIsBlocked = await this.blockedIpRepository.exist({ where: { ip } });

    if (ipIsBlocked) {
      throw new ForbiddenException();
    }

    await this.userRepository.update({ uuid: userUuid }, { last_login_ip: ip });

    next();
  }
}
