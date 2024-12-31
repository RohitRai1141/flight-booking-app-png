import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Flight {
  id: string;
  from: string;
  to: string;
  departureDate: string;
  fromTime: string;
  toTime: string;
  duration: string;
  price: number;
  airline: string;
  totalSeats: number;
  availableSeats: string[];
  unavailableSeats: string[];
}

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = 'http://localhost:3000/flights';
  private userApiUrl = 'http://localhost:3000/users'; // Endpoint for saving user data

  constructor(private http: HttpClient) {}

  // Fetch flight data
  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }

  // Save user data to users.json
  saveUserData(userData: any): Observable<any> {
    return this.http.post(this.userApiUrl, userData);
  }
}
