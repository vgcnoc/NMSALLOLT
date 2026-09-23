import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const user = req.user;
      const url = req.url;
      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'];

      return next.handle().pipe(
        tap(() => {
          this.auditService.log({
            userId: user?.id,
            action: `${method} ${url}`,
            resourceType: url.split('/')[2] || 'unknown',
            ipAddress,
            userAgent,
            details: { body: req.body, query: req.query, params: req.params }
          }).catch(err => console.error('Failed to log audit event:', err));
        }),
      );
    }

    return next.handle();
  }
}
