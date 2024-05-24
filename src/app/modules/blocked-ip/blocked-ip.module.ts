import { Module } from '@nestjs/common';
import { BlockedIpController } from '@/app/modules/blocked-ip/controllers/blocked-ip.controller';
import { BlockedIpService } from '@/app/modules/blocked-ip/services/blocked-ip.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedIpEntity } from '@/app/modules/blocked-ip/entities/blocked-ip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedIpEntity])],
  controllers: [BlockedIpController],
  providers: [BlockedIpService],
  exports: [BlockedIpService],
})
export class BlockedIpModule {}
