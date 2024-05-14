import { MigrationInterface, QueryRunner, TableColumn} from 'typeorm';
import {UserStatus} from '@/app/modules/users/types/user.status';

export class AddFieldStatusForUsers1714662042166 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['active', 'blocked'],
        default: UserStatus.ACTIVE
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'status');
  }

}
