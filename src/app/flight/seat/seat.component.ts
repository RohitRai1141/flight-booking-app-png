import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../services/flight.service';

interface Seat {
  id: string;
  status: 'available' | 'selected' | 'booked';
}

// Update the payload interface to match the new structure
interface SeatsPayload {
  flightId: string;
  seats: {
    id: string;
    status: 'available' | 'selected' | 'booked';
  }[];
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
  selectedFlight: any = null;
  validationMessage: string = '';
  notificationClass: string = '';

  constructor(
    private flightService: FlightService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const flightId = this.route.snapshot.paramMap.get('id');
    if (flightId) {
      this.loadSeats(flightId);
      this.loadFlightDetails(flightId);
    } else {
      console.error('No flight ID provided');
      this.showValidationMessage('Invalid flight ID.', 'error');
      this.router.navigate(['/']);
    }
  }

  loadFlightDetails(flightId: string): void {
    this.flightService.getFlightById(flightId).subscribe({
      next: (flight) => {
        this.selectedFlight = flight;
        if (!this.selectedFlight) {
          console.error('Flight not found');
          this.showValidationMessage('Flight not found.', 'error');
          this.router.navigate(['/history']);
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
        // Reverse the data array to process it from bottom to top
        const reversedData = [...data].reverse();
  
        const flightData = reversedData.find((flight: any) => flight.flightId === flightId);
  
        if (flightData) {
          // If a matching flight is found, load its seats
          this.allSeats = flightData.seats;
        } else {
          console.warn(`No seats found for flight ID: ${flightId}`);
          this.allSeats = []; // Handle case where no matching flight is found
        }
      },
      error: (error) => {
        console.error('Error fetching seats:', error);
        this.allSeats = []; // Handle error by clearing seats or showing an appropriate message
      },
    });
  }
  

  getSeatClass(seat: Seat): string {
    if (seat.status === 'booked') return 'booked';
    if (this.selectedSeats.includes(seat.id)) return 'selected';
    return 'available';
  }

  selectSeat(seat: Seat): void {
    if (seat.status === 'booked') return;

    const index = this.selectedSeats.indexOf(seat.id);
    if (index === -1) {
      this.selectedSeats.push(seat.id);
    } else {
      this.selectedSeats.splice(index, 1);
    }
  }

  saveSeats(): void {
    if (!this.selectedFlight) {
      this.showValidationMessage('Flight details are missing.', 'error');
      return;
    }
  
    // Prepare payload with flightId
    const payload = {
      flightId: this.selectedFlight.id, // Add flight ID
      seats: this.allSeats.map((seat) => ({
        id: seat.id,
        status: this.selectedSeats.includes(seat.id) ? 'booked' : seat.status,
      })),
    };
  
    this.flightService.saveSeats(payload).subscribe({
      next: () => {
        this.allSeats = this.allSeats.map((seat) => ({
          ...seat,
          status: this.selectedSeats.includes(seat.id) ? 'booked' : seat.status,
        }));
        this.showValidationMessage('Seats booked successfully!', 'success');
        this.router.navigate(['/history']);
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
      },
      error: (error) => {
        console.error('Error saving booking data:', error);
        this.showValidationMessage('Error saving booking. Try again.', 'error');
      },
    });
  }

  showValidationMessage(message: string, type: string): void {
    this.validationMessage = message;
    this.notificationClass = type;
  }
}