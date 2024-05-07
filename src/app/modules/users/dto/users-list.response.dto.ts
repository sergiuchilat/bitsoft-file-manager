import {ApiProperty} from '@nestjs/swagger';
import {Expose} from 'class-transformer';

export default class UsersListResponseDto {
    @ApiProperty ({ example: 1, description: 'Id' })
    @Expose()
      id: number;

    @ApiProperty ({ example: '30943-2333', description: 'UUID' })
    @Expose()
      uuid: string;

    @ApiProperty ({ example: 'user 1', description: 'Name' })
    @Expose()
      name: string;

    @ApiProperty ({ example: 'user@gmail.com', description: 'Email' })
    @Expose()
      email: string;
}
