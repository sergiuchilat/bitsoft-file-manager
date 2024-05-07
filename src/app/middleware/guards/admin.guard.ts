import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (user?.roles) {
      return (
        user.roles?.[0] === 'admin'
      );
    }

    if (user?.role) {
      return (
        user?.role === 'admin'
      );
    }

    throw new UnauthorizedException('Just admin can do this');
  }
}
