import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  imports:[FormsModule],
  standalone: true,
  selector: 'app-demopage-for-flight',
  templateUrl: './demopage-for-flight.component.html',
  styleUrls: ['./demopage-for-flight.component.css']
})
export class DemopageForFlightComponent {

  constructor(private router: Router) {
    const user = sessionStorage.getItem('role');
    this.checkUser(user);
  }
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async checkUser(user: String | null): Promise<void>{
    await this.sleep(1500);
    switch (user) {
      case 'User':
        this.router.navigate(['/flight/search']);
        break;
      case 'Flight Service Provider':
        this.router.navigate(['/flight/service-provider']);
        break;
      case 'Admin':
        this.router.navigate(['/flight-admin/panel']);
        break;
      case null:
        history.back();
    }
  }
  // onLogin(): void {
  //   switch (this.selectedRole) {
  //     case 'end-user':
  //       this.router.navigate(['/flight/search']);
  //       break;
  //     case 'admin':
  //       this.router.navigate(['/flight-admin/panel']);
  //       break;
  //     case 'service-provider':
  //       this.router.navigate(['/flight/service-provider']);
  //       break;
  //     default:
  //       console.error('Invalid role selected');
  //   }
  // }
}
