import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClassicAuthEntity } from '@/app/modules/auth/classic-auth/classic-auth.entity';

@Entity ('users')
export class UserEntity {
  @PrimaryGeneratedColumn ()
    id: number;

  @Column ({
    length: 36,
    nullable: false,
    unique: true,
  })
    uuid: string;

  @Column ({
    length: 255,
    nullable: true,
  })
    firstName: string;

  @Column ({
    length: 255,
    nullable: true,
  })
    lastName: string;

  @Column ({
    length: 255,
    nullable: true,
    unique: true,
  })
    email: string;

  @OneToOne (() => ClassicAuthEntity, (classicAuth) => classicAuth.user)
    classicAuth: ClassicAuthEntity;


  public get fullName (): string {
    return `${this.firstName} ${this.lastName}`;
  }
}