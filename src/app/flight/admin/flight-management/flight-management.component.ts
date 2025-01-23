import { Component, OnInit } from '@angular/core';
import { FlightService, Flight } from '../../services/flight.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flight-management',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './flight-management.component.html',
  styleUrls: ['./flight-management.component.css'],
})
export class FlightManagementComponent implements OnInit {
  flights: Flight[] = [];
  selectedFlight: Flight | null = null;
  isEditMode: boolean = false;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights(): void {
    this.flightService.getFlights().subscribe({
      next: (flights) => (this.flights = flights),
      error: (err) => console.error('Failed to load flights:', err),
    });
  }

  addFlight(newFlight: Flight): void {
    this.flightService.saveUserData(newFlight).subscribe({
      next: () => {
        this.loadFlights();
        alert('Flight added successfully!');
      },
      error: (err) => console.error('Failed to add flight:', err),
    });
  }

  editFlight(flight: Flight): void {
    this.selectedFlight = { ...flight };
    this.isEditMode = true;
  }

  saveFlight(updatedFlight: Flight): void {
    this.flightService.saveUserData(updatedFlight).subscribe({
      next: () => {
        this.loadFlights();
        alert('Flight updated successfully!');
        this.cancelEdit();
      },
      error: (err) => console.error('Failed to save flight:', err),
    });
  }

  deleteFlight(flightId: string): void {
    if (confirm('Are you sure you want to delete this flight?')) {
      this.flightService.getFlightById(flightId).subscribe({
        next: () => {
          this.loadFlights();
          alert('Flight deleted successfully!');
        },
        error: (err) => console.error('Failed to delete flight:', err),
      });
    }
  }

  cancelEdit(): void {
    this.selectedFlight = null;
    this.isEditMode = false;
  }
}
