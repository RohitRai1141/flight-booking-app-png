import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-demopage',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './demopage.component.html',
  styleUrl: './demopage.component.css',
})
export class DemopageComponent {
  selectedRole: string = 'end-user'; // Default role
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
        this.router.navigate(['/tours/home']);
        break;
      case 'SubAdmin':
        this.router.navigate(['tours/agencyadmin/AG001/dashboard/packages']);
        break;
      case 'Admin':
        this.router.navigate(['tours/superadmin/dashboard']);
        break;
      case null:
        history.back();
    }
  }
}