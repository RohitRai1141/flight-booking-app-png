import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CabService } from '../../services/cab.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-details',
  templateUrl: './cab-booking.component.html',
  styleUrls: ['./cab-booking.component.css'],
  standalone: true,
  providers: [CabService],
  imports: [CommonModule],
})
export class CabBookingComponent implements OnInit {
  booking: any; // Changed 'cab' to 'booking'
  error: string = '';
  showPopup: boolean = false;
  bookings: any[] = [];
  minDate: string;
  maxDate: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 20);
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('id'); // Get the booking ID from the URL
    if (bookingId) {
      this.fetchBookingDetails(bookingId); // Updated method name to 'fetchBookingDetails'
    } else {
      this.error = 'Booking not found';
    }
  }

  fetchBookingDetails(id: string): void {
    // Updated method name to 'fetchBookingDetails'
    this.http.get<any>(`http://localhost:3000/cabbookings/${id}`).subscribe(
      (data) => {
        this.booking = data; // Populate the booking details from the API response
      },
      (error) => {
        this.error = 'Error fetching booking details';
      }
    );
  }

  getStatusClass(bookingDate: string, status: string): string {
    if (status === 'Cancelled') {
      return 'Cancelled';
    } else if (this.isPastBooking(bookingDate)) {
      return 'Completed';
    } else {
      return 'Upcoming';
    }
  }

  isPastBooking(bookingDate: string): boolean {
    const today = new Date().setHours(0, 0, 0, 0);
    const booking = new Date(bookingDate).setHours(0, 0, 0, 0);
    return booking < today;
  }

  back(): void {
    this.router.navigate(['/cab/booking-history']); // Navigate back to the booking history page
  }

  editBooking(bookingId: number) {
    // Navigate to the edit booking page with the booking ID
    this.router.navigate(['/edit-booking', bookingId]);
  }

  confirmCancel(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  cancelBooking(): void {
    if (this.booking && this.booking.id) {
      // Update the status to "Cancelled" rather than deleting the booking
      const updatedBooking = { ...this.booking, status: 'Cancelled' };
      this.http
        .put(
          `http://localhost:3000/cabbookings/${this.booking.id}`,
          updatedBooking
        )
        .subscribe(
          () => {
            this.router.navigate(['/booking-history']);
          },
          (error) => {
            this.error = 'Error canceling booking';
          }
        );
    }
  }
}
