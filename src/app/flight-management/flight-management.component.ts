import { Component } from '@angular/core';

@Component({
  selector: 'app-flight-management',
  templateUrl: './flight-management.component.html',
  styleUrls: ['./flight-management.component.css'],
})
export class FlightManagementComponent {
  flights = [
    // Replace this with dynamic data from your JSON or backend
    { id: 'FL001', from: 'New York', to: 'London', departureDate: '20-01-2025', price: 500 },
    { id: 'FL002', from: 'Los Angeles', to: 'Tokyo', departureDate: '21-01-2025', price: 600 },
  ];

  addFlight() {
    // Logic to add a flight
    alert('Add Flight clicked');
  }

  editFlight(id: string) {
    // Logic to edit a flight
    alert(`Edit Flight with ID: ${id}`);
  }

  deleteFlight(id: string) {
    // Logic to delete a flight
    this.flights = this.flights.filter((flight) => flight.id !== id);
  }
}
