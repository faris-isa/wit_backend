import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        value = value ? value : [];
        if (value.data) {
          return { status: 200, ...value };
        } else if (typeof value.status == 'boolean') {
          return { ...value };
        } else {
          return { status: 200, data: value };
        }
      }),
    );
  }
}
