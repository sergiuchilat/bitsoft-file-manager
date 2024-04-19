import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class GoogleAuthUserStatusResponseDto {
  @ApiProperty({ example: 'email', description: 'Email' })
  @Expose()
    email: string;

  @ApiProperty({ example: 'name', description: 'Name' })
  @Expose()
    name: string;
}