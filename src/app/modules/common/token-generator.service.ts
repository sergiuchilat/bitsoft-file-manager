import { AuthMethodsEnum } from '@/app/modules/common/auth-methods.enum';
import { use } from 'passport';

export class TokenGeneratorService {
  static generatePayload (sub: string, authMethod: AuthMethodsEnum, user: any): any{
    return  {
      props: {
        authMethod,
        email: user.email,
        name: user.name
      },
      sub
    };
  }
}