import { PassportStrategy} from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import { GoogleAuthService } from '@/app/modules/auth/google-auth/google-auth.service';
import AppConfig from '@/config/app-config';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy){
  constructor (
    @Inject('GOOGLE_AUTH_SERVICE') private readonly googleAuthService: GoogleAuthService
  ) {
    super ({
      clientID: AppConfig.authProviders.google.clientId,
      clientSecret: AppConfig.authProviders.google.clientSecret,
      callbackURL: AppConfig.authProviders.google.redirectURL,
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