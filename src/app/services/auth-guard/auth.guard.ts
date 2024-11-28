// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from '../auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(private authService: AuthService, private router: Router) { }

//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> | Promise<boolean> | boolean {
    
//     const token = this.authService.getSessionToken();

//     if (token && this.isTokenValid(token)) {
      
//       return true;
//     } else {
      
//       this.showTokenExpiredAlert();
//       this.router.navigate(['/login']);  
//       return false;
//     }
//   }

  
//   private isTokenValid(token: string): boolean {
    
//     const decodedToken = this.decodeToken(token);
//     const expirationDate = new Date(decodedToken.exp * 1000); 
//     return expirationDate > new Date(); 
//   }

//   // Decode JWT token (use your own method or library)
//   private decodeToken(token: string): any {
//     const payload = token.split('.')[1]; 
//     const decoded = atob(payload); 
//     return JSON.parse(decoded);
//   }

//   // Show alert when the token is expired or invalid
//   private showTokenExpiredAlert() {
//     alert('Session has expired or is invalid. Please log in again.');
//   }
// }
