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
  private seatsApiUrl = 'http://localhost:3002/seats';
  private userApiUrl = 'http://localhost:3001/users';

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

  saveUserData(userData: any[]): Observable<any> {
    return this.http.post(this.userApiUrl, userData);
  }

  saveSeats(payload: { flightId: string, seats: SeatForBackend[] }): Observable<any> {
    return this.http.post(this.seatsApiUrl, payload);
  }

  getSeats(): Observable<any> {
    return this.http.get(`${this.seatsApiUrl}`);
  }

  getUserData(): Observable<any[]> {
    return this.http.get<any[]>(this.userApiUrl);
  }

  updateAllUsers(users: any[]): Observable<any> {
    return this.http.put(this.userApiUrl, users);
  }
}