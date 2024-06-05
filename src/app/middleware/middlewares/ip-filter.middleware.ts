import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockedIpEntity } from '@/app/modules/blocked-ip/entities/blocked-ip.entity';
import { BlockedIpRepository } from '@/app/modules/blocked-ip/repositories/blocked-ip.repository';

@Injectable()
export class IpFilterMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(BlockedIpEntity)
    private readonly blockedIpRepository: BlockedIpRepository,
  ) {}

  async use(request: any, res: any, next: (error?: any) => void): Promise<void> {
    const ip = request.headers['x-forwarded-for'] ?? request.connection.remoteAddress;
    const ipIsBlocked = await this.blockedIpRepository.exist({ where: { ip } });

    if (ipIsBlocked) {
      throw new ForbiddenException();
    }

    next();
  }
}
