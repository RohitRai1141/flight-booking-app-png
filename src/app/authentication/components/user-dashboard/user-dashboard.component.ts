import { Component, OnInit, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-user-dashbaord',
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.css'],
    imports: [CommonModule, FontAwesomeModule],
    standalone: true,
})
export class UserDashboardComponent implements OnInit {
    bookings: any[] = [];
    payments: any[] = [];
    totalBookings = 0;
    totalPayments = 0;
    totalAmount = 0;
    currentSection = 'bookings'; // Default section
    //  // Declare the bookings property
    faEye = faEye;
    faEdit = faEdit;
    faTrash = faTrash;

    constructor(private http: HttpClient, private route: ActivatedRoute) { }

    ngOnInit(): void {
        // Subscribe to query parameters to determine the current section
        this.route.queryParams.subscribe((params) => {
            this.currentSection = params['section'] || 'bookings'; // Default to 'bookings'
            console.log('Current Section:', this.currentSection); // Debugging

            // Fetch data based on the current section
            if (this.currentSection === 'bookings') {
                this.fetchBookings();
            } else if (this.currentSection === 'payments') {
                this.fetchPayments();
            }
        });
    }

    // Fetch bookings from the mock backend
    fetchBookings(): void {
        this.http.get<any[]>('http://localhost:3000/bookings').subscribe({
            next: (data) => {
                this.bookings = data;
            },
            error: (err) => {
                console.error('Error fetching bookings:', err);
            },
        });
    }
    fetchPayments(): void {
        this.http.get<any[]>('http://localhost:3000/payments').subscribe(data => {
            this.payments = data;
            this.totalPayments = data.length;
            this.totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0);
        });
    }

    showSection(section: string): void {
        this.currentSection = section;
    }


    // View booking details
    viewBooking(bookingId: number): void {
        const booking = this.bookings.find((b) => b.id === bookingId);
        if (booking) {
            alert(`Booking Details:\nID: ${booking.id}\nService: ${booking.service}\nDate: ${booking.date}\nStatus: ${booking.status}`);
        } else {
            alert('Booking not found!');
        }
    }

    // Update booking (example: updating status)
    updateBooking(bookingId: number): void {
        const booking = this.bookings.find((b) => b.id === bookingId);
        if (booking) {
            const updatedStatus = prompt('Enter new status (e.g., Confirmed, Pending, Canceled):', booking.status);
            if (updatedStatus && updatedStatus.trim()) {
                booking.status = updatedStatus.trim(); // Update the status locally
                this.http.put(`http://localhost:3000/bookings/${bookingId}`, booking).subscribe({
                    next: () => {
                        alert(`Booking ID ${bookingId} updated successfully!`);
                    },
                    error: (err) => {
                        console.error('Error updating booking:', err);
                    },
                });
            }
        } else {
            alert('Booking not found!');
        }
    }

    cancelBooking(bookingId: number): void {
        if (confirm('Are you sure you want to cancel this booking?')) {
            this.http.delete(`http://localhost:3000/bookings/${bookingId}`).subscribe({
                next: () => {
                    this.bookings = this.bookings.filter((b) => b.id !== bookingId); // Remove the booking locally
                    alert(`Booking ID ${bookingId} canceled successfully!`);
                },
                error: (err) => {
                    console.error('Error canceling booking:', err);
                },
            });
        }
    }
}
