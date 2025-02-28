import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClipboardList, faHotel, faChartArea, faBars } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-provider-navigation',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './service-provider-navigation.component.html',
  styleUrl: './service-provider-navigation.component.css'
})
export class ServiceProviderNavigationComponent {

  faBars = faBars;
  faChartArea = faChartArea;
  faHotel = faHotel;
  faClipboardList = faClipboardList;

  constructor(private router: Router) {}

  //toggle functions
  isMenuOpen = false; // To track the toggle state


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen; // Toggle the menu state
  }

  navigateToDashboard(): void {
    this.router.navigate(['/hotels/service-provider/dashboard']); // Navigate to home
    this.isMenuOpen = false; // Close the menu after navigation
  }

  navigateToHotels(): void {
    this.router.navigate(['/hotels/service-provider/hotels']); // Navigate to my bookings page
    this.isMenuOpen = false; // Close the menu after navigation
  }

}
