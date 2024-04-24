export class TokenGeneratorService {
  static generatePayload (sub: string, authProvider: string, user: any): any{
    return  {
      props: {
        authProvider,
        email: user.email,
        name: user.name,
        photo: user.photo
      },
      sub
    };
  }
}
