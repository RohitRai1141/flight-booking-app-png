import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../services/flight.service';

interface Seat {
  id: string;
  status: 'available' | 'selected' | 'booked';
}

@Component({
  selector: 'app-seat-map',
  standalone: true,
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.css'],
})
export class SeatMapComponent implements OnInit {
  flightId: string = '';
  seats: Seat[] = [];
  selectedSeats: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
    this.flightId = this.route.snapshot.paramMap.get('id') || '';
    if (this.flightId) {
      this.loadSeats();
    } else {
      console.error('No flight ID provided.');
    }
  }

  loadSeats(): void {
    this.flightService.getSeats().subscribe({
      next: (data) => {
        const flightData = data.find((seatData: any) => seatData.flightId === this.flightId);
        this.seats = flightData ? flightData.seats : [];
      },
      error: (err) => console.error('Failed to load seat data:', err),
    });
  }

  toggleSeatSelection(seat: Seat): void {
    if (seat.status === 'booked') return;

    if (seat.status === 'available') {
      seat.status = 'selected';
      this.selectedSeats.push(seat.id);
    } else {
      seat.status = 'available';
      this.selectedSeats = this.selectedSeats.filter((id) => id !== seat.id);
    }
  }

  saveSeats(): void {
    const payload = {
      flightId: this.flightId,
      seats: this.seats.map((seat) => ({
        id: seat.id,
        status: seat.status,
      })),
    };

    this.flightService.saveSeats(payload).subscribe({
      next: () => {
        alert('Seat selection saved successfully!');
        this.loadSeats(); // Refresh the seat map
      },
      error: (err) => console.error('Failed to save seats:', err),
    });
  }
}
