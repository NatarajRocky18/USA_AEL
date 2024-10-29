import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50X2lkIjo2fQ.zqug3AgeRvMpkGdaeURjGrijoneNK5oftechCE1IAzQ';

    const clonedRequest = request.clone({
      setHeaders: {
        'X-Session-Token': token
      }
    });
    return next.handle(clonedRequest);
  } 
}
