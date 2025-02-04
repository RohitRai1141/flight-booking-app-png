import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService, Flight } from '../../services/flight.service';

@Component({
  selector: 'app-flight-service-provider-dashboard',
  templateUrl: './flight-service-provider.component.html',
  styleUrls: ['./flight-service-provider.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class FlightServiceProviderDashboardComponent {
  airlineId: string = ''; 
  filteredFlights: Flight[] = []; 
  airlineName: string = ''; 
  showPopup: boolean = false;

  constructor(private flightService: FlightService) {}

  searchByAirlineId() {
    if (!this.airlineId.trim()) {
      this.showErrorPopup();
      return;
    }

    this.flightService.getFlightsByAirline(this.airlineId).subscribe({
      next: (flights) => {
        if (flights.length > 0) {
          this.filteredFlights = flights;
          this.airlineName = `Airline: ${flights[0].airline}`; 
        } else {
          this.filteredFlights = [];
          this.airlineName = '';
        }
      },
      error: (error) => {
        console.error('Error fetching flights', error);
        this.filteredFlights = [];
        this.airlineName = '';
      }
    });
  }

  showErrorPopup() {
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 4000);
  }
}