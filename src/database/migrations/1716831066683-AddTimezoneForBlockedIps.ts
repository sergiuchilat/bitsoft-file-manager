import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimezoneForBlockedIps1716831066683 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE blocked_ips ALTER COLUMN created_at SET DATA TYPE TIMESTAMPTZ');
    await queryRunner.query('ALTER TABLE blocked_ips ALTER COLUMN updated_at SET DATA TYPE TIMESTAMPTZ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE blocked_ips ALTER COLUMN created_at SET DATA TYPE TIMESTAMP');
    await queryRunner.query('ALTER TABLE blocked_ips ALTER COLUMN updated_at SET DATA TYPE TIMESTAMP');
  }
}
