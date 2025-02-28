import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClipboardList, faHotel, faChartArea, faBars } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-navigation',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './admin-navigation.component.html',
  styleUrl: './admin-navigation.component.css'
})
export class AdminNavigationComponent {

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
    this.router.navigate(['/hotels/admin/dashboard']); // Navigate to home
    this.isMenuOpen = false; // Close the menu after navigation
  }

  navigateToHotels(): void {
    this.router.navigate(['/hotels/admin/hotels']); // Navigate to my bookings page
    this.isMenuOpen = false; // Close the menu after navigation
  }

  navigateToBookings(): void {
    this.router.navigate(['/hotels/admin/bookings']); // Navigate to my bookings page
    this.isMenuOpen = false; // Close the menu after navigation
  }

}
