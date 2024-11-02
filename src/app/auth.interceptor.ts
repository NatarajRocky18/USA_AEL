import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const sessionToken = this.authService.getSessionToken();

    //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50X2lkIjo1fQ.RAT2cghJrs02swGkhedIIcCPEKuBIyggaQZoXn7ck2A';

    if (sessionToken) {
      const clonedRequest = request.clone({
        setHeaders: {
          'X-Session-Token': sessionToken
        }
      });

      return next.handle(clonedRequest);
    }
    return next.handle(request); 
  }
}
