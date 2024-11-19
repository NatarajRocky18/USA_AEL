import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {

  constructor(private authService :AuthService , private router :Router){}
  Logo: string = 'assets/images/clientzzz.png'

  logOut(){
    this. authService.clearSessionToken();
    this.router.navigate(['/'])

  }
} 