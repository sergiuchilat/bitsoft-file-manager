import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity(
  {
    name: 'auth_attempts',
  }
)
export class AuthAttemptEntity {
  @PrimaryGeneratedColumn()
    id: string;

  ip: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}