import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BlockedIpRepository } from '@/app/modules/blocked-ip/repositories/blocked-ip.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockedIpEntity } from '@/app/modules/blocked-ip/entities/blocked-ip.entity';

@Injectable()
export class BlockedIpService {
  constructor(
    @InjectRepository(BlockedIpEntity)
    private readonly blockedIpRepository: BlockedIpRepository,
  ) {}

  async getAll(): Promise<BlockedIpEntity[]> {
    return this.blockedIpRepository.find();
  }

  async add(ip: string): Promise<void> {
    const blockedIp = await this.blockedIpRepository.findOneBy({ ip });

    if (blockedIp) {
      throw new ConflictException();
    }

    await this.blockedIpRepository.save({ ip });
  }

  async remove(ip: string): Promise<void> {
    const blockedIp = await this.blockedIpRepository.findOneBy({ ip });

    if (!blockedIp) {
      throw new NotFoundException();
    }

    await this.blockedIpRepository.delete({ ip });
  }
}
