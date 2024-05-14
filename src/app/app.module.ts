import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import AppModules from './modules';
import EventEmitterConfig from '@/app/services/events-gateway/event-emitter.config';
import middlewares from './middleware';
import { SeedService } from '@/database/seeds/seed.service';
import i18nConfig from '@/app/services/i18n-config';
import TypeormConnector from '@/database/connectors/typeorm.connector';
import { PassportModule } from '@nestjs/passport';

@Module ({
  imports: [
    ...TypeormConnector,
    i18nConfig,
    ...AppModules,
    EventEmitterConfig,
    PassportModule.register({session: true})
  ],
  providers: [SeedService],
})
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer) {
    middlewares.forEach ((middleware) => {
      consumer.apply (middleware.guard).forRoutes (middleware.routes);
    });
  }
}
