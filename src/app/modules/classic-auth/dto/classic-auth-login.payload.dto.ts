import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export default class ClassicAuthLoginPayloadDto {
  @ApiProperty ({ example: 'mail@domain.com', description: 'Email' })
  @Length (6, 255, {
    message: 'Email must contain from $constraint1 to $constraint2 characters',
  })
    email: string;

  @ApiProperty ({ example: 'strong_password', description: 'Password' })
  @Length (8, 255, {
    message: 'Password must contain from $constraint1 to $constraint2 characters',
  })
    password: string;
}