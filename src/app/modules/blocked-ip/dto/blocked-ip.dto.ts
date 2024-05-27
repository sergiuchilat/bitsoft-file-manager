import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BlockedIpDto {
  @Expose()
  @ApiProperty({
    example: 3,
  })
  id: number;

  @Expose()
  @ApiProperty({
    example: '::ffff:127.0.0.1',
  })
  ip: string;

  @Expose()
  @ApiProperty({
    example: '2024-05-24T04:08:06.013Z',
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    example: '2024-05-24T04:08:06.013Z',
  })
  updated_at: Date;
}
