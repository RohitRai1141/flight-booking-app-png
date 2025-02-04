import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faHome, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-toggle',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './navigation-toggle.component.html',
  styleUrl: './navigation-toggle.component.css'
})
export class NavigationToggleComponent {

  faHome = faHome;
  faClipboardList = faClipboardList;
  faBars = faBars;

  constructor(private router: Router) {}

  //toggle functions
  isMenuOpen = false; // To track the toggle state


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen; // Toggle the menu state
  }

  navigateToHome(): void {
    this.router.navigate(['/hotels/search']); // Navigate to home
    this.isMenuOpen = false; // Close the menu after navigation
  }

  navigateToMyBookings(): void {
    this.router.navigate(['/hotels/my-bookings']); // Navigate to my bookings page
    this.isMenuOpen = false; // Close the menu after navigation
  }

}
