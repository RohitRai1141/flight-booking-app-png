import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CabService } from '../../services/cab.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-cab-search',
  templateUrl: './cab-search.component.html',
  styleUrls: ['./cab-search.component.css'],
  standalone: true,
  providers: [CabService],
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
})


export class CabSearchComponent implements OnInit {
  location: string = '';
  dropLocation: string = '';
  time: string = '';
  rideType: string = '';
  cabs: any[] = [];
  isPopupVisible: boolean = false;
  popupMessage: string = '';
  dropdownOptions: string[] = [];
  dropdownOpen: boolean = false;
  isFabMenuOpen = false;
  cities: string[] = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];

  constructor(private cabService: CabService, private router: Router) {}

  ngOnInit(): void {
    this.cabService.getCabs().subscribe((data) => {
      this.cabs = data;
    });
  }

  onSearch(): void {
    // Validation: Check if both location and dropLocation are empty
    if (!this.location && !this.dropLocation) {
      this.showPopup('Please enter the pickup and drop locations to search.');
      return;
    }

    if (this.location && !this.dropLocation) {
      this.showPopup('Please enter the drop location to search.');
      return;
    }

    if (!this.location && this.dropLocation) {
      this.showPopup('Please enter the pickup location to search.');
      return;
    }

    // Filter cabs based on location and ride type
    const filteredCabs = this.cabs.filter((cab) =>
      (this.location ? cab.location.includes(this.location) : true) && 
      (this.dropLocation ? cab.dropLocation.includes(this.dropLocation): true)&&
      (this.rideType ? cab.type.includes(this.rideType) : true)
    );

    this.cabs = filteredCabs;
  }
  showPopup(message: string): void {
    this.popupMessage = message;
    this.isPopupVisible = true;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
  toggleFabMenu(): void {
    this.isFabMenuOpen = !this.isFabMenuOpen;
  }

  onSelectCab(cabId: number): void {
    this.router.navigate(['/cab/cab-details', cabId]);
  }

   // Method to navigate to the previous page
   goBack(): void {
    this.router.navigate(['/cab/home']); 
   }
}
