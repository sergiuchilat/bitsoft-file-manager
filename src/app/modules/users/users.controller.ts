import { Controller, Delete, Patch, Post } from '@nestjs/common';
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


  @ApiOperation ({ summary: 'Attach an auth method to a user(needs to be implemented)' })
  @Post ('auth-method')
  async attachAuthMethod (): Promise<any> {
    return 'Attach an auth method to a user';
  }

  @ApiOperation ({ summary: 'Detach an auth method from a user(needs to be implemented)' })
  @Delete ('auth-method')
  async detachAuthMethod (): Promise<any> {
    return 'Detach an auth method from a user';
  }

  @ApiOperation ({ summary: 'Block user(needs to be implemented)' })
  @Patch ('block')
  async block () {
    return 'BLock a user';
  }

  @ApiOperation ({ summary: 'Unblock user(needs to be implemented)' })
  @Patch ('unblock')
  async unblock () {
    return 'Unblock a user';
  }

  @ApiOperation ({ summary: 'Delete user(needs to be implemented)' })
  @Delete ()
  async delete (id: number): Promise<any> {
    return await this.usersService.delete (id);
  }

}
