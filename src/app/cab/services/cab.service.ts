import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, cabs, Booking } from '../models/cab-entities';

@Injectable({
  providedIn: 'root',
})
export class CabService {
  private apiUrl = 'http://localhost:3000/cabs'; // Mock API for cabs
  private faqsApiUrl = 'http://localhost:3000/faqs'; // Mock API for FAQs
  private bookingApiUrl = 'http://localhost:3000/cabbookings'; // Mock API for bookings
  private reviewUrl = 'http://localhost:3000/reviews'; // Mock API for reviews

  constructor(private http: HttpClient) {}

  /** -------------------- CAB MANAGEMENT -------------------- **/ 

  // Get all cabs
  getCabs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get cab by ID
  getCabById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?id=${id}`);
  }

  // Get cabs by agency ID
  getCabsByAgency(agencyId: string): Observable<cabs[]> {
    return this.http.get<cabs[]>(`${this.apiUrl}?agencyId=${agencyId}`);
  }

  /** -------------------- FAQ MANAGEMENT -------------------- **/

  // Get all FAQs
  getFAQs(): Observable<any[]> {
    return this.http.get<any[]>(this.faqsApiUrl);
  }

  /** -------------------- BOOKING MANAGEMENT -------------------- **/

  // Save booking data to db.json
  saveUserData(data: { cab: any; users: User[] }): Observable<any> {
    return this.http.post(this.bookingApiUrl, data);
  }

  // Get all bookings
  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(this.bookingApiUrl);
  }

  // Get booking by ID
  getBookingById(id: string): Observable<any> {
    return this.http.get(`${this.bookingApiUrl}/${id}`);
  }


  // Update booking
  updateBooking(booking: any, bookingId: string): Observable<any> {
    return this.http.put(`${this.bookingApiUrl}/${bookingId}`, booking);
  }

  // Update booking status
  updateBookingStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.bookingApiUrl}/${id}`, { status });
  }

  // Delete booking
  deleteBooking(bookingId: string): Observable<any> {
    return this.http.delete<any>(`${this.bookingApiUrl}/${bookingId}`);
  }

  /** -------------------- REVIEW MANAGEMENT -------------------- **/

  // Get all reviews
  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(this.reviewUrl);
  }

  // Add a new review
  addReview(review: any): Observable<any> {
    return this.http.post<any>(this.reviewUrl, review);
  }
}
