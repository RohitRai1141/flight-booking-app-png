import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, cabs, Booking } from '../models/cab-entities';

@Injectable({
  providedIn: 'root',
})
export class CabService {
  private apiUrl = 'http://localhost:3000/cabs'; // Mock API URLfor cabs
  private faqsApiUrl = 'http://localhost:3000/faqs'; //Mock API for faqs
  private bookingApiUrl = 'http://localhost:3000/cabbookings'; //Mock APi for bookings
  private reviewUrl = 'http://localhost:3000/reviews';

  constructor(private http: HttpClient) {}

  // get all cabs
  getCabs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  // Get cab by id
  getCabById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?id=${id}`);
  }

  // Get all FAQs
  getFAQs(): Observable<any[]> {
    return this.http.get<any[]>(this.faqsApiUrl);
  }
  //Save Booking data to db.json
  saveUserData(data: { cab: any; users: User[] }): Observable<any> {
    return this.http.post(this.bookingApiUrl, data);
  }

  // Get all bookings
  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(this.bookingApiUrl);
  }

  // Get bookings by id
  getBookingById(id: string): Observable<any> {
    return this.http.get(`${this.bookingApiUrl}/${id}`);
  }

  // Method to update booking
  updateBooking(booking: any, bookingId: string): Observable<any> {
    return this.http.put(`${this.bookingApiUrl}/${bookingId}`, booking);
  }

  // Add review
  addReview(review: any): Observable<any> {
    return this.http.post(`${this.reviewUrl}`, review);
  }

  // get review
  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.reviewUrl}`);
  }

  //delete booking
  deleteBooking(bookingId: string): Observable<any> {
    return this.http.delete<any>(`${this.bookingApiUrl}/${bookingId}`);
  }

  updateBookingStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.bookingApiUrl}/${id}`, { status });
  }
}
