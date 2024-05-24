import { IsIP } from 'class-validator';

export class BlockedIpActionDto {
  @IsIP()
  ip: string;
}
