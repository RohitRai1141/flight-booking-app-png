import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlightService } from '../services/flight.service';
import { RouterOutlet } from '@angular/router';

interface Passenger {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  postalCode: string;
}

interface ValidationError {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  postalCode?: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,RouterOutlet],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent {
  passengers: Passenger[] = [];
  totalPrice: number = 0;
  numberOfPassengers: number = 1;
  validationMessage: string = '';
  notificationClass: string = '';
  selectedFlight: any = null;
  validationErrors: { [key: number]: ValidationError } = {};

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
            this.showValidationMessage('Flight not found.', 'error');
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.showValidationMessage('Error loading flight details.', 'error');
        },
      });
    } else {
      this.showValidationMessage('Invalid flight ID.', 'error');
      this.router.navigate(['/']);
    }
  }

  validatePassenger(passenger: Passenger, index: number): boolean {
    const errors: ValidationError = {};
    let isValid = true;

    if (!passenger.firstName?.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    } else if (passenger.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
      isValid = false;
    }


    if (!passenger.lastName?.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    } else if (passenger.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
      isValid = false;
    }

    if (!passenger.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
      isValid = false;
    } else {
      const birthDate = new Date(passenger.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
        isValid = false;
      }
    }

    if (!passenger.gender) {
      errors.gender = 'Gender is required';
      isValid = false;
    }

    if (!passenger.nationality?.trim()) {
      errors.nationality = 'Nationality is required';
      isValid = false;
    }

    if (!passenger.postalCode?.trim()) {
      errors.postalCode = 'Postal code is required';
      isValid = false;
    } else if (!/^[A-Z0-9]{8,9}$/i.test(passenger.postalCode.trim())) {
      errors.postalCode = 'Invalid postal code format';
      isValid = false;
    }

    this.validationErrors[index] = errors;
    return isValid;
  }

  confirmBooking(): void {
    this.validationErrors = {};
    let isValid = true;

    if (!this.selectedFlight) {
      this.showValidationMessage('Flight details are missing. Cannot confirm booking.', 'error');
      return;
    }

    // Validate all passengers
    this.passengers.forEach((passenger, index) => {
      if (!this.validatePassenger(passenger, index)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showValidationMessage('Please correct the errors in passenger details.', 'error');
      return;
    }

    const bookingData = {
      flight: this.selectedFlight,
      passengers: this.passengers,
      totalPrice: this.totalPrice,
    };

    this.flightService.saveUserData(bookingData).subscribe({
      next: () => {
        this.showValidationMessage('Booking confirmed successfully!', 'success');
        // Navigate to /seat page, passing selectedFlight.id and numberOfPassengers as query params
        this.router.navigate(['/flight/seat', this.selectedFlight.id], {
          queryParams: { passengers: this.numberOfPassengers }, // Pass number of passengers as query param
        });
      },
      error: () => {
        this.showValidationMessage('Failed to save booking. Please try again.', 'error');
      }
    });
  }

  cancelBooking(): void {
    this.bookingCancelled.emit();
    this.router.navigate(['/']);
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
      this.passengers.splice(index, 1);  // Remove passenger from the array
      this.numberOfPassengers = this.passengers.length;  // Update the number of passengers
      this.updateTotalPrice();  // Recalculate total price
    }
  }

  updatePassengerCount(): void {
    const currentCount = this.passengers.length;
    const newCount = this.numberOfPassengers;

    if (newCount > currentCount) {
      const passengersToAdd = newCount - currentCount;
      for (let i = 0; i < passengersToAdd; i++) {
        this.addPassenger();  // Add new passengers
      }
    } else if (newCount < currentCount) {
      this.passengers.splice(newCount);  // Remove excess passengers
    }

    this.updateTotalPrice();  // Recalculate total price
  }
  updateTotalPrice(): void {
    if (this.selectedFlight && this.selectedFlight.price !== undefined) {
      this.totalPrice = this.selectedFlight.price * this.passengers.length;
    } else {
      this.totalPrice = 0;
    }
  }

  showValidationMessage(message: string, type: string): void {
    this.validationMessage = message;
    this.notificationClass = type;
  }
}