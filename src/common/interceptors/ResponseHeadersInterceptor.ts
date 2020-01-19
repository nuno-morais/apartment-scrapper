import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ResponseHeadersInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next
            .handle()
            .pipe(
                tap((data) => {
                    const response = context.switchToHttp().getResponse();
                    if (Array.isArray(data)) {
                        response.set({ 'X-Total-Count': data.length });
                    }
                }),
            );
    }
}
