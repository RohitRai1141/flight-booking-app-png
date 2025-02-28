import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavigationComponent } from '../admin-navigation/admin-navigation.component';
import { NgChartsModule } from 'ng2-charts';
import { Booking, Hotel } from '../../models/hotel.model';
import { HotelService } from '../../services/hotel.service';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminNavigationComponent, NgChartsModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboard_Component {
  constructor(private hotelService: HotelService) {}

  bookings: Booking[] = [];
  hotels: Hotel[] = [];

  ngOnInit() {

    this.hotelService.getHotels().subscribe((data) => {
      this.hotels = data;
    })
    this.hotelService.getBookings().subscribe((data) => {
      this.bookings = data;
      this.calculateMetrics();
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
  totalHotels: number = 0;

  // Popular Hotels Data
  popularHotels: { [key: string]: number } = {};

  // Booking Status Data
  bookingStatus: { active: number, cancelled: number, visited: number } = {
    active: 0,
    cancelled: 0,
    visited: 0
  };

  // Chart Data
  popularHotelsData: ChartData<'pie', number[], string> = {
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
  
    // Total Hotels
    
    this.totalHotels = this.hotels.length;
  
    // Popular Hotels
    this.popularHotels = {};
    this.bookings.forEach(booking => {
      if (this.popularHotels[booking.hotelName]) {
        this.popularHotels[booking.hotelName]++;
      } else {
        this.popularHotels[booking.hotelName] = 1;
      }
    });
  
    // Generate dynamic colors for the pie chart
    const colors: string[] = [];
    const hotelNames = Object.keys(this.popularHotels);
  
    hotelNames.forEach(() => {
      colors.push(this.getRandomColor());
    });
  
    // Prepare Popular Hotels Chart Data
    this.popularHotelsData = { 
      labels: Object.keys(this.popularHotels),
      datasets: [{ 
        data: Object.values(this.popularHotels), 
        backgroundColor: colors // ✅ Use local `colors` array, not `this.colors`
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