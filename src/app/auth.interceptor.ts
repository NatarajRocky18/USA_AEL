import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private rourter: Router) { }

  alertShown :boolean = false;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const sessionToken = this.authService.getSessionToken();

    // Clone the request and set the session token in the headers if available
    if (sessionToken) {
      const clonedRequest = request.clone({
        setHeaders: {
          'X-Session-Token': sessionToken
        }
      });

      return next.handle(clonedRequest).pipe(
        catchError(error => {
          // Handle token expiration (typically 401 or 403)
          if (error.status === 404 && !this.alertShown) {
            this.handleTokenExpiration();
            this.alertShown = true ;  

          }
          return throwError(() => error);
        })
      );
    }else{
    this.rourter.navigate(['/'])

    }
    
    return next.handle(request);
  }

  // Handle expired token
  handleTokenExpiration() {
    alert("Sesstion has expired. Please log in agian.");
    this.authService.clearSessionToken();
    this.rourter.navigate(['/'])
  }
}
