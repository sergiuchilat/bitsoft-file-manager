import { ConflictException, Injectable } from '@nestjs/common';
import { BlockedIpRepository } from '@/app/modules/blocked-ip/repositories/blocked-ip.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockedIpEntity } from '@/app/modules/blocked-ip/entities/blocked-ip.entity';
import { DeleteResult } from 'typeorm';
import { BlockedIpPaginatorDto } from '@/app/modules/blocked-ip/dto/blocked-ip-paginator.dto';
import { PaginateResponseDto } from '@/app/response/dto/paginate-response.dto';

@Injectable()
export class BlockedIpService {
  constructor(
    @InjectRepository(BlockedIpEntity)
    private readonly blockedIpRepository: BlockedIpRepository,
  ) {}

  async getAll(paginator: BlockedIpPaginatorDto): Promise<PaginateResponseDto<BlockedIpEntity>> {
    const response = await this.blockedIpRepository.findAndCount({
      take: paginator.limit,
      skip: (paginator.page - 1) * paginator.limit,
    });

    return new PaginateResponseDto(paginator, response);
  }

  async add(ip: string): Promise<void> {
    try {
      await this.blockedIpRepository.insert({ ip });
    } catch (error) {
      throw new ConflictException();
    }
  }

  remove(ip: string): Promise<DeleteResult> {
    return this.blockedIpRepository.delete({ ip });
  }
}
