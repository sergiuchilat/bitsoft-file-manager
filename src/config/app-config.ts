import AppConfigInterface from './interfaces/app-config.interface';
import EnvConfigStrategy from './strategies/env-config-strategy';
import AppConfigValidator from './validators/app-config.validator';
import DbConfigValidator from './validators/db-config.validator';
import DocsConfigValidator from './validators/docs-config.validator';

export enum AppConfigStrategies {
  env = 'env'
}

class AppConfigSingleton {
  private static instance = null;

  private readonly configStrategies = {
    env: new EnvConfigStrategy()
  };

  private config: AppConfigInterface = null;

  public static getInstance(): AppConfigSingleton {
    return this.instance || (this.instance = new this());
  }

  private validateConfig() {
    DbConfigValidator.validate(this.config.db);
    AppConfigValidator.validate(this.config.app);
    DocsConfigValidator.validate(this.config.docs);
  }

  public init(strategy: AppConfigStrategies) {
    this.config = this.configStrategies[strategy].getConfig();
    this.validateConfig();
  }

  public getConfig() {
    return this.config;
  }
}

AppConfigSingleton.getInstance().init(AppConfigStrategies.env);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AppConfig = AppConfigSingleton.getInstance().getConfig();
export default AppConfig;
