import { Component, OnInit } from '@angular/core';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-passenger-list',
  standalone: true,
  templateUrl: './passenger-list.component.html',
  styleUrls: ['./passenger-list.component.css'],
})
export class PassengerListComponent implements OnInit {
  passengers: any[] = []; // Replace `any` with the passenger interface if available
  filteredPassengers: any[] = [];
  flightId: string = '';
  searchQuery: string = '';

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadPassengers();
  }

  loadPassengers(): void {
    this.flightService.getUserData().subscribe({
      next: (data) => {
        this.passengers = data.map((record) => ({
          ...record,
          flightId: record.flight?.id || 'N/A',
        }));
        this.filteredPassengers = [...this.passengers];
      },
      error: (err) => console.error('Failed to load passengers:', err),
    });
  }

  filterPassengers(): void {
    this.filteredPassengers = this.passengers.filter((passenger) => {
      const matchesFlight =
        this.flightId === '' || passenger.flightId === this.flightId;
      const matchesQuery =
        this.searchQuery === '' ||
        `${passenger.firstName} ${passenger.lastName}`
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
      return matchesFlight && matchesQuery;
    });
  }
}
