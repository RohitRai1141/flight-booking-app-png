import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Define interfaces for type safety
interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
}

interface User {
  id: number;
  name: string;
  flight?: Flight;
}

interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-flight-admin-dashboard',
  templateUrl: './flight-admin-dashboard.component.html',
  styleUrls: ['./flight-admin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, NgxChartsModule, AdminNavbarComponent],
})
export class FlightAdminDashboardComponent implements OnInit {
  // Class properties
  flights: Flight[] = [];
  users: User[] = [];
  flightChartData: ChartData[] = [];
  userChartData: ChartData[] = [];

  // Chart options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Category';
  yAxisLabel = 'Count';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFlightData();
    this.loadUserData();
  }

  private loadFlightData(): void {
    this.http.get<Flight[]>('http://localhost:3000/flights')
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (data) => {
          this.flights = data;
          this.generateFlightChartData();
        },
        error: (error) => {
          console.error('Error loading flight data:', error);
        },
      });
  }

  private loadUserData(): void {
    this.http.get<User[]>('http://localhost:3000/flightusers')
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (data) => {
          this.users = data;
          this.generateUserChartData();
        },
        error: (error) => {
          console.error('Error loading user data:', error);
        },
      });
  }

  private generateFlightChartData(): void {
    const airlineCounts: { [key: string]: number } = {};

    this.flights.forEach((flight) => {
      const airline = flight.airline || 'Unknown';
      airlineCounts[airline] = (airlineCounts[airline] || 0) + 1;
    });

    this.flightChartData = Object.entries(airlineCounts).map(([name, value]) => ({
      name: `Flights (${name})`,
      value,
    }));
  }

  private generateUserChartData(): void {
    const userCategoryCounts: { [key: string]: number } = {};

    this.users.forEach((user) => {
      const category = user.flight?.airline || 'Unknown';
      userCategoryCounts[category] = (userCategoryCounts[category] || 0) + 1;
    });

    this.userChartData = Object.entries(userCategoryCounts).map(([name, value]) => ({
      name: `Users (${name})`,
      value,
    }));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  xAxisTickFormatting(value: string): string {
    return value.length > 8 ? value.slice(0, 6) + '...' : value;
  }
}