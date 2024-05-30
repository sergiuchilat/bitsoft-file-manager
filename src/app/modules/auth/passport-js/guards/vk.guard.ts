import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable ()
export class VkGuard extends AuthGuard ('vk') {
  constructor () {
    super ({
      accessType: 'offline',
    });
  }
}