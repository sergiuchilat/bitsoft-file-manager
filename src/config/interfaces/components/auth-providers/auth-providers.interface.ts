import {
  ClassicAuthProviderInterface
} from '@/config/interfaces/components/auth-providers/classic-auth-provider.interface';
import {
  GoogleAuthProviderInterface
} from '@/config/interfaces/components/auth-providers/google-auth-provider.interface';

export interface AuthProvidersInterface{
  classic: ClassicAuthProviderInterface,
  google: GoogleAuthProviderInterface
}