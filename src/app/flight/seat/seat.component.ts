import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlightService } from '../services/flight.service';

interface Seat {
  id: string;
  status: 'available' | 'selected' | 'booked';
}

interface Passenger {
  uid: string | undefined;  
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  postalCode: string;
}

interface SeatsPayload {
  flightId: string;
  seats: {
    id: string;
    status: 'available' | 'selected' | 'booked';
  }[];
}

interface BookingData {
  flight: any;
  passengers: Passenger[];
  totalPrice: number;
  seats?: string[];
  status?: string; // Added status field
}

@Component({
  selector: 'app-seat',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.css'],
})
export class SeatComponent implements OnInit {
  allSeats: Seat[] = [];
  selectedSeats: string[] = [];
  selectedFlight: any = null;
  validationMessage: string = '';
  notificationClass: string = '';
  numberOfPassengers: number = 1;
  bookingData: BookingData | null = null;
  passengers: Passenger[] = [];

  constructor(
    private flightService: FlightService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  private generateUid(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  ngOnInit(): void {
    const flightId = this.route.snapshot.paramMap.get('id');

    // Get the number of passengers from query parameters
    this.route.queryParams.subscribe((params) => {
      this.numberOfPassengers = +params['passengers'] || 1;
    });

    if (flightId) {
      this.loadSeats(flightId);
      this.loadFlightDetails(flightId);
      this.loadBookingData(flightId);
    } else {
      console.error('No flight ID provided');
      this.showValidationMessage('Invalid flight ID.', 'error');
      this.router.navigate(['/']);
    }
  }

  
  loadBookingData(flightId: string): void {
    this.flightService.getUserData().subscribe({
      next: (users: any[]) => {
        const booking = users.find(user => 
          user.flight && 
          user.flight.id === flightId && 
          (!user.seats || user.seats.length === 0)
        );
        
        if (booking) {
          this.bookingData = booking;
          this.passengers = (booking.passengers || []).map((passenger: Passenger) => ({
            ...passenger,
            uid: passenger.uid || this.generateUid()
          }));
        }
      },
      error: (error) => {
        console.error('Error loading booking data:', error);
      }
    });
  }



  loadFlightDetails(flightId: string): void {
    this.flightService.getFlightById(flightId).subscribe({
      next: (flight) => {
        this.selectedFlight = flight;
        if (!this.selectedFlight) {
          console.error('Flight not found');
          this.showValidationMessage('Flight not found.', 'error');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error fetching flight details:', error);
        this.showValidationMessage('Error loading flight details.', 'error');
      },
    });
  }

  loadSeats(flightId: string): void {
    this.flightService.getSeats().subscribe({
      next: (data) => {
        const reversedData = [...data].reverse();
        const flightData = reversedData.find(
          (flight: any) => flight.flightId === flightId
        );

        if (flightData) {
          this.allSeats = flightData.seats;
        } else {
          console.warn(`No seats found for flight ID: ${flightId}`);
          this.allSeats = [];
        }
      },
      error: (error) => {
        console.error('Error fetching seats:', error);
        this.allSeats = [];
      },
    });
  }

  getSeatClass(seat: Seat): string {
    if (seat.status === 'booked') return 'booked';
    if (this.selectedSeats.includes(seat.id)) return 'selected';
    return 'available';
  }

  selectSeat(seat: Seat): void {
    // Prevent selecting a booked seat
    if (seat.status === 'booked') return;

    const index = this.selectedSeats.indexOf(seat.id);

    if (index === -1 && this.selectedSeats.length < this.numberOfPassengers) {
      // If seat is not selected and there's room for more passengers
      this.selectedSeats.push(seat.id);
    } else if (index !== -1) {
      // If seat is already selected, deselect it
      this.selectedSeats.splice(index, 1);
    } else if (this.selectedSeats.length >= this.numberOfPassengers) {
      // If trying to select more seats than allowed
      this.showValidationMessage(
        `You can only select up to ${this.numberOfPassengers} seats.`,
        'error'
      );
    }
  }

  saveSeats(): void {
    if (!this.selectedFlight || !this.bookingData) {
      this.showValidationMessage('Booking details are missing.', 'error');
      return;
    }

    // Validate exact number of seats selected
    if (this.selectedSeats.length !== this.numberOfPassengers) {
      this.showValidationMessage(
        `Please select exactly ${this.numberOfPassengers} seats.`,
        'error'
      );
      return;
    }

    // Prepare seats payload
    const seatsPayload: SeatsPayload = {
      flightId: this.selectedFlight.id,
      seats: this.allSeats.map((seat) => ({
        id: seat.id,
        status: this.selectedSeats.includes(seat.id) ? 'booked' : seat.status,
      })),
    };

    // First save seats status
    this.flightService.saveSeats(seatsPayload).subscribe({
      next: () => {
        // Update the booking data with selected seats and status
        const updatedBooking: BookingData = {
          ...this.bookingData!,
          seats: this.selectedSeats,
          flight: this.selectedFlight,
          passengers: this.passengers,
          totalPrice: this.selectedFlight.price * this.selectedSeats.length,
          status: 'booked', // Add the status field here
        };

        // Save the complete booking data
        this.saveCompleteBooking(updatedBooking);

        // Update local seats data
        this.allSeats = this.allSeats.map((seat) => ({
          ...seat,
          status: this.selectedSeats.includes(seat.id) ? 'booked' : seat.status,
        }));
      },
      error: (error) => {
        console.error('Error updating seats:', error);
        this.showValidationMessage('Error updating seat data.', 'error');
      },
    });
  }

  saveCompleteBooking(bookingData: BookingData): void {
    const updatedBookingData = {
      ...bookingData,
      passengers: bookingData.passengers.map((passenger: Passenger) => ({
        ...passenger,
        uid: passenger.uid || this.generateUid()
      }))
    };

    this.flightService.saveUserData(updatedBookingData).subscribe({
      next: () => {
        console.log('Complete booking data saved successfully.');
        this.showValidationMessage('Booking completed successfully!', 'success');
        this.router.navigate(['/history']);
      },
      error: (error) => {
        console.error('Error saving complete booking:', error);
        this.showValidationMessage('Error saving booking. Try again.', 'error');
      },
    });
  }

  showValidationMessage(message: string, type: string): void {
    this.validationMessage = message;
    this.notificationClass = type;
  }
}
