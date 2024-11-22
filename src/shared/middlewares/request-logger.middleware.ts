import { Injectable, NestMiddleware } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: any, res: any, next: () => void): void {
    const { method, url, body, headers } = req;

    const redactedBody = this.redactSensitiveData(body);

    // Log Request
    this.logger.log({
      message: 'Incoming Request',
      method,
      url,
      body: redactedBody,
      headers,
    });

    // Capture Response
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks: any[] = [];

    res.write = (...args: any[]) => {
      chunks.push(Buffer.from(args[0]));
      return oldWrite.apply(res, args);
    };

    res.end = (...args: any[]) => {
      if (args[0]) {
        chunks.push(Buffer.from(args[0]));
      }
      const responseBody = Buffer.concat(chunks).toString('utf8');

      const redactedResponseBody = this.redactSensitiveData(
        JSON.parse(responseBody || '{}'),
      );

      // Log Response
      this.logger.log({
        message: 'Outgoing Response',
        method,
        url,
        statusCode: res.statusCode,
        responseBody: redactedResponseBody,
      });

      oldEnd.apply(res, args);
    };

    next();
  }
  private redactSensitiveData(data: Record<string, any>): Record<string, any> {
    const redactedData = { ...data };
    const sensitiveFields = ['password', 'creditCard', 'token', 'secret'];

    for (const field of sensitiveFields) {
      if (field in redactedData) {
        redactedData[field] = '***';
      }
    }

    return redactedData;
  }
}
