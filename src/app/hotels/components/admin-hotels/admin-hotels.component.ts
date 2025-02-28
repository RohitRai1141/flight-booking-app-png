import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMapMarkerAlt, faCircle, faMoneyBill, faStar, faTag, faArrowLeft, faArrowRight, IconDefinition,faSwimmingPool,faSpa,faDumbbell, faCocktail, faHandSparkles, faUtensils, faBaby, faWifi, faMicrophone,faFutbol, faParking, faBuilding, faHotTub, faChild, faSuitcase, faChalkboardTeacher, faChargingStation, faBroom, faTableTennis, faOm, faSmokingBan, faSmoking, faShower, faBath, faWind, faArchway, faWater, faSeedling, faConciergeBell, faCity, faMountain, faTree,faBed,faHotel,faMapPin,faPlane,faTrain,faBus,faRulerCombined,faUser,faCalendarCheck,faCalendarMinus} from '@fortawesome/free-solid-svg-icons';

import { FormsModule } from '@angular/forms';
import { AdminNavigationComponent } from '../admin-navigation/admin-navigation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-results',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, FormsModule, AdminNavigationComponent],
  templateUrl: './admin-hotels.component.html',
  styleUrls: ['./admin-hotels.component.css'],
})
export class AdminHotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  faMapMarkerAlt = faMapMarkerAlt;
  faCircle = faCircle;
  faMoneyBill = faMoneyBill;
  faStar = faStar;
  faTag = faTag;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  hotel: any;
  faSwimmingPool = faSwimmingPool;
  faSpa = faSpa;
  faDumbbell = faDumbbell;
  faCocktail = faCocktail;
  faHandSparkles = faHandSparkles;
  faUtensils = faUtensils;
  faBaby = faBaby;
  faWifi = faWifi;
  faMicrophone = faMicrophone;
  faFutbol = faFutbol;
  faParking = faParking;
  faBuilding = faBuilding;
  faHotTub = faHotTub;
  faChild = faChild;
  faSuitcase = faSuitcase;
  faChalkboardTeacher = faChalkboardTeacher;
  faChargingStation = faChargingStation;
  faBroom = faBroom;
  faTableTennis = faTableTennis;
  faOm = faOm;
  faSmokingBan = faSmokingBan;
  faSmoking = faSmoking;
  faShower = faShower;
  faBath = faBath;  
  faWind = faWind;
  faArchway = faArchway;
  faWater = faWater;
  faSeedling = faSeedling;  
  faConciergeBell = faConciergeBell;
  faCity = faCity;
  faMountain = faMountain;
  faTree = faTree;
  faBed = faBed;
  faHotel = faHotel;
  faMapPin = faMapPin;
  faPlane = faPlane;
  faTrain = faTrain;
  faBus = faBus;
  faRulerCombined = faRulerCombined;
  faUser = faUser;
  faCalendarCheck = faCalendarCheck;
  faCalendarMinus = faCalendarMinus;

  constructor(private hotelService: HotelService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.hotelService.getHotels().subscribe((data) => {
    this.hotels = data;
    this.updatePagination();
    });
  }


//   Pagination code
displayedHotels: Hotel[] = [];
rowsPerPageOptions: number[] = [3, 6, 9, 12];
rowsPerPage: number = 3;
currentPage: number = 1;
totalPages: number = 1;

updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.displayedHotels = this.hotels.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.hotels.length / this.rowsPerPage);
  }

  changeRowsPerPage(event: any): void {
    this.rowsPerPage = +event.target.value;
    this.currentPage = 1; // Reset to first page
    this.updatePagination();
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  //view details
  showDetailsPopup = false;
  selectedHotel: any = null;
  viewDetails(hotel: Hotel) {
      this.selectedHotel = hotel;
      this.showDetailsPopup = true;      
    }

    closeDetailsPopup(): void {
      this.showDetailsPopup = false;
    }
    calculateOfferPrice(originalPrice: number, discount: number): number {
      return Math.round(originalPrice - (originalPrice * discount) / 100);
    }
    
  
    getAmenityIcon(amenity: string): IconDefinition {
      const icons: Record<string, IconDefinition> = {
        "Outdoor swimming pool": faSwimmingPool,
        "Spa": faSpa,
        "Gym": faDumbbell,
        "Bar": faCocktail,
        "Massage room": faHandSparkles,
        "Restaurant": faUtensils,
        "Children's pool": faBaby,
        "Free Wifi": faWifi,
        "Karaoke": faMicrophone,
        "Playground": faFutbol,
        "Free Parking": faParking,
        "Lift": faBuilding,
        "Sauna": faHotTub,
        "Childcare service": faChild,
        "Luggage storage": faSuitcase,
        "Conference room": faChalkboardTeacher,
        "EV charging station": faChargingStation,
        "Cleaning Services": faBroom,
        "Table tennis room": faTableTennis,
        "Yoga Retreat": faOm,
        "Non-Smoking": faSmokingBan,
        "Smoking Permitted": faSmoking,
        "Private Bathroom": faShower,
        "Bath Tub": faBath,
        "Air Conditioning": faWind,
        "Balcony": faArchway,
        "Ocean View": faWater,
        "Garden View": faSeedling,
        "Room Service": faConciergeBell,
        "City View": faCity,
        "Mountain View": faMountain,
        "Free Breakfast": faUtensils,
        "Lagoon View": faTree,
      };
    
      // Return the icon or a default if undefined
      return icons[amenity];
    }
    
  
  
    //code for trucating surroundings name
    getTruncatedString(place: string): string {
      const maxLength = 20; // Maximum length for the name
      if (place.length > maxLength) {
        const [name, distance] = place.match(/^(.*)\s\(([^)]+)\)$/)?.slice(1) || [place, ''];
        return name.substring(0, maxLength) + '... ' + (distance ? `(${distance})` : '');
      }
      return place;
    }
  
    getTruncatedReview(place: string): string {
      const maxLength = 100; // Maximum length for the name
      if (place.length > maxLength) {
        const [name, distance] = place.match(/^(.*)\s\(([^)]+)\)$/)?.slice(1) || [place, ''];
        return name.substring(0, maxLength) + '... ' + (distance ? `(${distance})` : '');
      }
      return place;
    }
  
    getTruncatedComments(place: string): string {
      const maxLength = 200; // Maximum length for the name
      if (place.length > maxLength) {
        const [name, distance] = place.match(/^(.*)\s\(([^)]+)\)$/)?.slice(1) || [place, ''];
        return name.substring(0, maxLength) + '... ' + (distance ? `(${distance})` : '');
      }
      return place;
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
  
    @ViewChild('reviews') reviewsSection: ElementRef | undefined;
  
    scrollToReviews() {
      if (this.reviewsSection) {
        this.reviewsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }


  //delete hotel 
  showConfirmPopup: boolean = false;
  hotelToDeleteId: string | null = null;

  deleteHotel(hotelId: string): void {
    this.hotelToDeleteId = hotelId;
    this.showConfirmPopup = true; // Show the popup instead of deleting immediately
  }

  confirmDelete(): void {
    if (this.hotelToDeleteId) {
      this.hotelService.deleteHotel(this.hotelToDeleteId).subscribe(() => {
        this.hotels = this.hotels.filter(hotel => hotel.id !== this.hotelToDeleteId);
        this.updatePagination();
        this.showConfirmPopup = false; // Hide popup after deletion
        this.hotelToDeleteId = null;
      });
    }
  }
  
  cancelDelete(): void {
    this.showConfirmPopup = false; // Close popup without deleting
    this.hotelToDeleteId = null;
  }

}

