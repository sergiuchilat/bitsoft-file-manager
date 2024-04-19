import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { GoogleAuthService } from '@/app/modules/auth/google-auth/google-auth.service';

@Injectable()
export class SessionSerializerService extends PassportSerializer {
  constructor (
    @Inject('GOOGLE_AUTH_SERVICE') private readonly googleAuthService: GoogleAuthService
  ) {
    super ();
  }

  serializeUser(user: any, done: CallableFunction): void {
    done(null, user);
  }

  async deserializeUser(payload: any, done: CallableFunction){
    const user = await this.googleAuthService.findUser(payload.id);
    if (!user) {
      done('User not found', null);
    }
    done(null, user);
  }
}