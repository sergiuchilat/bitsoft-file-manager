import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude ()
export default class ClassicAuthRegisterResponseDto {
  @ApiProperty ({ example: 'mail@domain.com', description: 'Email' })
  @Length (6, 255, {
    message: 'Email must contain from $constraint1 to $constraint2 characters',
  })
  @Expose()
    email: string;
}