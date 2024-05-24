import { Repository } from 'typeorm';
import { BlockedIpEntity } from '@/app/modules/blocked-ip/entities/blocked-ip.entity';

export interface BlockedIpRepository extends Repository<BlockedIpEntity> {
  this: Repository<BlockedIpEntity>;
}
