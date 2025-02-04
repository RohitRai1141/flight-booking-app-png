import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

   // Fetch all drivers
   getDrivers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers`);
  }

  // Fetch cab details by cab ID
  getCabDetails(cabId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cabs/${cabId}`);  
  }

  

  getMessageHistory(driverId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages?receiverId=${driverId}`);
  }

  sendMessage(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/messages`, message);
  }
}
