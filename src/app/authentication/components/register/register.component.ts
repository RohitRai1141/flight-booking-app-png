import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown'; // Import DropdownModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { passwordMismatchValidator } from '../../services/password-mismatch.directive';
import { AuthService } from '../../services/auth.service';
import { RegisterPostData } from '../../models/auth';
import { MessageService } from 'primeng/api';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faBirthdayCake } from '@fortawesome/free-solid-svg-icons';
import { faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FontAwesomeModule,
    DropdownModule, // Add DropdownModule to imports
    CommonModule, // Add CommonModule to imports
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private registerService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  faUser = faUser;
  faLock = faLock;
  faBirthdayCake = faBirthdayCake;
  faEnvelope = faEnvelope;
  faVenusMars = faVenusMars;
  faMapMarkerAlt = faMapMarkerAlt;
  faBuilding = faBuilding;
  // Simulated list of existing users (can be replaced with an API call)
  existingUsers = [
    { email: 'xyz@gmail.com', password: '4321' },
    { email: 'user@example.com', password: 'userpass' },
    { email: 'pqr@gmail.com', password: '2001' },
  ];

  // Define the registerForm group with controls and validation
  registerForm = new FormGroup(
    {
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/[a-z0-9\._%\+\-]+@[a-z0-9\.\-]+\.[a-z]{2,}$/),
      ]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      age: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(120),
      ]),
      gender: new FormControl('', [Validators.required]), // Gender control
      role: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
    },
    {
      validators: passwordMismatchValidator,
    }
  );

  // Gender options for the dropdown
  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  // Role options dropdown
  roleOptions = [
    { label: 'User', value: 'User' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Service Provider', value: 'Service Provider' }
  ];

  // Service Provider options dropdown
  serviceProviderOptions = [
    { label: 'Cab Service Provider', value: 'Cab Service Provider' },
    { label: 'Hotel Service Provider', value: 'Hotel Service Provider' },
    { label: 'Flight Service Provider', value: 'Flight Service Provider' },
    { label: 'Tour Service Provider', value: 'Tour Service Provider' }
  ];

  // Method to handle registration
  onRegister() {
    const email = this.registerForm.get('email')?.value ?? '';
    const password = this.registerForm.get('password')?.value ?? '';

    // Check for email duplication
    const duplicateUser = this.existingUsers.find(
      (user) => user.email === email
    );

    if (duplicateUser && duplicateUser.password !== password) {
      // Show error if email already exists with a different password
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Email is already registered with a different password',
      });
      return;
    } else if (!duplicateUser) {
      // Add new user if no duplication is found
      this.existingUsers.push({ email, password });
    }

    // Proceed with registration if validation passes
    const postData = { ...this.registerForm.value };
    delete postData.confirmPassword; // Remove confirmPassword before sending data

    this.registerService.registerUser(postData as RegisterPostData).subscribe({
      next: (response) => {
        // Show success message
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registered successfully',
        });
        // Navigate to login page
        this.router.navigate(['login']);
        console.log(response);
      },
      error: (err) => {
        // Show error message
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Registration unsuccessful',
        });
      },
    });
  }

  // Getter methods to access form controls
  get fullName() {
    return this.registerForm.get('fullName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get age() {
    return this.registerForm.get('age');
  }

  get gender() {
    return this.registerForm.get('gender');
  }

  get location() {
    return this.registerForm.get('location');
  }
  // Navigation to Login Page
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}