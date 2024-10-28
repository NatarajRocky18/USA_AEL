import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor (private router:Router){}

  next() {
    if (this.isCurrentStepValid()) {
      this.currentScreen++;
      console.log(this.formData.applicationType);
      console.log(this.formData.contactMethod);
      
    } else {
      alert("Please fill out the required fields");
    }
  }

  previous() {
    this.currentScreen--;
  }

  finish() {
    if (this.formData.otp) {
      console.log("Form completed", this.formData);
      this.router.navigate(['/questions']);
      
    } else {
      alert("Please enter the OTP");
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
