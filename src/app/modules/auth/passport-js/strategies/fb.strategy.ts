import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';

@Injectable()
export class FbStrategy extends PassportStrategy(Strategy, 'facebook'){
  constructor() {
    super({
      clientID: process.env.FB_AUTH_APP_ID,
      clientSecret: process.env.FB_AUTH_APP_SECRET,
      callbackURL: process.env.FB_AUTH_REDIRECT_URL,
      scope: 'email',
      profileFields: ['name', 'emails'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function
  ) {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };

    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}