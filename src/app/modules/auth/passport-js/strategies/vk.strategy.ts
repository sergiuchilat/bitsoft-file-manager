import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-vkontakte';
import { OauthProvider } from '@/app/modules/common/enums/provider.enum';

@Injectable ()
export class VkStrategy extends PassportStrategy (Strategy, 'vk') {
  constructor () {
    super (
      {
        clientID: process.env.VK_AUTH_CLIENT_ID,
        clientSecret: process.env.VK_AUTH_CLIENT_SECRET,
        callbackURL: process.env.VK_AUTH_REDIRECT_URL,
        scope: ['email'],
      },
      async function validate (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: CallableFunction
      ) {
        const user = {
          id: profile.id,
          email: null,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          photo: profile.photos[0].value,
          provider: OauthProvider.VK,
        };

        done (null, user);
      }
    );
  }
}
