import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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

export interface SeatForBackend {
  id: string;
  status: 'available' | 'selected' | 'booked';
}

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = 'http://localhost:3000/flights';
  private seatsApiUrl = 'http://localhost:3000/seats'; // Changed to match JSON server endpoint
  private userApiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private router: Router) {}

  navigateToRoute(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }

  getFlightById(id: string): Observable<Flight> {
    return this.http.get<Flight>(`${this.apiUrl}/${id}`);
  }

  saveUserData(userData: any): Observable<any> {
    return this.http.post(this.userApiUrl, userData);
  }

  saveSeats(payload: { seats: SeatForBackend[] }): Observable<any> {
    return this.http.post(this.seatsApiUrl, payload); // Ensure this endpoint handles seat updates
  }

  getSeats(): Observable<any> {
    return this.http.get(`${this.seatsApiUrl}`); // Fetch seats data
  }

  saveUserSeats(userSeats: any): Observable<any> {
    return this.http.post(this.userApiUrl, userSeats);
  }

  getUserData(): Observable<any[]> {
    return this.http.get<any[]>(this.userApiUrl);
  }

  // Add this to your FlightService class
  updateAllUsers(users: any[]): Observable<any> {
    return this.http.put(this.userApiUrl, users);
  }

  updateSeats(flightSeatsId: string, seats: any[]): Observable<any> {
    return this.http.patch(`${this.seatsApiUrl}/${flightSeatsId}`, { seats });
  }
  
  updateUserStatus(userId: number | null, userData: any): Observable<any> {
    if (userId === null) {
      throw new Error('User ID cannot be null');
    }
    return this.http.put(`${this.userApiUrl}/${userId}`, userData);
  }
}
