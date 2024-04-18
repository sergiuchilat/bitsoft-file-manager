import { Repository } from 'typeorm';
import { ClassicAuthEntity } from '../entities/classic-auth.entity';

export interface ClassicAuthRepository extends Repository<ClassicAuthEntity> {
  this: Repository<ClassicAuthEntity>;
}