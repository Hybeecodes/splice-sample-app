import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      let errorMessages: string[] = [];
      errorMessages = ValidationPipe.formatErrorRecursive(
        errors,
        errorMessages,
      );
      throw new HttpException(
        `${errorMessages.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  private static formatErrorRecursive(
    errors: ValidationError[],
    errorMessages: string[],
  ): string[] {
    errors.forEach((error: ValidationError) => {
      if (error.constraints) {
        errorMessages.push(...Object.values(error.constraints));
      } else if (error.children.length) {
        this.formatErrorRecursive(error.children, errorMessages);
      }
    });
    return errorMessages;
  }
}
