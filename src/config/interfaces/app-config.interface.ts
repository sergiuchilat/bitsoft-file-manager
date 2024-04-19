import DbConfigInterface from './components/db-config.interface';
import JwtConfigInterface from './components/jwt-config.interface';
import DocsConfigInterface from './components/docs-config.interface';
import AppConfigInterface from './components/app-config.interface';
import TelegramConfigInterface from './components/telegram-config.interface';
import MailConfigInterface from '@/config/interfaces/components/mail-config.interface';
import { AuthProvidersInterface } from '@/config/interfaces/components/auth-providers/auth-providers.interface';

export default interface ConfigInterface {
  app: AppConfigInterface;
  authProviders: AuthProvidersInterface;
  db: DbConfigInterface;
  jwt: JwtConfigInterface;
  docs: DocsConfigInterface;
  telegram: TelegramConfigInterface;
  mail: MailConfigInterface;
}
