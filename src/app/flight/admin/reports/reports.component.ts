import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { FlightService } from '../services/flight.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  flightReports: any[] = []; // Replace with a specific interface if available
  totalRevenue: number = 0;

  // Chart.js bar chart instance
  bookingTrendChart: Chart | null = null;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.flightService.getUserData().subscribe({
      next: (bookings) => {
        const reports = new Map<string, { revenue: number; passengers: number }>();
        bookings.forEach((booking) => {
          const flightId = booking.flight?.id || 'N/A';
          if (!reports.has(flightId)) {
            reports.set(flightId, { revenue: 0, passengers: 0 });
          }
          const current = reports.get(flightId)!;
          current.revenue += booking.totalPrice;
          current.passengers += booking.passengers.length;
        });

        this.flightReports = Array.from(reports, ([flightId, data]) => ({
          flightId,
          ...data,
        }));

        this.totalRevenue = bookings.reduce(
          (sum, booking) => sum + booking.totalPrice,
          0
        );

        this.createTrendChart(this.flightReports);
      },
      error: (err) => console.error('Failed to load reports:', err),
    });
  }

  createTrendChart(data: any[]): void {
    const labels = data.map((report) => report.flightId);
    const passengerCounts = data.map((report) => report.passengers);

    if (this.bookingTrendChart) {
      this.bookingTrendChart.destroy();
    }

    this.bookingTrendChart = new Chart('bookingTrends', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Passenger Count',
            data: passengerCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
}
