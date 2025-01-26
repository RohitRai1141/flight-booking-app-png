import { Component } from '@angular/core';

@Component({
  selector: 'app-booking-management',
  templateUrl: './booking-management.component.html',
  styleUrls: ['./booking-management.component.css'],
})
export class BookingManagementComponent {
  bookings = [
    // Replace this with dynamic data from your JSON or backend
    { id: 'B001', flightId: 'FL001', customerName: 'John Doe' },
    { id: 'B002', flightId: 'FL002', customerName: 'Jane Smith' },
  ];

  cancelBooking(id: string) {
    // Logic to cancel a booking
    this.bookings = this.bookings.filter((booking) => booking.id !== id);
  }
}
