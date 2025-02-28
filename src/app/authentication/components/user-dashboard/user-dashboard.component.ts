import { Component, OnInit, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faAdjust } from '@fortawesome/free-solid-svg-icons'; // Icon import

@Component({
    selector: 'app-user-dashbaord',
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.css'],
    imports: [CommonModule, FontAwesomeModule, FormsModule],
    standalone: true,
})
export class UserDashboardComponent implements OnInit {
    userId: string = ''; // ✅ Define userId

    cabBookings: any[] = [];
    hotelBookings: any[] = [];
    tourBookings: any[] = [];
    flightBookings: any[] = [];
    payments: any[] = [];
    savedTours: any[] = [];
    newFullName: string = '';
    newLocation: string = '';
    newAge: string = '';

    totalBookings = 0;
    totalPayments = 0;
    totalAmount = 0;
    currentSection = 'bookings';

    faEye = faEye;
    faEdit = faEdit;
    faTrash = faTrash;
    faAdjust = faAdjust;
    isDarkTheme = false;

    // Function to toggle between light and dark themes
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        this.applyTheme();
    }

    // Apply the appropriate theme to the dashboard-container
    applyTheme() {
        const container = document.querySelector('.dashboard-container');

        if (this.isDarkTheme) {
            container?.classList.add('dark-theme');
            container?.classList.remove('light-theme');
        } else {
            container?.classList.add('light-theme');
            container?.classList.remove('dark-theme');
        }
    }
    constructor(private http: HttpClient, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.userId = sessionStorage.getItem('userId') || ''; // ✅ Fetch userId from sessionStorage

        this.route.queryParams.subscribe((params) => {
            this.currentSection = params['section'] || 'bookings';
            console.log('Current Section:', this.currentSection);
            this.fetchData();
        });
    }
    fetchData(): void {
        if (this.currentSection === 'bookings') {
            this.fetchAllBookings();
        } else if (this.currentSection === 'payments') {
            this.fetchPayments();
        } else if (this.currentSection === 'savedTours') {
            this.fetchSavedTours();
        }

    }

    /** ✅ Fetch All Bookings */
    fetchAllBookings(): void {
        this.http.get<any[]>('http://localhost:3000/cabBookings').subscribe({
            next: (data) => (this.cabBookings = data),
            error: (err) => console.error('Error fetching cab bookings:', err),
        });

        this.http.get<any[]>('http://localhost:3000/hotelBookings').subscribe({
            next: (data) => (this.hotelBookings = data),
            error: (err) => console.error('Error fetching hotel bookings:', err),
        });

        this.http.get<any[]>('http://localhost:3000/tourBookings').subscribe({
            next: (data) => (this.tourBookings = data),
            error: (err) => console.error('Error fetching tour bookings:', err),
        });

        this.http.get<any[]>('http://localhost:3000/flightBookings').subscribe({
            next: (data) => (this.flightBookings = data),
            error: (err) => console.error('Error fetching flight bookings:', err),
        });

    }

    /** ✅ Fetch Payments */
    fetchPayments(): void {
        this.http.get<any[]>('http://localhost:3000/payments').subscribe((data) => {
            this.payments = data;
            this.totalPayments = data.length;
            this.totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0);
        });
    }
    viewPayment(paymentId: string): void {
        const payment = this.payments.find(p => p.id === paymentId);
        if (payment) {
            alert(`Payment Details:\nID: ${payment.id}\nService: ${payment.service}\nAmount: ₹${payment.amount}\nStatus: ${payment.status}`);
        } else {
            alert('Payment not found!');
        }
    }
    updatePayment(paymentId: string): void {
        const payment = this.payments.find(p => p.id === paymentId);
        if (payment) {
            const updatedStatus = prompt('Enter new status (e.g., Completed, Pending, Failed):', payment.status);
            if (updatedStatus && updatedStatus.trim()) {
                payment.status = updatedStatus.trim();
                this.http.put(`http://localhost:3000/payments/${paymentId}`, payment).subscribe({
                    next: () => alert(`Payment ID ${paymentId} updated successfully!`),
                    error: (err) => console.error('Error updating payment:', err),
                });
            }
        } else {
            alert('Payment not found!');
        }
    }

    cancelPayment(paymentId: string): void {
        if (confirm('Are you sure you want to cancel this payment?')) {
            this.http.delete(`http://localhost:3000/payments/${paymentId}`).subscribe({
                next: () => {
                    this.payments = this.payments.filter(p => p.id !== paymentId);
                    alert(`Payment ID ${paymentId} canceled successfully!`);
                },
                error: (err) => console.error('Error canceling payment:', err),
            });
        }
    }
    getCabBookingPayments(): any[] {
        return this.payments.filter(p => p.service === 'Cab Booking');
    }
    getHotelBookingPayments(): any[] {
        return this.payments.filter(p => p.service === 'Hotel Booking');
    }
    getTourBookingPayments(): any[] {
        return this.payments.filter(p => p.service === 'Tour Package');
    }
    getFlightBookingPayments(): any[] {
        return this.payments.filter(p => p.service === 'Flight Booking');
    }

    /** ✅ Add New Bookings */
    addCabBooking(newBooking: any): void {
        this.http.post('http://localhost:3000/cabBookings', newBooking).subscribe(() => this.fetchAllBookings());
    }
    addHotelBooking(newBooking: any): void {
        this.http.post('http://localhost:3000/hotelBookings', newBooking).subscribe(() => this.fetchAllBookings());
    }
    addTourBooking(newBooking: any): void {
        this.http.post('http://localhost:3000/tourBookings', newBooking).subscribe(() => this.fetchAllBookings());
    }
    addFlightBooking(newBooking: any): void {
        this.http.post('http://localhost:3000/flightBookings', newBooking).subscribe(() => this.fetchAllBookings());
    }

    /** ✅ View Booking */
    viewBooking(serviceType: string, bookingId: string): void {
        let booking = this.getBookingById(serviceType, bookingId);
        if (booking) {
            alert(`Booking Details:\nID: ${booking.id}\nService: ${serviceType}\nStatus: ${booking.status}`);
        } else {
            alert('Booking not found!');
        }
    }

    /** ✅ Update Booking */
    updateBooking(serviceType: string, bookingId: string): void {
        let booking = this.getBookingById(serviceType, bookingId);
        if (booking) {
            const updatedStatus = prompt('Enter new status (e.g., Confirmed, Pending, Canceled):', booking.status);
            if (updatedStatus && updatedStatus.trim()) {
                booking.status = updatedStatus.trim();
                this.http.put(`http://localhost:3000/${serviceType}/${bookingId}`, booking).subscribe({
                    next: () => alert(`Booking ID ${bookingId} updated successfully!`),
                    error: (err) => console.error(`Error updating ${serviceType} booking:`, err),
                });
            }
        } else {
            alert('Booking not found!');
        }
    }

    /** ✅ Cancel Booking */
    cancelBooking(serviceType: string, bookingId: string): void {
        if (confirm('Are you sure you want to cancel this booking?')) {
            this.http.delete(`http://localhost:3000/${serviceType}/${bookingId}`).subscribe({
                next: () => {
                    this.removeBookingFromList(serviceType, bookingId);
                    alert(`Booking ID ${bookingId} canceled successfully!`);
                },
                error: (err) => console.error(`Error canceling ${serviceType} booking:`, err),
            });
        }
    }

    /** ✅ Helper Functions */
    getBookingById(serviceType: string, bookingId: string): any {
        let list = this.getBookingList(serviceType);
        return list.find((b) => String(b.id) === String(bookingId));
    }

    removeBookingFromList(serviceType: string, bookingId: string): void {
        let list = this.getBookingList(serviceType);
        this.setBookingList(serviceType, list.filter((b) => b.id !== bookingId));
    }

    getBookingList(serviceType: string): any[] {
        switch (serviceType) {
            case 'cabBookings': return this.cabBookings;
            case 'hotelBookings': return this.hotelBookings;
            case 'tourBookings': return this.tourBookings;
            case 'flightBookings': return this.flightBookings;
            default: return [];
        }
    }

    setBookingList(serviceType: string, updatedList: any[]): void {
        switch (serviceType) {
            case 'cabBookings': this.cabBookings = updatedList; break;
            case 'hotelBookings': this.hotelBookings = updatedList; break;
            case 'tourBookings': this.tourBookings = updatedList; break;
            case 'flightBookings': this.flightBookings = updatedList; break;
        }
    }
    /** ✅ Fetch Saved Tours */
    fetchSavedTours(): void {
        this.http.get<any[]>('http://localhost:3000/savedTours').subscribe(data => this.savedTours = data);
    }
    /** ✅ Get Saved Tours */
    getSavedTours(): any[] {
        return this.savedTours;
    }
    /** ✅ Switch Between Sections */
    showSection(section: string): void {
        this.currentSection = section;
        this.fetchData();
    }
    /** ✅ View Saved Tour */
    viewSavedTour(tourId: string): void {
        let tour = this.savedTours.find(t => t.id === tourId);
        if (tour) {
            alert(`Tour Details:\nID: ${tour.id}\nName: ${tour.tourName}\nLocation: ${tour.location}`);
        } else {
            alert('Tour not found!');
        }
    }

    /** ✅ Book a Saved Tour */
    bookTour(tourId: string): void {
        let tour = this.savedTours.find(t => t.id === tourId);
        if (tour) {
            alert(`Booking Tour: ${tour.tourName}`);
            // You can implement actual booking logic here (e.g., moving tour to tourBookings)
        } else {
            alert('Tour not found!');
        }
    }

    /** ✅ Remove Saved Tour */
    removeSavedTour(tourId: string): void {
        if (confirm('Are you sure you want to remove this saved tour?')) {
            this.http.delete(`http://localhost:3000/savedTours/${tourId}`).subscribe({
                next: () => {
                    this.savedTours = this.savedTours.filter(t => t.id !== tourId);
                    alert(`Saved Tour ID ${tourId} removed successfully!`);
                },
                error: (err) => console.error('Error removing saved tour:', err),
            });
        }
    }

    requestChange(updatedFullName: string, updatedAge: string, updatedLocation: string): void {
        const request = {
            id: `REQ${Date.now()}`, // Unique request ID
            userId: this.userId,
            fullName: updatedFullName,
            age: updatedAge,
            location: updatedLocation,

            status: "Pending"
        };

        this.http.post('http://localhost:3000/changeRequests', request).subscribe({
            next: () => alert('Request sent to admin!'),
            error: (err) => console.error('Error sending request:', err)
        });
    }

}
