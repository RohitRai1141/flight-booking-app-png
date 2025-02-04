import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
// import { ForgotPasswordService } from './forgotpassword.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    FormsModule,
    FontAwesomeModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl:'./forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
})
export class ForgotPasswordComponent {
  email = '';
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  faEnvelope=faEnvelope;
  // constructor(private forgotPasswordService: ForgotPasswordService) {}

  // onSubmit() {
  //   if (!this.email) {
  //     alert('Please enter your email.');
  //     return;
  //   }

  //   this.forgotPasswordService.sendResetLink(this.email).subscribe({
  //     next: () => {
  //       alert(`Password reset link has been simulated for ${this.email}`);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       alert('Failed to simulate password reset. Please try again.');
  //     },
  //   });
  // }


  onResetPassword() {
    if (!this.email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter your email',
      });
      return;
    }

    this.authService.resetPassword(this.email).subscribe({
      next: (exists) => {
        if (exists) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password reset link has been sent to your email',
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Email not found',
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong',
        });
      },
    });
  }
}

