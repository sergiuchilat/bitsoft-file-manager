import { PassportStrategy} from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import { GoogleAuthService } from '@/app/modules/auth/google-auth/services/google-auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
  constructor (
    @Inject('GOOGLE_AUTH_SERVICE') private readonly googleAuthService: GoogleAuthService
  ) {
    super ({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }


  async validate (accessToken: string, refreshToken: string, profile: Profile) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    const user = await this.googleAuthService.validateUser({
      email: profile.emails[0].value,
      name: profile.displayName,
      googleId: profile.id,
    });

    return user || null;
  }
}