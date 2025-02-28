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
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
})
export class ForgotPasswordComponent {
  email = '';
  message = { text: '', type: '' }; // type: 'success' or 'error'
  private authService = inject(AuthService);
  private router = inject(Router);

  onResetPassword() {
    if (!this.email) {
      this.message = { text: 'Please enter your email', type: 'error' };
      return;
    }

    this.authService.resetPassword(this.email).subscribe({
      next: (exists) => {
        if (exists) {
          this.message = { text: 'Password reset link has been sent to your email', type: 'success' };
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.message = { text: 'Email not found', type: 'error' };
        }
      },
      error: () => {
        this.message = { text: 'Something went wrong', type: 'error' };
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
