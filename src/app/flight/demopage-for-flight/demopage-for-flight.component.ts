import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  imports:[FormsModule],
  selector: 'app-demopage-for-flight',
  templateUrl: './demopage-for-flight.component.html',
  styleUrls: ['./demopage-for-flight.component.css']
})
export class DemopageForFlightComponent {
  selectedRole: string = 'end-user'; // Default role

  constructor(private router: Router) {}

  onLogin(): void {
    switch (this.selectedRole) {
      case 'end-user':
        this.router.navigate(['/flight/flight']);
        break;
      case 'admin':
        this.router.navigate(['/flight/history']);
        break;
      case 'super-admin':
        this.router.navigate(['flight/flight']);
        break;
      default:
        console.error('Invalid role selected');
    }
  }
}
