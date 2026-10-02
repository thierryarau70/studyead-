import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  transform(value: unknown, metadata?: ArgumentMetadata) {
    // Only validate request body payloads, skip custom decorators like @CurrentUser() or @Param()
    if (metadata && metadata.type !== 'body') {
      return value;
    }

    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new BadRequestException({
          message: 'Falha na validação dos dados',
          details: formattedErrors,
        });
      }
      throw new BadRequestException('Erro de validação');
    }
  }
}
