import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLoginIpForUsers1716469036498 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'last_login_ip',
        type: 'varchar',
        length: '39',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'last_login_ip');
  }
}
