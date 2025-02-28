import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-hotel-demopage',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './demopage.component.html',
  styleUrl: './demopage.component.css',
})
export class Hotels_DemopageComponent {
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
        this.router.navigate(['hotels/search']);
        break;
      case 'Hotel Service Provider':
        this.router.navigate(['hotels/service-provider/hotels']);
        break;
      case 'Admin':
        this.router.navigate(['hotels/admin/hotels']);
        break;
      case null:
        history.back();
    }
  }
}