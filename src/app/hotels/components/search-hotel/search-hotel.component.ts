//search-hotel.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faStar, faCalendarCheck, faCalendarMinus, faUser, faBed, faChild, faArrowRight, faMapMarkerAlt, faBars, faClipboardList, faHome } from '@fortawesome/free-solid-svg-icons';

import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';

import { NavigationToggleComponent } from '../navigation-toggle/navigation-toggle.component';

@Component({
  selector: 'app-hotel-search',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule, NavigationToggleComponent],
  templateUrl: './search-hotel.component.html',
  styleUrls: ['./search-hotel.component.css'],
})
export class SearchHotelComponent implements OnInit {
  hotels: Hotel[] = [];
  topDeals: Hotel[] = [];
  minCheckinDate: string;

  searchParams = {
    location: '',
    startDate: '',
    endDate: '',
    rooms: 1,
    adults: 1,
    children: 0,
  };

  faSearch = faSearch;
  faMapMarkerAlt = faMapMarkerAlt;
  faStar = faStar;
  faCalendarCheck = faCalendarCheck;
  faCalendarMinus = faCalendarMinus;
  faUser = faUser;
  // faLocation = faLocation;
  faBed = faBed;
  faChild = faChild;
  faArrowRight = faArrowRight;
  faBars = faBars;
  faClipboardList = faClipboardList;
  faHome = faHome;


  constructor(private hotelService: HotelService, private router: Router) {

    const today = new Date();
    this.minCheckinDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.fetchHotels();
  }

  fetchHotels() {
    this.hotelService.getHotels().subscribe(
      (data) => {
        this.hotels = data;
  
        // Apply discount and filter top deals
        this.topDeals = this.hotels.map((hotel) => {
          if (hotel.specialOffers?.length > 0) {
            // Apply the first offer's discount to the hotel price
            const discount = hotel.specialOffers[0].discount || 0;
            hotel.discountedPrice = Math.round(hotel.price - (hotel.price * discount) / 100);
            hotel.offerDescription = hotel.specialOffers[0].description;
          } else {
            // If no offers, use the original price
            hotel.discountedPrice = hotel.price;
            hotel.offerDescription = "";
          }
          return hotel;
        }).filter((hotel) => hotel.discountedPrice < hotel.price); // Filter hotels by discounted price
      },
      (error) => {
        console.error('Error fetching hotel data:', error);
      }
    );
  }
  

  onSearch() {

  this.hotelService.setSearchDetails(this.searchParams);

    const { location } = this.searchParams;
    if (!location.trim()) {
      return; // Prevent empty location searches
    }
    this.router.navigate(['/hotels/search-results']);
  }
  

  navigateToDetails(hotel: Hotel): void {
    this.hotelService.setSelectedHotel(hotel);
    this.router.navigate(['/hotels/hotel-details', hotel.id]);
  }


  navigateToLocation(location: string): void {
    if (!location.trim()) {
      console.error('Invalid location');
      return;
    }
    this.router.navigate(['/hotels/search-results']);
  }
  
  navigateWithParams(location: string): void {
    this.searchParams.location = location;
    this.hotelService.setSearchDetails(this.searchParams);
    this.router.navigate(['/hotels/search-results']);

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


    //for getting next date for checkout date
    getNextDate(date: string | null): string {
      if (!date) {
        return ''; // Return empty string if date is not provided
      }
      const selectedDate = new Date(date);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1); // Add one day
      return nextDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    }

}