import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import FlightsJson from '../flights.json';
import { BookingComponent } from '../booking/booking.component';
import { Flight } from '../models/flight.interface';

interface Passenger {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  postalCode: string;
}

@Component({
  selector: 'app-flight',
  standalone: true,
  imports: [CommonModule, FormsModule, BookingComponent,RouterLink],
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent {

  

  // Initialize from JSON file
  flights: Flight[] = FlightsJson.flights;
  filteredFlights: Flight[] = [...this.flights];
  noFlightsFound: boolean = false;
  selectedFlight: Flight | null = null;

  http = inject(HttpClient);
  private apiUrl = "http://localhost:3000";

  searchCriteria = {
    from: '',
    to: '',
    date: '',
    airline: ''
  };
  

  constructor(private router: Router) {
    // If you want to fetch from API instead of JSON file, uncomment this:
    /*
    this.getFlights().subscribe((data: any) => {
      console.log('Fetched Flights:', data);
      this.flights = data.flights || [];
      this.filteredFlights = [...this.flights];
    });
    */
  }

  getFlights(): any {
    return this.http.get<{flights: Flight[]}>(`${this.apiUrl}/flights`);
  }

  getFilteredFlights(): void {
    this.filteredFlights = this.flights.filter(flight => {
      const matchesFrom = flight.from.toLowerCase().includes(this.searchCriteria.from.toLowerCase());
      const matchesTo = flight.to.toLowerCase().includes(this.searchCriteria.to.toLowerCase());
      const matchesAirline = flight.airline.toLowerCase().includes(this.searchCriteria.airline.toLowerCase());

      const [day, month, year] = flight.departureDate.split('-');
      const normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      const matchesDate = this.searchCriteria.date ? normalizedDate === this.searchCriteria.date : true;

      return matchesFrom && matchesTo && matchesAirline && matchesDate;
    });

    this.noFlightsFound = this.filteredFlights.length === 0;
  }

  onSubmit(): void {
    this.getFilteredFlights();
    console.log('Filtered Flights:', this.filteredFlights);
  }

  selectFlight(flight: Flight): void {
    this.selectedFlight = flight;
  }

  cancelBooking(): void {
    this.selectedFlight = null;
  }
}