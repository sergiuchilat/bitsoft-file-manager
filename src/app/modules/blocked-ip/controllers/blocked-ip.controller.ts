import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlockedIpService } from '@/app/modules/blocked-ip/services/blocked-ip.service';
import { BlockedIpActionDto } from '@/app/modules/blocked-ip/dto/blocked-ip-action.dto';

@Controller({
  version: '1',
  path: 'blocked-ips',
})
@ApiTags('Blocked IPs')
export class BlockedIpController {
  constructor(private readonly blockedIpService: BlockedIpService) {}

  @Get()
  getAll() {
    return this.blockedIpService.getAll();
  }

  @Post()
  add(@Body() { ip }: BlockedIpActionDto) {
    return this.blockedIpService.add(ip);
  }

  @Delete()
  remove(@Body() { ip }: BlockedIpActionDto) {
    return this.blockedIpService.remove(ip);
  }
}
