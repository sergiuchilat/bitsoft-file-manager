import {ApiProperty} from '@nestjs/swagger';
import {Expose} from 'class-transformer';

export default class UsersListResponseDto {
    @ApiProperty ({ example: 1, description: 'Id' })
    @Expose()
      id: number;

    @ApiProperty ({ example: '83db08ca-7e44-4c56-bd21-5cabe3881612', description: 'UUID' })
    @Expose()
      uuid: string;

    @ApiProperty ({ example: 'John Doe', description: 'Name' })
    @Expose()
      name: string;

    @ApiProperty ({ example: 'user@gmail.com', description: 'Email' })
    @Expose()
      email: string;
}
