import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Hotel, Room, specialOffers, Guest, Booking } from '../../models/hotel.model';
import { HotelService } from '../../services/hotel.service';

import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { NavigationToggleComponent } from '../navigation-toggle/navigation-toggle.component';

@Component({
  selector: 'app-hotel-booking',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule, NavigationToggleComponent],
  templateUrl: './hotel-booking.component.html',
  styleUrl: './hotel-booking.component.css'
})
export class HotelBookingComponent {

  name!: string;
  age!: number;
  email!: string;
  phone!: string;
  gender: string = '';
  hotel!: Hotel;
  room: Room = {} as Room;
  searchDetails: any;
  totalPrice: number = 0;
  gstAmount: number = 0;
  totalPayable: number = 0;
  bookingStatus: string = '';
  bookingDetails: Booking = {} as Booking;
  showConfirmation: boolean = false;
  checkIn : any;
  checkOut : any;
  stayDuration : number = 0;
  noOfRooms : number = 1;
  otherGuests: { name: string; age: number; gender: string }[] = [];


   // Offer details
   offerApplied: number = 0; // To display the offer applied
   netPrice: number = 0; // Net price after applying the offer

  //icons
  faCheckCircle = faCheckCircle;

  constructor(private hotelService: HotelService, private router: Router) {}

  ngOnInit() {
    this.hotelService.getSelectedHotel().subscribe((hotel) => (this.hotel = hotel!));
    this.hotelService.getSelectedRoom().subscribe((room) => (this.room = room));
    this.hotelService.getSearchDetails().subscribe((details) => {
      this.searchDetails = details;
      setTimeout(() => {
        this.calculateTotalPrice();
      }, 100);

      this.initializeGuestFields(details.adults, details.children);

    });
  }

  initializeGuestFields(adults: number, children: number) {
    const totalGuests = adults + children - 1; // Exclude main guest
    this.otherGuests = Array.from({ length: totalGuests }, () => ({ name: '', age: 0, gender: '' }));
  }

  calculateTotalPrice() {
    if (this.searchDetails && this.room) {

     this.checkIn = new Date(this.searchDetails.startDate);
     this.checkOut = new Date(this.searchDetails.endDate);
     this.stayDuration = Math.ceil((this.checkOut.getTime() - this.checkIn.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      this.noOfRooms = this.searchDetails.rooms;
      this.totalPrice = this.stayDuration * this.room.price * this.noOfRooms;
 
    // Check if the hotel has special offers
    const specialOffer = this.hotel.specialOffers.find(offer => offer.discount > 0);
    if (specialOffer) {
      // Calculate offer amount based on the discount percentage
      this.offerApplied = (this.totalPrice * specialOffer.discount) / 100;
      this.netPrice = this.totalPrice - this.offerApplied;
    } else {
      // No discount available
      this.offerApplied = 0;
      this.netPrice = this.totalPrice;
    }

    // Calculate GST and total payable
    this.gstAmount = this.netPrice * 0.18;
    this.totalPayable = this.netPrice + this.gstAmount;

    }
  }

  onSubmit(bookingForm: any) {

    const userid = 'USER001';
   
    if (bookingForm.valid) {
  
    const bookingData = {
      id: Math.random().toString(36).substring(2, 9),
      userid: userid,
      hotelid : this.hotel.id,
      hotelName: this.hotel.name,
      hotelImage: this.hotel.images[0],
      location: this.hotel.location,
      name: this.name,
      age: this.age,
      gender: this.gender,  
      email: this.email,
      phone: this.phone,
      guests: this.otherGuests,
      roomType: this.room.type,
      roomPrice: this.room.price,
      noOfrooms: this.noOfRooms,
      stayDuration: this.stayDuration,
      noOfGuests: this.otherGuests.length + 1,
      totalPrice:this.totalPrice,
      offer: this.offerApplied, 
      netPrice: this.netPrice,
      totalPayable: this.totalPayable,
      checkIn: this.checkIn.toLocaleDateString(),
      checkOut: this.checkOut.toLocaleDateString(),
      status: 'booked',

    }

    this.bookingDetails = bookingData;
    };

    
    

     // Call the service method to save the booking data to db.json
     this.hotelService.bookHotel(this.bookingDetails).subscribe(
      (response) => {
        this.bookingStatus = 'Your hotel is booked! You can visit the hotel on the selected dates.';
        console.log('Booking response:', response);
      },
      (error) => {
        this.bookingStatus = 'Failed to book the hotel. Please try again later.';
        console.error('Booking error:', error);
      }
    );

    this.showConfirmation = true;
  }

  viewDetails() {
    this.router.navigate(['/hotels/my-bookings']);
  }

  goToHome() {
    this.router.navigate(['/hotels']);
  }

  
}