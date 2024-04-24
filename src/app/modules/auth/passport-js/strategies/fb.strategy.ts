import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { OauthProvider } from '@/app/modules/auth/passport-js/enums/provider.enum';

@Injectable()
export class FbStrategy extends PassportStrategy(Strategy, 'facebook'){
  constructor() {
    super({
      clientID: process.env.FB_AUTH_APP_ID,
      clientSecret: process.env.FB_AUTH_APP_SECRET,
      callbackURL: process.env.FB_AUTH_REDIRECT_URL,
      scope: 'email',
      profileFields: ['name', 'emails', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: CallableFunction
  ) {
    console.log('FB profile', profile);
    const user = {
      id: profile.id,
      email: profile?.emails[0]?.value || null,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      photo: profile?.photos[0]?.value || null,
      provider: OauthProvider.FACEBOOK,
    };

    done(null, user);
  }
}