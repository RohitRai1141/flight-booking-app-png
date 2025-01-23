import { Component, OnInit } from '@angular/core';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css'],
})
export class BookingListComponent implements OnInit {
  bookings: any[] = []; // Replace `any` with the booking interface if available
  searchQuery: string = '';

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.flightService.getUserData().subscribe({
      next: (data) => {
        this.bookings = data.map((booking) => ({
          ...booking,
          flightId: booking.flight?.id || 'N/A',
        }));
      },
      error: (err) => console.error('Failed to load bookings:', err),
    });
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.flightService.saveUserSeats({ id: bookingId, seats: [] }).subscribe({
        next: () => {
          this.bookings = this.bookings.filter((booking) => booking.id !== bookingId);
          alert('Booking cancelled successfully!');
        },
        error: (err) => console.error('Failed to cancel booking:', err),
      });
    }
  }

  filterBookings(): void {
    this.bookings = this.bookings.filter((booking) =>
      `${booking.flightId} ${booking.passengers[0]?.firstName} ${booking.passengers[0]?.lastName}`
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }
}
