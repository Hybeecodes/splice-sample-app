import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, LoggerModuleAsyncParams } from 'nestjs-pino';
import { RequestLoggerMiddleware } from './shared/middlewares/request-logger.middleware';
import { redactPaths } from './shared/utils/helpers';
import { validateConfig } from './shared/config/env.validation';
import { AppConfigService } from './shared/config/config.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './shared/database/config/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          transport:
            configService.get<string>('NODE_ENV') !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: { colorize: true, singleLine: true },
                }
              : undefined,
          level: 'info', // Set log level
          serializers: {
            req(req) {
              return {
                method: req.method,
                url: req.url,
                headers: { ...req.headers, requestId: req.requestId },
              };
            },
            res(res) {
              return {
                statusCode: res.statusCode,
              };
            },
          },
          redact: {
            paths: redactPaths,
            censor: '***',
          },
        },
      }),
    } as LoggerModuleAsyncParams),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
  exports: [AppConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
