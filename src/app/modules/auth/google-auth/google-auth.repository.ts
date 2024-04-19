import { Repository } from 'typeorm';
import { GoogleAuthEntity } from '@/app/modules/auth/google-auth/google-auth.entity';

export interface GoogleAuthRepository extends Repository<GoogleAuthEntity> {
  this: Repository<GoogleAuthEntity>;
}