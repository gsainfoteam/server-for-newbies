/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ExceptionLoggerFilter } from '@lib/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable Exception Logger Filter
  app.useGlobalFilters(new ExceptionLoggerFilter());
  // Enable swagger
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Infoteam Newbies API')
    .setDescription('API for Infoteam Newbies')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'user:jwt',
    )
    .addOAuth2(
      {
        type: 'oauth2',
        scheme: 'bearer',
        in: 'header',
        'x-tokenName': 'id_token',
        flows: {
          authorizationCode: {
            authorizationUrl: configService.get('IDP_AUTH_URL'),
            tokenUrl: configService.get('IDP_TOKEN_URL'),
            scopes: {
              openid: 'OpenID Connect scope',
              profile: 'Profile scope',
              email: 'Email scope',
            },
          },
        },
      },
      'idp:idToken',
    )
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config), {
    swaggerOptions: {
      oauth2RedirectUrl: `${configService.getOrThrow('BASE_URL')}/api/oauth2-redirect.html`,
      displayRequestDuration: true,
      initOAuth: {
        usePkceWithAuthorizationCodeGrant: true,
        additionalQueryStringParams: { nonce: 'TheNonce' },
      },
    },
  });
  // Turn on application
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
