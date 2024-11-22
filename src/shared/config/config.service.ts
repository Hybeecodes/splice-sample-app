import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from './env.validation';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): Environment {
    return this.configService.get<Environment>('NODE_ENV');
  }

  get port(): number {
    return this.configService.get<number>('PORT');
  }

  get dbPort(): string {
    return this.configService.get<string>('DB_PORT');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get dbHost(): string {
    return this.configService.get<string>('DB_HOST');
  }

  get dbUser(): number {
    return this.configService.get<number>('DB_USER');
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }

  get dbName(): string {
    return this.configService.get<string>('DB_NAME');
  }
}
