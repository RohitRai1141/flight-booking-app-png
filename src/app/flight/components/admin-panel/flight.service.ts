import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private flightsSubject = new BehaviorSubject<any[]>([]);
  flights$ = this.flightsSubject.asObservable();

  private apiUrl = 'http://localhost:3000/flights';

  constructor(private http: HttpClient) {
    this.fetchFlights();
  }

  // Fetch flights from the server
  fetchFlights() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        this.flightsSubject.next(data.flights || []);
      },
      error: (err) => {
        console.error('Failed to fetch flights', err);
      },
    });
  }

  // Add a new flight
  addFlight(flight: any) {
    return this.http.post(this.apiUrl, flight).subscribe({
      next: () => {
        this.fetchFlights();
      },
      error: (err) => {
        console.error('Failed to add flight', err);
      },
    });
  }

  // Update an existing flight
  updateFlight(id: string, flight: any) {
    return this.http.put(`${this.apiUrl}/${id}`, flight).subscribe({
      next: () => {
        this.fetchFlights();
      },
      error: (err) => {
        console.error('Failed to update flight', err);
      },
    });
  }

  // Delete a flight
  deleteFlight(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.fetchFlights();
      },
      error: (err) => {
        console.error('Failed to delete flight', err);
      },
    });
  }
}
