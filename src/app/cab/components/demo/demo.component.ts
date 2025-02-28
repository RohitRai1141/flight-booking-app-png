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
export class Cab_Demo_Component {

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
        this.router.navigate(['/cab/home']);  
        break;
      case 'Cab Service Provider':
          this.router.navigate(['/service/cab-service']);  
          break;
      case 'Admin':
        this.router.navigate(['/admin/dashboard']);  
        break;
      case null:
        history.back();
    }
  }
}
