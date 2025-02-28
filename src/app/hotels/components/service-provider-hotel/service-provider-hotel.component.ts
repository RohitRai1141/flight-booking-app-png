import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { IconDefinition,faStar,faSwimmingPool,faSpa,faDumbbell, faCocktail, faHandSparkles, faUtensils, faBaby, faWifi, faMicrophone,faFutbol, faParking, faBuilding, faHotTub, faChild, faSuitcase, faChalkboardTeacher, faChargingStation, faBroom, faTableTennis, faOm, faSmokingBan, faSmoking, faShower, faBath, faWind, faArchway, faWater, faSeedling, faConciergeBell, faCity, faMountain, faTree,faBed,faMapMarkerAlt,faHotel,faMapPin,faPlane,faTrain,faBus,faRulerCombined,faUser,faCalendarCheck,faCalendarMinus} from '@fortawesome/free-solid-svg-icons';

import { HotelService } from '../../services/hotel.service';
import { ServiceProviderNavigationComponent } from '../service-provider-navigation/service-provider-navigation.component';


@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, ServiceProviderNavigationComponent],
  templateUrl: './service-provider-hotel.component.html',
  styleUrls: ['./service-provider-hotel.component.css'],
})
export class ServiceProviderHotelComponent implements OnInit {

  hotel: any;
  faStar = faStar;
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
  faMapMarkerAlt = faMapMarkerAlt;
  faHotel = faHotel;
  faMapPin = faMapPin;
  faPlane = faPlane;
  faTrain = faTrain;
  faBus = faBus;
  faRulerCombined = faRulerCombined;
  faUser = faUser;
  faCalendarCheck = faCalendarCheck;
  faCalendarMinus = faCalendarMinus;

  constructor(private route: ActivatedRoute, private hotelService: HotelService,private router: Router) 
  {
  }

  ngOnInit(): void {
    const hspid = sessionStorage.getItem('userId') || 'USER001';;
    this.hotelService.getHotelByhspId(hspid).subscribe((data) => {
      if (data) {
        this.hotel = data;
      } else {
        console.log('Hotel not found');
      }
    });
  }

  fetchHotelDetails(id: number): void {
    this.hotelService.getHotelById(id).subscribe((data) => {
      this.hotel = data;
    });
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


}