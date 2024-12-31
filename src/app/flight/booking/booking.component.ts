import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../services/flight.service';

interface Passenger {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  postalCode: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent {
  passengers: Passenger[] = [];
  totalPrice: number = 0;
  numberOfPassengers: number = 1; // Initialize to 1 by default

  userObject : any={
    "firstName": "",
    "middleName": "",
      "lastName": "",
      "dateOfBirth": "",
      "gender": "",
      "nationality": "",
      "postalCode": ""
  }

  @Input() selectedFlight: any;
  @Output() bookingCancelled = new EventEmitter<void>();

  constructor(private router: Router, private flightService: FlightService) {}

  ngOnInit(): void {
    if (this.selectedFlight) {
      this.updatePassengerCount(); // Ensure the passenger array matches `numberOfPassengers`
      this.updateTotalPrice();
    } else {
      console.error('Selected flight is not defined');
    }
  }

  confirmBooking(): void {
    
    if (!this.selectedFlight) {
      alert('Flight details are missing. Cannot confirm booking.');
      return;
    }

    if (this.passengers.length > 0) {
      const bookingData = {
        flight: this.selectedFlight,
        passengers: this.passengers,
        totalPrice: this.totalPrice,
      };

      this.flightService.saveUserData(bookingData).subscribe(
        (response) => {
          alert('Booking confirmed and saved to user.json!');
          this.router.navigate(['/confirmation']);
        },
        (error) => {
          console.error('Failed to save booking data:', error);
          alert('Failed to save booking. Please try again.');
        }
      );
    } else {
      alert('Please add passenger details.');
    }
  }

  cancelBooking(): void {
    this.bookingCancelled.emit();
  }

  addPassenger(): void {
    const passenger: Passenger = {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      postalCode: '',
    };
    this.passengers.push(passenger);
    this.updateTotalPrice();
  }

  removePassenger(index: number): void {
    if (this.passengers.length > 1) {
      this.passengers.splice(index, 1);
      this.updateTotalPrice();
    }
  }

  updatePassengerCount(): void {
    const currentCount = this.passengers.length;
    if (this.numberOfPassengers > currentCount) {
      const newCount = this.numberOfPassengers - currentCount;
      for (let i = 0; i < newCount; i++) {
        this.addPassenger();
      }
    } else if (this.numberOfPassengers < currentCount) {
      this.passengers.splice(this.numberOfPassengers);
    }
    this.updateTotalPrice();
  }

  updateTotalPrice(): void {
    if (this.selectedFlight && this.selectedFlight.price !== undefined) {
      this.totalPrice = this.selectedFlight.price * this.passengers.length;
    } else {
      console.error('Unable to calculate total price. Flight details are missing.');
      this.totalPrice = 0;
    }
  }
}
