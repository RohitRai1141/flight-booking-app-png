// flight-search.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlightService, Flight } from '../../../app/services/flight.service';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add these imports
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {
  from: string = '';
  to: string = '';
  departDate: string = '';
  
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.flightService.getFlights().subscribe((data: Flight[]) => {
      this.flights = data;
      this.filteredFlights = data;
    });
  }

  searchFlights(): void {
    this.filteredFlights = this.flights.filter(flight => {
      return (
        (!this.from || flight.from.toLowerCase().includes(this.from.toLowerCase())) &&
        (!this.to || flight.to.toLowerCase().includes(this.to.toLowerCase())) &&
        (!this.departDate || flight.departureDate === this.departDate)
      );
    });
  }
}