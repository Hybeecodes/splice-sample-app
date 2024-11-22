import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { ValidationPipe } from './shared/utils/validator.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger as NestLogger } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppConfigService } from './shared/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api');
  const logger = app.get(Logger);
  const configService = app.get(AppConfigService);
  app.useLogger(logger);

  if (configService.nodeEnv === 'production') {
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'img-src': ["'self'", 'data:', 'https://cdn.jsdelivr.net/'],
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'https://cdn.jsdelivr.net/',
          ],
        },
      }),
    );
  }
  app.enableCors({
    origin: '*',
  });
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle(`Splice API`)
    .setDescription('API Documentation')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`/docs`, app, document);
  const PORT = configService.port || 3000;
  await app.listen(PORT);
}
bootstrap()
  .then(() => {
    NestLogger.log(`API Server started`, 'Bootstrap');
  })
  .catch((err) => {
    NestLogger.error(err, 'Bootstrap');
  });
