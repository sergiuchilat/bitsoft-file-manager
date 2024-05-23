import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude ()
export default class AuthLoginResponseDto {
  @ApiProperty ({ example: 'token', description: 'Token' })
  @Expose ()
    token: any;

  @ApiProperty ({ example: 'refresh_token', description: 'Refresh token' })
  @Expose ()
    refresh_token: any;
}