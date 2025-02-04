import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserLock, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    CommonModule,
    FontAwesomeModule,
    ButtonModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  login = { email: '', password: '' };

  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  faUserLock = faUserLock;
  faEnvelope = faEnvelope;
  faLock = faLock;

  onLogin() {
    const { email, password } = this.login;

    // Log the login attempt for debugging
    console.log('Login initiated:', { email, password });

    this.authService.getUserDetails(email, password).subscribe({
      next: (response) => {
        console.log('API Response:', response);

        if (response.length > 0) {
          const user = response[0];

          // Save user details in sessionStorage
          sessionStorage.setItem('userId', user.id);
          sessionStorage.setItem('role', user.role); // Save role from server response
          sessionStorage.setItem('email', user.email);

          console.log("user", user);
          console.log("role", user.role);
          console.log("email", user.email);

          // Redirect based on role
          if (user.role === 'Admin') {
            this.router.navigate(['/admin-dashboard']).then((success) => {
              if (success) console.log('Navigation to Admin Dashboard successful');
              else console.error('Navigation to Admin Dashboard failed');
            });
          } else {
            this.router.navigate(['/home']).then((success) => {
              if (success) console.log('Navigation to Home successful');
              else console.error('Navigation to Home failed');
            });
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Invalid email or password',
          });
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to log in. Please try again later.',
        });
      },
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToForgotpassword() {
    this.router.navigate(['/forgotpassword']);
  }
}