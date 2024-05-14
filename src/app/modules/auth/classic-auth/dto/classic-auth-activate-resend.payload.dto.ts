import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export default class ClassicAuthActivateResendPayloadDto {
  @ApiProperty ({ example: 'mail@domain.com', description: 'Email' })
  @Length (6, 255, {
    message: 'Email must contain from $constraint1 to $constraint2 characters',
  })
    email: string;
}
