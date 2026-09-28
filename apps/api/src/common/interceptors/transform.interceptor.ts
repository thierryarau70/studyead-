import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((resData) => {
        // If the handler already returned an object with items and meta (paginated)
        if (resData && typeof resData === 'object' && 'items' in resData && 'meta' in resData) {
          return {
            success: true,
            statusCode,
            data: resData.items,
            meta: resData.meta,
          };
        }

        return {
          success: true,
          statusCode,
          data: resData,
        };
      }),
    );
  }
}
