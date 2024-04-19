export default interface JwtConfigInterface {
  secret: string;
  expiresIn: number;
  privateKeyPath: string;
  privateKey: string;
  publicKeyPath: string;
  publicKey: string;
}
