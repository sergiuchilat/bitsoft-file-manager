import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import buildApiDocs from '@/docs/swagger.builder';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import AppConfig from '@/config/app-config';
import session from 'express-session';
import passport from 'passport';

async function bootstrap () {
  const app = await NestFactory.create (AppModule);

  app.setGlobalPrefix('api');

  app.enableVersioning ({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  if (AppConfig.docs.generate) {
    buildApiDocs (app, AppConfig.docs);
  }

  app.useGlobalPipes (
    new ValidationPipe ({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableVersioning ({
    type: VersioningType.URI,
  });
  app.enableCors ();
  console.log('AppConfig.app.session.secret', AppConfig.app.session.secret);
  app.use(
    session({
      secret: AppConfig.app.session.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60_000,
      }
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen (AppConfig.app.port);
}

bootstrap ();
