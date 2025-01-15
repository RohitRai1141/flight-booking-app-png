import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../services/flight.service';

interface Seat {
  id: string;
  status: 'available' | 'selected' | 'booked';
}

@Component({
  selector: 'app-seat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.css'],
})
export class SeatComponent implements OnInit {
  allSeats: Seat[] = [];
  selectedSeats: string[] = [];
  selectedFlight: any = null; // Stores the flight details
  validationMessage: string = '';
  notificationClass: string = '';

  constructor(
    private flightService: FlightService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const flightId = this.route.snapshot.paramMap.get('id'); // Fetch flight ID from route
    if (flightId) {
      this.loadFlightDetails(flightId);
    } else {
      console.error('No flight ID provided');
      this.showValidationMessage('Invalid flight ID.', 'error');
      this.router.navigate(['/']);
    }
    this.loadSeats();
  }

  // Load the selected flight details
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

  // Load the seat data from the backend
  loadSeats(): void {
    this.flightService.getSeats().subscribe({
      next: (data) => {
        this.allSeats = data;
      },
      error: (error) => {
        console.error('Error fetching seats:', error);
      },
    });
  }

  // Get the class for each seat based on its status
  getSeatClass(seat: Seat): string {
    if (seat.status === 'booked') return 'booked';
    if (this.selectedSeats.includes(seat.id)) return 'selected';
    return 'available';
  }

  // Handle seat selection
  selectSeat(seat: Seat): void {
    if (seat.status === 'booked') return;

    const index = this.selectedSeats.indexOf(seat.id);
    if (index === -1) {
      this.selectedSeats.push(seat.id);
    } else {
      this.selectedSeats.splice(index, 1);
    }
  }

  // Save the selected seats and update the backend
  saveSeats(): void {
    if (!this.selectedFlight) {
      this.showValidationMessage('Flight details are missing.', 'error');
      return;
    }
  
    // Update seat statuses while maintaining array structure
    const updatedSeats = this.allSeats.map((seat) => ({
      id: seat.id,
      status: this.selectedSeats.includes(seat.id) ? 'booked' : seat.status
    }));
  
    // Save the entire updated seats array
    this.flightService.saveSeats(updatedSeats).subscribe({
      next: (response) => {
        // Update local state with the new seats array
        this.allSeats = response.seats || [];
        this.showValidationMessage('Seats booked successfully!', 'success');
        
        const userBooking = {
          flight: this.selectedFlight,
          seats: this.selectedSeats,
          bookingDate: new Date().toISOString()
        };
        
        this.saveUserBooking(userBooking);
      },
      error: (error) => {
        console.error('Error updating seats:', error);
        this.showValidationMessage('Error updating seat data.', 'error');
      },
    });
  }
  private saveUserBooking(userBooking: any): void {
    this.flightService.saveUserData(userBooking).subscribe({
      next: () => {
        console.log('User booking data saved successfully.');
        // this.router.navigate(['/history']);
      },
      error: (error) => {
        console.error('Error saving booking data:', error);
        this.showValidationMessage('Error saving booking. Try again.', 'error');
      },
    });
  }

  // Display validation messages
  showValidationMessage(message: string, type: string): void {
    this.validationMessage = message;
    this.notificationClass = type;
  }
}
