import { VkAuthEntity } from '@/app/modules/auth/vk-auth/vk-auth.entity';
import { Repository } from 'typeorm';

export interface VkAuthRepository extends Repository<VkAuthEntity> {
  this: VkAuthRepository;
}