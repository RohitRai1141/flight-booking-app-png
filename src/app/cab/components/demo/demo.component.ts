import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],  
})
export class DemoComponent {
  selectedRole: string = 'end-user'; // Default role

  constructor(private router: Router) {}

  onLogin(): void {
    switch (this.selectedRole) {
      case 'user':
        this.router.navigate(['/cab/home']);  
        break;
      case 'admin':
        this.router.navigate(['/admin/dashboard']);  
        break;
      default:
        console.error('Invalid role selected');  
    }
  }
}
