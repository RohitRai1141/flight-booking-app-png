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
  imports: [CommonModule, FormsModule, BookingComponent, RouterLink],
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
})
export class FlightComponent {
  flights: Flight[] = FlightsJson.flights;
  CurrentDate: any = new Date();
  filteredFlights: Flight[] = [...this.flights];
  noFlightsFound: boolean = false;
  isSearchExecuted: boolean = false;
  showSuccessMessage: boolean = false;
  showError: boolean = false;
  selectedFlight: Flight | null = null;

  searchCriteria = {
    from: '',
    to: '',
    date: '',
    airline: '',
  };

  validationErrors = {
    from: '',
    to: '',
    date: '',
    airline: '',
  };

  constructor(private router: Router) {}

  validateInputs(): boolean {
    let isValid = true;
    // Reset validation errors
    this.validationErrors = {
      from: '',
      to: '',
      date: '',
      airline: '',
    };

    // From city validation
    if (!this.searchCriteria.from.trim()) {
      this.validationErrors.from = 'Departure city is required.';
      isValid = false;
    }

    // To city validation
    if (!this.searchCriteria.to.trim()) {
      this.validationErrors.to = 'Destination city is required.';
      isValid = false;
    } else if (this.searchCriteria.from.trim().toLowerCase() === this.searchCriteria.to.trim().toLowerCase()) {
      this.validationErrors.to = 'Departure and destination cities cannot be the same.';
      isValid = false;
    }

    // Date validation
    if (!this.searchCriteria.date.trim()) {
      this.validationErrors.date = 'Departure date is required.';
      isValid = false;
    } else {
      const selectedDate = new Date(this.searchCriteria.date);
      const currentDate = new Date();
      
      // Reset time part for date comparison
      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate < currentDate) {
        this.validationErrors.date = 'Invalid departure date. Date cannot be in the past.';
        isValid = false;
      }
    }

    // Airline validation
    if (!this.searchCriteria.airline.trim()) {
      this.validationErrors.airline = 'Airline selection is required.';
      isValid = false;
    }

    return isValid;
  }

  getFilteredFlights(): void {
    this.filteredFlights = this.flights.filter((flight) => {
      const matchesFrom = flight.from
        .toLowerCase()
        .includes(this.searchCriteria.from.toLowerCase());
      const matchesTo = flight.to
        .toLowerCase()
        .includes(this.searchCriteria.to.toLowerCase());
      const matchesAirline = flight.airline
        .toLowerCase()
        .includes(this.searchCriteria.airline.toLowerCase());

      const [day, month, year] = flight.departureDate.split('-');
      const normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0'
      )}`;

      const matchesDate = this.searchCriteria.date
        ? normalizedDate === this.searchCriteria.date
        : true;

      return matchesFrom && matchesTo && matchesAirline && matchesDate;
    });
  }

  onSubmit(): void {
    this.isSearchExecuted = true;
    
    if (this.validateInputs()) {
      this.getFilteredFlights();
      
      if (this.filteredFlights.length > 0) {
        this.showSuccessMessage = true;
        this.showError = false;
      } else {
        this.showSuccessMessage = false;
        this.showError = true;
      }
    } else {
      // Show validation errors
      this.showSuccessMessage = false;
      this.showError = true;
      
      // If there's a date error, show it in the notification
      if (this.validationErrors.date) {
        setTimeout(() => {
          this.validationErrors.date = '';
          if (!this.filteredFlights.length) {
            this.isSearchExecuted = false;
          }
        }, 4000);
      }
    }

    // Clear success/error messages after 4 seconds
    if (this.showSuccessMessage || this.showError) {
      setTimeout(() => {
        this.showSuccessMessage = false;
        this.showError = false;
        if (!this.filteredFlights.length) {
          this.isSearchExecuted = false;
        }
      }, 4000);
    }
  }

  selectFlight(flight: Flight): void {
    this.selectedFlight = flight;
    console.log(flight.id);
    this.router.navigate(['/booking', flight.id]);
  }

  cancelBooking(): void {
    this.selectedFlight = null;
  }
}