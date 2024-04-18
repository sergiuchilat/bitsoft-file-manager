import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude ()
export default class ClassicAuthLoginResponseDto {
  @ApiProperty ({ example: 'token', description: 'Token' })
  @Expose ()
    token: any;
}