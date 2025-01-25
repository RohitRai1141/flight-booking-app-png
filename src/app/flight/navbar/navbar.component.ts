import { Component } from '@angular/core';
import { FlightService } from '../services/flight.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  menuActive: boolean = false;

  constructor(private flightService: FlightService) {}

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
    const menu = document.querySelector('.navbar-menu') as HTMLElement;
    if (menu) {
      menu.classList.toggle('active', this.menuActive);
    }
  }

  navigateTo(route: string): void {
    this.menuActive = false;
    // Use the service to navigate to the route
    this.flightService.navigateToRoute(route === '/flight' ? '' : route); // Redirect 'flight' to the default route
  }
}
