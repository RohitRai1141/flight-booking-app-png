import { Component, OnInit } from '@angular/core';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalFlights: number = 0;
  totalBookings: number = 0;
  totalRevenue: number = 0;
  notifications: string[] = [];

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadNotifications();
  }

  loadDashboardStats(): void {
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        this.totalFlights = flights.length;
      },
      error: (err) => console.error('Failed to load flights:', err),
    });

    this.flightService.getUserData().subscribe({
      next: (bookings) => {
        this.totalBookings = bookings.length;
        this.totalRevenue = bookings.reduce(
          (sum, booking) => sum + booking.totalPrice,
          0
        );
      },
      error: (err) => console.error('Failed to load bookings:', err),
    });
  }

  loadNotifications(): void {
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        flights.forEach((flight) => {
          const availableSeats = flight.availableSeats.length;
          if (availableSeats === 0) {
            this.notifications.push(`Flight ${flight.id} is overbooked.`);
          } else if (availableSeats < 5) {
            this.notifications.push(
              `Flight ${flight.id} has low seat availability (${availableSeats} seats left).`
            );
          }
        });
      },
      error: (err) => console.error('Failed to load flight notifications:', err),
    });
  }
}
