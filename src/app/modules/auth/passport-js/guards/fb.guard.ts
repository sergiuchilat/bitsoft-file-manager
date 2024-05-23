import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable ()
export class FbGuard extends AuthGuard ('facebook') {
  constructor () {
    super ({
      accessType: 'offline',
    });
  }
}
