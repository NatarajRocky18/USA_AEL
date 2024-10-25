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

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50X2lkIjoxOCwiZXhwIjoxNzQwNjY0OTI3fQ.cu7NHrwS2lRuBdIKItAPMIQaU3oleFZiQM4Fh5muTcY';

    const clonedRequest = request.clone({
      setHeaders: {
        'X-Session-Token': token
      }
    });
    return next.handle(clonedRequest);
  } 
}
