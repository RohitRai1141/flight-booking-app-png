import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavigationComponent } from '../admin-navigation/admin-navigation.component';
import { NgChartsModule } from 'ng2-charts';
import { Booking } from '../../models/hotel.model';
import { HotelService } from '../../services/hotel.service';
import { ChartData } from 'chart.js';
import { ServiceProviderNavigationComponent } from '../service-provider-navigation/service-provider-navigation.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminNavigationComponent, NgChartsModule, CommonModule, ServiceProviderNavigationComponent],
  templateUrl: './service-provider-dashboard.component.html',
  styleUrl: './service-provider-dashboard.component.css'
})
export class ServiceProviderDashboardComponent {
  constructor(private hotelService: HotelService) {}

  bookings: Booking[] = [];

  //userid of logged in user
  userid: string = sessionStorage.getItem('userId') || 'USER001';

  ngOnInit() {
    this.hotelService.getBookings().subscribe((data) => {
      this.hotelService.getHotelIdByhspId(this.userid).subscribe((hotelId) => {
        if (hotelId) {
          this.bookings = data.filter(booking => booking.hotelid === hotelId); // Filter bookings for HSP012
          this.calculateMetrics();
        }
      });
      
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calculateMetrics();
    });
  }


  // Metrics
  totalBookings: number = 0;
  totalRevenue: number = 0;
  totalVisits: number = 0;

  // Popular Room Types Data
  popularRoomTypes: { [key: string]: number } = {};

  // Booking Status Data
  bookingStatus: { active: number, cancelled: number, visited: number } = {
    active: 0,
    cancelled: 0,
    visited: 0
  };

  // Chart Data
  popularRoomTypesData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] }]
  };

  bookingStatusData: ChartData<'bar', number[], string> = {
    labels: ['Active', 'Cancelled', 'Visited'],
    datasets: [{ data: [], label: 'Booking Status', backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }]
  };

  calculateMetrics() {
    // Total Bookings
    this.totalBookings = this.bookings.length;

    // Total Revenue
    this.totalRevenue = this.bookings.filter(booking => booking.status === 'visited').reduce((sum, booking) => sum + booking.totalPayable, 0);

    // Total Visits
    this.totalVisits = this.bookings.filter(booking => booking.status === 'visited').length;

    // Popular Room Types
    this.popularRoomTypes = {};
    this.bookings.forEach(booking => {
      if (this.popularRoomTypes[booking.roomType]) {
        this.popularRoomTypes[booking.roomType]++;
      } else {
        this.popularRoomTypes[booking.roomType] = 1;
      }
    });

    // Generate dynamic colors for the pie chart
    const colors: string[] = [];
    const roomTypes = Object.keys(this.popularRoomTypes);

    roomTypes.forEach(() => {
      colors.push(this.getRandomColor());
    });

    // Prepare Popular Room Types Chart Data
    this.popularRoomTypesData = {
      labels: Object.keys(this.popularRoomTypes),
      datasets: [{
        data: Object.values(this.popularRoomTypes),
        backgroundColor: colors // Use local `colors` array, not `this.colors`
      }]
    };

    // Booking Status
    this.bookingStatus = { active: 0, cancelled: 0, visited: 0 };
    this.bookings.forEach(booking => {
      if (booking.status === 'booked') this.bookingStatus.active++;
      else if (booking.status === 'cancelled') this.bookingStatus.cancelled++;
      else if (booking.status === 'visited') this.bookingStatus.visited++;
    });

    // Prepare Booking Status Chart Data
    this.bookingStatusData = {
      labels: ['Active', 'Cancelled', 'Visited'],
      datasets: [{
        data: [
          this.bookingStatus.active,
          this.bookingStatus.cancelled,
          this.bookingStatus.visited
        ],
        label: 'Booking Status',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    };
  }

  // Function to generate random colors
  getRandomColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  }

}
