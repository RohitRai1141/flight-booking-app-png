import { Component, OnInit } from '@angular/core';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule,AdminNavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // Chart data for flights and bookings
  public barChartData = {
    labels: ['Flights', 'Bookings'], // X-axis labels
    datasets: [
      {
        label: 'Total Counts',
        data: [120, 75], // Replace with dynamic values
        backgroundColor: ['#42A5F5', '#66BB6A'], // Bar colors
      }
    ]
  };

  // Chart options
  public barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  constructor() {}

  ngOnInit(): void {
    // In a real-world app, fetch data from API
    // Example: this.fetchChartData();
  }
}
