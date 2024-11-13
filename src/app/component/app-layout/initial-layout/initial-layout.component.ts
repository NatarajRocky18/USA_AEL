import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-initial-layout',
  templateUrl: './initial-layout.component.html',
  styleUrl: './initial-layout.component.scss'
})
export class InitialLayoutComponent {
   
  currentScreen = 1;
  formData = {
    applicationType: '',
    contactMethod: '',
    phone: '',
    email: '',
    otp: ''
  };
  loading = false;
  error = '';
  studentId: string = '';


  constructor (
    private router:Router,
    private authService: AuthService
  ){}

  async ngOnInit() {
    // Check for existing session token
    const sessionToken = this.authService.getSessionToken();
    console.log(sessionToken);
    if (sessionToken) {
      
      try {
        // Try to lookup student with session token
        await this.authService.lookupBySessionToken(sessionToken).toPromise();
        // If successful, navigate to questions
        this.router.navigate(['/questions']);
      } catch (error) {
        // Token invalid or expired - continue with normal flow
        console.log('Session token invalid or expired');
        console.warn("skjdfkjbk");
        
      }
    }
  }

  async next() {
    debugger
    if (!this.isCurrentStepValid()) {
      alert("Please fill out the required fields");
      return;
    }
    const contactDetail = this.formData.contactMethod === 'phone' 
    ? this.formData.phone 
    : this.formData.email;
    try {
      if (this.currentScreen == 3) {
        if (this.formData.applicationType == "new" ) {
          const createResult = await this.authService.createStudent(
            this.formData.contactMethod,
            contactDetail
          ).toPromise();
          this.studentId = createResult.id;
        } else {
          const lookupResult = await this.authService.lookupStudent(
            this.formData.contactMethod,
            contactDetail
          ).toPromise();
          this.studentId = lookupResult.id;
        }
        await this.authService.initiateChallenge(this.studentId).toPromise();
      }
      this.currentScreen++;
      console.log(this.formData.applicationType);
      console.log(this.formData.contactMethod);      

    } catch (err) {
      this.error = 'An error occurred. Please try again.';
      alert("Invalid Email or phone number ")
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  previous() {
    this.currentScreen--;
  }

  async finish() {
    if (!this.formData.otp) {
      alert("Please enter the OTP");
    }
    this.loading = true;
    this.error = '';

    try {
      // Validate OTP
      const result = await this.authService.validateOTP(
        this.studentId,
        this.formData.otp
      ).toPromise();

      // Store session token in cookie
      this.authService.setSessionToken(result.session_token);

      // Navigate to questions
      this.router.navigate(['/questions']);
    } catch (err) {
      alert("Invalid OTP. Please try again.")
      this.error = 'Invalid OTP. Please try again.';
      console.error(err);
    } finally {
      this.loading = false;
    }

  }

  isCurrentStepValid(): boolean {
    if (this.currentScreen === 1 && !this.formData.applicationType) return false;
    if (this.currentScreen === 2 && !this.formData.contactMethod) return false;
    if (this.currentScreen === 3) {
      if (this.formData.contactMethod === 'phone' && !this.formData.phone) return false;
      if (this.formData.contactMethod === 'email' && !this.formData.email) return false;
    }
    return true;
  }
}
