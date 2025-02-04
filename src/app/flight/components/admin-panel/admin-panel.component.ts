import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, AdminNavbarComponent],
})
export class AdminPanelComponent implements OnInit {
  flights: any[] = [];
  filteredFlights: any[] = [];
  showAddFlightForm = false;
  showDeleteFlightForm = false;
  showEditFlightForm = false;
  isDeleteModalOpen = false;
  selectedUserId: number | null = null;
  deleteFlightId = '';

  newFlight = {
    id: '',
    from: '',
    to: '',
    departureDate: '',
    price: '',
    airline: '',
    totalSeats: '',
    fromTime: '',
    toTime: '',
    duration: '',
  };

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit() {
    this.fetchFlights();
  }

  fetchFlights() {
    this.http.get<any[]>('http://localhost:3000/flights').subscribe({
      next: (data) => {
        this.filteredFlights = data;
        console.log('Fetched flights:', this.filteredFlights);
      },
      error: (err) => {
        console.error('Error fetching flights:', err);
      }
    });
  }

  saveFlight() {
    if (this.newFlight.id && this.newFlight.from && this.newFlight.to) {
      if (this.showEditFlightForm) {
        // Edit flight
        this.http.put(`http://localhost:3000/flights/${this.newFlight.id}`, this.newFlight).subscribe({
          next: () => {
            alert('Flight updated successfully!');
            this.fetchFlights();
            this.resetNewFlightForm();
            this.showEditFlightForm = false;
          },
          error: (err) => {
            console.error('Failed to update flight', err);
            alert('Error updating flight!');
          }
        });
      } else {
        // Add flight
        this.http.post('http://localhost:3000/flights', this.newFlight).subscribe({
          next: () => {
            alert('Flight added successfully!');
            this.fetchFlights();
            this.resetNewFlightForm();
            this.showAddFlightForm = false;
          },
          error: (err) => {
            console.error('Failed to add flight', err);
            alert('Error adding flight!');
          }
        });
      }
    } else {
      alert('Please fill in all required fields!');
    }
  }

  openDeleteConfirmation(flight: any) {
    this.selectedUserId = flight;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedUserId = null;
  }

  deleteFlight(flight: any) {
    if (!flight || !flight.id) {
      console.error('Invalid flight object passed for deletion');
      return;
    }
    this.http.delete(`http://localhost:3000/flights/${flight.id}`).subscribe({
      next: () => {
        alert('Flight deleted successfully!');
        this.fetchFlights();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Failed to delete flight', err);
        alert('Error deleting flight!');
      }
    });
  }

  editFlight(flight: any) {
    this.newFlight = { ...flight };
    this.showEditFlightForm = true;
    this.showAddFlightForm = false;
    this.showDeleteFlightForm = false;
  }

  onFlightIdBlur() {
    const flight = this.flights.find(f => f.id === this.newFlight.id);
    if (flight) {
      this.newFlight = { ...flight };
    } else {
      alert('Flight ID not found!');
    }
  }

  resetNewFlightForm() {
    this.newFlight = {
      id: '',
      from: '',
      to: '',
      departureDate: '',
      price: '',
      airline: '',
      totalSeats: '',
      fromTime: '',
      toTime: '',
      duration: '',
    };
  }

  resetDeleteForm() {
    this.deleteFlightId = '';
  }

  resetEditForm() {
    this.newFlight = {
      id: '',
      from: '',
      to: '',
      departureDate: '',
      price: '',
      airline: '',
      totalSeats: '',
      fromTime: '',
      toTime: '',
      duration: '',
    };
  }
}