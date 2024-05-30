import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BlockedIpService } from '@/app/modules/blocked-ip/services/blocked-ip.service';
import { BlockedIpActionDto } from '@/app/modules/blocked-ip/dto/blocked-ip-action.dto';
import { BlockedIpDto } from '@/app/modules/blocked-ip/dto/blocked-ip.dto';
import { BlockedIpPaginatorDto } from '@/app/modules/blocked-ip/dto/blocked-ip-paginator.dto';

@Controller({
  version: '1',
  path: 'blocked-ips',
})
@ApiTags('Blocked IPs')
export class BlockedIpController {
  constructor(private readonly blockedIpService: BlockedIpService) {}

  @Get()
  @ApiOkResponse({
    description: 'Blocked IP list',
    type: BlockedIpDto,
    isArray: true,
  })
  getAll(@Query() paginator: BlockedIpPaginatorDto) {
    return this.blockedIpService.getAll(paginator);
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
