//hotel-results.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faFilter, faStar, faMapMarkerAlt} from'@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs/operators';

import { NavigationToggleComponent } from '../navigation-toggle/navigation-toggle.component';


@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, NavigationToggleComponent],
  templateUrl: './hotel-results.component.html',
  styleUrls: ['./hotel-results.component.css'],
})
export class HotelResultsComponent implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  defaultHotelsList: Hotel[] = []; // List for default hotels
  searchParams: any;

  faFilter = faFilter;
  faStar = faStar;
  faMapMarkerAlt = faMapMarkerAlt

  

  filters = {
    price: 0,
    minPrice: 0,
    amenities: [] as string[],
    starCategories: [] as number[], // Array to store selected star categories
    rating: 0, // Minimum rating
  };

  availableAmenities = [
    'Outdoor swimming pool','Spa','Gym','Bar','Massage room','Restaurant','Children pool','Free Wifi','Karaoke','Playground','Free Parking','Lift','Sauna','Childcare service','Luggage storage','Conference room','EV charging station','Cleaning Services','Table tennis room','Yoga Retreat'];


  constructor(private route: ActivatedRoute, private hotelService: HotelService, private router: Router) {}

  location: string = "";

  ngOnInit() {
    
    this.hotelService.getSearchDetails().subscribe((details) => {
      if (details) {
        this.searchParams = details;
        this.fetchHotels(details['location']); 
      }
  });

  // Load default hotels on initialization
  this.fetchDefaultHotels();
    
  }
  
  fetchHotels(location?: string) {
    if (!location?.trim()) {
      this.hotels = [];
      this.filteredHotels = [];
      return; // No location provided, don't fetch hotels
    }
  
    const trimmedLocation = location.trim().toLowerCase();
  
    this.hotelService.getHotels().pipe(
      map((hotels: Hotel[]) => {
        // Filter hotels based on location
        const filteredHotels = hotels.filter(hotel =>
          hotel.location.toLowerCase() === trimmedLocation
        );
  
        // Add offer-related properties to each hotel
        return filteredHotels.map(hotel => {
          if (hotel.specialOffers && hotel.specialOffers.length > 0) {
            hotel.discountedPrice = this.calculateOfferPrice(hotel.price, hotel.specialOffers[0]?.discount);
            hotel.offerDescription = hotel.specialOffers[0]?.description;
          }
          return hotel;
        });
      })
    ).subscribe(
      (filteredHotels) => {
        this.hotels = filteredHotels;
        this.filteredHotels = [...filteredHotels]; // Create a fresh copy
      },
      (error) => {
        console.error('Error fetching hotel data:', error);
        this.hotels = [];
        this.filteredHotels = [];
      }
    );
  }
  
  
  fetchDefaultHotels() {
    this.hotelService.getHotels().subscribe((data) => {
      this.defaultHotelsList = data.slice(0, 18); // Restrict to 16 hotels
  
      // Add the offer-related properties to each hotel if available
      this.defaultHotelsList.forEach(hotel => {
        if (hotel.specialOffers && hotel.specialOffers.length > 0) {
          hotel.discountedPrice = this.calculateOfferPrice(hotel.price, hotel.specialOffers[0]?.discount);
          hotel.offerDescription = hotel.specialOffers[0]?.description;
        }
      });
    });
  }


  calculateOfferPrice(originalPrice: number, discount: number | undefined): number {
    if (discount === undefined) {
      return originalPrice; // If no discount, return original price
    }
    return originalPrice - (originalPrice * discount) / 100;
  }
  
  
  
  applyFilters() {
    // If all filters are cleared, revert to the original list
    if (
      !this.filters.minPrice &&
      !this.filters.price &&
      !this.filters.amenities.length &&
      !this.filters.starCategories.length &&
      !this.filters.rating
    ) {
      this.filteredHotels = [...this.hotels];
      return;
    }
  
    // Apply filtering logic
    this.filteredHotels = this.hotels.filter((hotel) => {
      // Use discounted price if available, otherwise use the regular price
      const priceToCheck = hotel.discountedPrice !== undefined ? hotel.discountedPrice : hotel.price;
  
      const matchesPrice =
        (!this.filters.minPrice || priceToCheck >= this.filters.minPrice) &&
        (!this.filters.price || priceToCheck <= this.filters.price);
  
      const matchesAmenities =
        !this.filters.amenities.length ||
        this.filters.amenities.every((amenity) => hotel.amenities.includes(amenity));
  
      const matchesStars =
        !this.filters.starCategories.length ||
        this.filters.starCategories.includes(hotel.star);
  
      const matchesRating =
        !this.filters.rating || hotel.rating >= this.filters.rating;
  
      return matchesPrice && matchesAmenities && matchesStars && matchesRating;
    });
  }
  
  

  onStarChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const star = parseInt(checkbox.value, 10);

    if (checkbox.checked) {
      this.filters.starCategories.push(star);
    } else {
      this.filters.starCategories = this.filters.starCategories.filter((s) => s !== star);
    }
  }

  onRatingChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filters.rating = parseFloat(select.value);
  }  
  
  onAmenityChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const amenity = checkbox.value;
  
    if (checkbox.checked) {
      this.filters.amenities.push(amenity);
    } else {
      this.filters.amenities = this.filters.amenities.filter((a) => a !== amenity);
    }
  }

  resetFilters() {
    // Reset all filters to their default values
    this.filters = {
      price: 0,
      minPrice: 0,
      amenities: [],
      starCategories: [],
      rating: 0,
    };

      // Clear all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
    });

    // Clear price input boxes
    const minPriceInput = document.getElementById('minPriceRange') as HTMLInputElement;
    const maxPriceInput = document.getElementById('priceRange') as HTMLInputElement;
    if (minPriceInput) minPriceInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '';

    // Reset dropdown to initial value
    const dropdown = document.querySelector('select') as HTMLSelectElement;
    if (dropdown) dropdown.value = '0'; // Assuming "Any" corresponds to the value "0"
    
      // Reset the filteredHotels array to the full list of hotels
      this.filteredHotels = [...this.hotels];
  }
  

    //to fill stars
    getFilledStars(rating: number): number[] {
    return Array(rating).fill(0); // Generate an array of the rating size
  }

    //for rating label
    getRatingLabel(rating: number): string {
      if (rating >= 4.2) {
        return 'Excellent';
      } else if (rating >= 3.5) {
        return 'Very Good';
      } else if (rating >= 3) {
        return 'Good';
      } else {
        return '';
      }
    }

    //truncation of amenities
    getTruncatedAmenities(place: string): string {
      const maxLength = 70; // Maximum length for the name
      if (place.length > maxLength) {
        const [name, distance] = place.match(/^(.*)\s\(([^)]+)\)$/)?.slice(1) || [place, ''];
        return name.substring(0, maxLength) + '... ' + (distance ? `(${distance})` : '');
      }
      return place;
    }
  
  navigateToDetails(hotel: Hotel): void {
    this.hotelService.setSelectedHotel(hotel);
    this.router.navigate(['/hotels/hotel-details', hotel.id]);
  }


      //toggle functions
      isMenuOpen = false; // To track the toggle state


      toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen; // Toggle the menu state
      }
    
      navigateToHome(): void {
        this.router.navigate(['/hotels']); // Navigate to home
        this.isMenuOpen = false; // Close the menu after navigation
      }
    
      navigateToMyBookings(): void {
        this.router.navigate(['/hotels/my-bookings']); // Navigate to my bookings page
        this.isMenuOpen = false; // Close the menu after navigation
      }

}