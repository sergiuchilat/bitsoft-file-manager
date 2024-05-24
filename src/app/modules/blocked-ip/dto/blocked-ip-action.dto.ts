import { IsIP } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlockedIpActionDto {
  @IsIP()
  @ApiProperty({
    description: 'valid ipv4 or ipv6',
    example: '::ffff:127.0.0.1',
  })
  ip: string;
}
