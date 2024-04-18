export default interface JwtConfigInterface {
  secret: string;
  expiresIn: string;
  privateKeyPath: string;
  privateKey: string;
  publicKeyPath: string;
  publicKey: string;
}
