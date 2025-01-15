import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent {
  passengers: Passenger[] = [];
  totalPrice: number = 0;
  numberOfPassengers: number = 1; // Initialize to 1 by default
  validationMessage: string = ''; // Property to store the validation message
  notificationClass: string = ''; // Class for notification styling
  selectedFlight: any = null;

  @Output() bookingCancelled = new EventEmitter<void>();

  constructor(
    private router: Router,
    private flightService: FlightService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.flightService.getFlights().subscribe({
        next: (flights) => {
          this.selectedFlight = flights.find((flight) => flight.id === id);
          if (this.selectedFlight) {
            this.updatePassengerCount();
            this.updateTotalPrice();
          } else {
            console.error('Flight not found');
            this.showValidationMessage('Flight not found.', 'error');
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Error fetching flights:', error);
          this.showValidationMessage('Error loading flight details.', 'error');
        },
      });
    } else {
      console.error('No flight ID provided');
      this.showValidationMessage('Invalid flight ID.', 'error');
      this.router.navigate(['/']);
    }
  }

  confirmBooking(): void {
    this.validationMessage = '';

    if (!this.selectedFlight) {
      this.showValidationMessage(
        'Flight details are missing. Cannot confirm booking.',
        'error'
      );
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
          this.showValidationMessage('Booking confirmed and saved!', 'success');
          if (this.selectedFlight) {
            this.router.navigate(['/seat', this.selectedFlight.id]); // Pass flight ID dynamically
          } else {
            console.error('No flight selected');
          }
        },
        (error) => {
          console.error('Failed to save booking data:', error);
          this.showValidationMessage(
            'Failed to save booking. Please try again.',
            'error'
          );
        }
      );
    } else {
      this.showValidationMessage('Please add passenger details.', 'error');
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
      console.error(
        'Unable to calculate total price. Flight details are missing.'
      );
      this.totalPrice = 0;
    }
  }

  showValidationMessage(message: string, type: string): void {
    this.validationMessage = message;
    this.notificationClass = type;
  }
}
