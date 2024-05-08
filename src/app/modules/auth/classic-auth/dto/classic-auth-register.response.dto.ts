import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude ()
export default class ClassicAuthRegisterResponseDto {
  @ApiProperty ({ example: 'mail@domain.com', description: 'Email' })
  @Expose()
    email: string;

  @ApiProperty ({ example: 'uuid', description: 'UUID' })
  @Expose()
    uuid: string;
}
