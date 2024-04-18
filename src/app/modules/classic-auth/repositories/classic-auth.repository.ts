import { Repository } from 'typeorm';
import { ClassicAuthEntity } from '@/app/modules/classic-auth/entities/classic-auth.entity';

export interface ClassicAuthRepository extends Repository<ClassicAuthEntity> {
  this: Repository<ClassicAuthEntity>;
}