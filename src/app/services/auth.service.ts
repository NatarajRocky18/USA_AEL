import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly SESSION_TOKEN_COOKIE = 'sessionToken';
  private readonly API_BASE_URL = 'http://localhost:8000/assistant';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  // Cookie Management
  getSessionToken(): string | null {
    return this.cookieService.get(this.SESSION_TOKEN_COOKIE) || null;
  }

  setSessionToken(token: string): void {
    this.cookieService.set(this.SESSION_TOKEN_COOKIE, token, 1); // 1 day expiration
  }

  clearSessionToken(): void {
    this.cookieService.delete(this.SESSION_TOKEN_COOKIE);
  }

  lookupBySessionToken(sessionToken:string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/students/`, {
        headers: {
          'X-Session-Token': sessionToken
        }
       
      }).pipe(
        catchError(error => {
          this.clearSessionToken(); // Clear invalid token
          return throwError(() => error);
        })
      );  
  }
  // Lookup by contact details
  lookupStudent(contactMethod: string, contactDetail: string): Observable<any> {
    const params = new HttpParams()
      .set('contact_method', contactMethod)
      .set('contact_detail', contactDetail);

    return this.http.get(`${this.API_BASE_URL}/students/`, { params });
  }

  // Create new user
  createStudent(contactMethod: string, contactDetail: string): Observable<any> {
    const body = {
      contact_method: contactMethod,
      contact_detail: contactDetail
    };

    return this.http.post(`${this.API_BASE_URL}/students/`, body);
  }
  // Initiate OTP challenge
  initiateChallenge(studentId: string): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/initiate-challenge/`, {
      student_id: studentId
    });
  }

  // Validate OTP and get session token
  validateOTP(studentId: string, otp: string): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/validate-challenge/`, {
      student_id: studentId,
      code: otp
    });
  }
}