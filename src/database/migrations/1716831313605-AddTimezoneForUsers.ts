import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimezoneForUsers1716831313605 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ');
    await queryRunner.query('ALTER TABLE users ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP');
    await queryRunner.query('ALTER TABLE users ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP');
  }
}
