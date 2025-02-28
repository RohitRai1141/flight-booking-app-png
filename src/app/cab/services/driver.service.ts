import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { drivers, ChatMessage } from '../models/cab-entities';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /** ----------------------------- DRIVER MANAGEMENT ----------------------------- **/

  // Fetch all drivers
  getDrivers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers`);
  }

  // Fetch cab details by cab ID
  getCabDetails(cabId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cabs/${cabId}`);  
  }

  /** ----------------------------- CHAT MANAGEMENT ----------------------------- **/

   
 // Fetch chat messages for a specific driver (from the driver's `chats` array)
 getMessageHistory(driverId: string): Observable<ChatMessage[]> {
  return this.http.get<drivers>(`${this.apiUrl}/drivers/${driverId}`) 
    .pipe(map(driver => driver.chats));  
}

// Send a new message in the chat (update the driver's `chats` array)
sendMessage(driverId: string, message: ChatMessage): Observable<any> {
  return this.http.get<drivers>(`${this.apiUrl}/drivers/${driverId}`)
    .pipe(
      switchMap(driver => {
        const updatedChats = [...driver.chats, message];  
        return this.http.put(`${this.apiUrl}/drivers/${driverId}`, { ...driver, chats: updatedChats });  
      })
    );
}


  // Update chat messages (used if updating an existing conversation)
  updateMessageHistory(driverId: string, updatedMessages: ChatMessage[]): Observable<any> {
    return this.http.get<drivers>(`${this.apiUrl}/drivers/${driverId}`)
      .pipe(
        switchMap(driver => {
          return this.http.put(`${this.apiUrl}/drivers/${driverId}`, { ...driver, chats: updatedMessages });
        })
      );
  }
}
