import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../services/flight.service';
import { SeatForBackend } from '../services/flight.service';

interface Seat {
  id: string;
  status: 'available' | 'selected' | 'booked';
}

// Define the payload interface to match the expected type
interface SeatsPayload {
  seats: SeatForBackend[];
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
        const flightData = data.find((flight: any) => flight.flightId === flightId);
  
        if (flightData) {
          this.allSeats = flightData.seats;
        } else {
          this.allSeats = data.seats;
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

    // Create updated seats array with proper typing
    const updatedSeats: SeatForBackend[] = this.allSeats.map(seat => ({
      id: seat.id,
      status: this.selectedSeats.includes(seat.id) ? 'booked' as const : 
              seat.status === 'booked' ? 'booked' as const : 'available' as const
    }));

    // Create properly typed payload
    const payload: SeatsPayload = {
      seats: updatedSeats
    };

    this.flightService.saveSeats(payload).subscribe({
      next: () => {
        // Update local state while preserving booked seats
        this.allSeats = this.allSeats.map(seat => ({
          ...seat,
          status: this.selectedSeats.includes(seat.id) ? 'booked' : 
                 seat.status === 'booked' ? 'booked' : 'available'
        }));
        
        this.selectedSeats = []; // Clear selected seats after booking
        this.showValidationMessage('Seats booked successfully!', 'success');
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