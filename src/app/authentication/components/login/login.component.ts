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
  styleUrl: './login.component.css'
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

    console.log('Login initiated:', { email, password });

    this.authService.getUserDetails(email, password).subscribe({
      next: (response) => {
        console.log('API Response:', response);

        if (response.length > 0) {
          const user = response[0];

          // Save user details in sessionStorage
          sessionStorage.setItem('userId', user.id);
          sessionStorage.setItem('role', user.role);
          sessionStorage.setItem('email', user.email);
          sessionStorage.setItem('agencyId', user.agencyId ?? null);

          console.log("User:", user);
          console.log("Role:", user.role);
          console.log("Email:", user.email);

          // Redirect based on role
          switch (user.role) {
            case 'Admin':
              this.router.navigate(['/admin-dashboard']);
              break;
            case 'Cab Service Provider':
              this.router.navigate(['/home']);
              break;
            case 'Hotel Service Provider':
              this.router.navigate(['/home']);
              break;
            case 'Flight Service Provider':
              this.router.navigate(['/home']);
              break;
            case 'Tour Service Provider':
              this.router.navigate(['/home']);
              break;
            default:
              this.router.navigate(['/home']);
              break;
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