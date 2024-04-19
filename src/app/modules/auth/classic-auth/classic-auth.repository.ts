import { Repository } from 'typeorm';
import { ClassicAuthEntity } from './classic-auth.entity';

export interface ClassicAuthRepository extends Repository<ClassicAuthEntity> {
  this: Repository<ClassicAuthEntity>;
}