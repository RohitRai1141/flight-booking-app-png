import { Component,HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { CabService } from '../../services/cab.service';

interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule],
  providers: [CabService],
  templateUrl: './cab-home.component.html',
  styleUrls: ['./cab-home.component.css']
})

 

export class CabHomeComponent {
  cabs: any[] = [];
  faqs: FAQ[] = []; // Define the faqs property with type FAQ[]
  isFabMenuOpen = false;
  dropdownOptions: string[] = [];
  dropdownOpen: boolean = false;
  popupVisible = false;
  selectedCoupon = '';


  applyCoupon(coupon: string) {
    this.selectedCoupon = coupon;
    this.popupVisible = true;

    // Automatically hide the popup after 2 seconds
    setTimeout(() => {
      this.popupVisible = false;
    }, 1000);
  }


  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
  toggleFabMenu(): void {
    this.isFabMenuOpen = !this.isFabMenuOpen;
  }

  @HostListener("document:click", ["$event"])
  handleOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest(".dropdown-container")) {
      this.dropdownOpen = false;
    }
  }

  constructor(private cabService: CabService) {}

  ngOnInit(): void {
    // Fetch the FAQ data on component initialization
    this.cabService.getFAQs().subscribe((data: FAQ[]) => {
      this.faqs = data; // Assign the fetched data to faqs property
    });
  }
}


