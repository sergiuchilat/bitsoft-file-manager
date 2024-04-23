import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '@/app/modules/users/users.service';

@ApiTags ('Users')
@Controller ({
  version: '1',
  path: 'users',

})
export class UsersController {
  constructor (
    private readonly usersService: UsersService
  ) {
  }

  @ApiOperation ({ summary: 'Get all users(---! ---! needs to be implemented)' })
  @Get ()
  getAll () {
    return 'Get all users';
  }

  @ApiOperation ({ summary: 'Get a user(---! needs to be implemented)' })
  @Get ('/:uuid')
  get (uuid: string) {
    return 'Get a user ' + uuid;
  }


  @ApiOperation ({ summary: 'Block user(---! needs to be implemented)' })
  @Patch ('block/:uuid')
  async block () {
    return 'BLock a user';
  }

  @ApiOperation ({ summary: 'Unblock user(---! needs to be implemented)' })
  @Patch ('unblock/:uuid')
  async unblock () {
    return 'Unblock a user';
  }

  @ApiOperation ({ summary: 'Delete user(---! needs to be implemented)' })
  @Delete ('/:uuid')
  async delete (id: number): Promise<any> {
    return await this.usersService.delete (id);
  }

  @ApiOperation ({ summary: 'Attach an auth method to a user(---! needs to be implemented)' })
  @Post ('auth-method')
  async attachAuthMethod (): Promise<any> {
    return 'Attach an auth method to a user';
  }

  @ApiOperation ({ summary: 'Detach an auth method from a user(---! needs to be implemented)' })
  @Delete ('auth-method')
  async detachAuthMethod (): Promise<any> {
    return 'Detach an auth method from a user';
  }

}
