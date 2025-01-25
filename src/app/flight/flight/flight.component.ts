import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
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
  imports: [CommonModule, FormsModule, BookingComponent, RouterLink,RouterOutlet],
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
})
export class FlightComponent {
  flights: Flight[] = FlightsJson.flights;
  CurrentDate:any=new Date();
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
    this.validationErrors = {
      from: '',
      to: '',
      date: '',
      airline: '',
    };


    if (!this.searchCriteria.from.trim()) {
      this.validationErrors.from = 'Departure city is required.';
      isValid = false;
    }


    if (!this.searchCriteria.to.trim()) {
      this.validationErrors.to = 'Destination city is required.';
      isValid = false;
    }


    if (!this.searchCriteria.date.trim()) {
      this.validationErrors.date = 'Departure date is required.';
      isValid = false;
    } else {
      const selectedDate = new Date(this.searchCriteria.date);
      const currentDate = new Date();
      // Reset the time to ensure only the date part is compared
      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
  
      if (selectedDate < currentDate) {
        this.validationErrors.date = 'Invalid Departure date.';
        isValid = false;
      }
    }


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


    this.noFlightsFound = this.filteredFlights.length === 0;
    this.showSuccessMessage = !this.noFlightsFound;
    this.showError = this.noFlightsFound;
  }


  onSubmit(): void {
    this.isSearchExecuted = true; // Set the flag when search is executed
    if (this.validateInputs()) {
      this.getFilteredFlights();
    } else {
      this.showSuccessMessage = false;
      this.showError = false;
      console.log('Validation errors:', this.validationErrors);
    }
  }


  selectFlight(flight: Flight): void {
    this.selectedFlight = flight;
    console.log(flight.id)
    this.router.navigate(['/booking',flight.id])
  }


  cancelBooking(): void {
    this.selectedFlight = null;
  }
}