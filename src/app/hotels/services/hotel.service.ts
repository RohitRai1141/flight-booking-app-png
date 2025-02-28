//hotel.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject} from 'rxjs';
import { Hotel } from '../models/hotel.model';

import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root',
})

export class HotelService {
  private apiUrl = 'http://localhost:3000/hotels';

constructor(private http: HttpClient) {}
 // BehaviorSubject to store search details
 private searchDetailsSource = new BehaviorSubject<any>(null);
 private selectedHotelSource = new BehaviorSubject<Hotel | null>(null);
 private selectedRoomSource = new BehaviorSubject<any>(null);

  /*** Search Hotel Component ***/

// Save search details
  setSearchDetails(details: any): void {
    this.searchDetailsSource.next(details);
  }

// Get search details
 getSearchDetails(): Observable<any> {
  return this.searchDetailsSource.asObservable();
}

// get all hotels
getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }


  /*** Hotel Results Component ***/

  filterHotels(hotels: Hotel[], filters: { price: number; minPrice: number; amenities: string[] }): Hotel[] {
    return hotels.filter((hotel) => {
      const matchesMaxPrice = filters.price ? hotel.price <= filters.price : true;
      const matchesMinPrice = filters.minPrice ? hotel.price >= filters.minPrice : true;
      const matchesAmenities = filters.amenities.length
        ? filters.amenities.every((amenity) => hotel['amenities'].includes(amenity))
        : true;

      return matchesMaxPrice && matchesMinPrice && matchesAmenities;
    });
  }


/*** Hotel Details Component ***/

// Save selected hotel
setSelectedHotel(hotel: Hotel): void {
  this.selectedHotelSource.next(hotel);
}
getSelectedHotel(): Observable<Hotel | null> {
  return this.selectedHotelSource.asObservable();
}
getHotelById(id: number): Observable<Hotel> {
  return this.http.get<Hotel>(`${this.apiUrl}/${id}`);
}
 /*** Hotel Booking Component ***/
 // Save selected room
 setSelectedRoom(room: any): void {
  this.selectedRoomSource.next(room);
}

// Get selected room
getSelectedRoom(): Observable<any> {
  return this.selectedRoomSource.asObservable();
}

// Booking method to save booking data
bookHotel(bookingData: any): Observable<any> {
  const url = `http://localhost:3000/hotelbookings`; // Booking endpoint in db.json
  return this.http.post<any>(url, bookingData);
}


getBookings(): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:3000/hotelbookings`);
}

cancelBooking(id: string, updatedBooking: any): Observable<any> {
  const url = `http://localhost:3000/hotelbookings/${id}`;
  return this.http.put(url, updatedBooking);
}

addReviewToHotel(hotelId: string, review: any): Observable<any> {
  const url = `${this.apiUrl}/${hotelId}`;
  return this.http.get<Hotel>(url).pipe(
    switchMap((hotel) => {
      const updatedReviews = hotel.reviews ? [...hotel.reviews, review] : [review];
      const updatedHotel = { ...hotel, reviews: updatedReviews };
      return this.http.put<any>(url, updatedHotel);
    })
  );
}


updateBookingStatus(booking: any): Observable<any> {
  const url = `http://localhost:3000/hotelbookings/${booking.id}`;
  return this.http.put(url, booking); // Updates the booking status
}


getRoomTypesByHotelId(hotelId: string): Observable<any[]> {
  return this.http.get<any>(`${this.apiUrl}/${hotelId}`).pipe(
    map((hotel) => hotel.rooms || []) // Extract room types or return an empty array
  );
}

getSpecialOffersByHotelId(hotelId: string): Observable<any[]> {
  return this.http.get<any>(`${this.apiUrl}/${hotelId}`).pipe(
    map((hotel) => hotel.specialOffers || []) // Extract special offers or return an empty array
  );
}
 
editBooking(booking: any): Observable<any> {
  const url = `http://localhost:3000/hotelbookings/${booking.id}`;
  return this.http.put<any>(url, booking);
}



// ----------------------------ADMIN SERVICES-------------------------------------
deleteHotel(id: string): Observable<void> {
  return this.http.delete<void>(`http://localhost:3000/hotels/${id}`);
}


//-------------------------------SERVICE PROVIDER SERVICES------------------------------
getHotelByhspId(hspId: string): Observable<any> {
  return this.http.get<Hotel[]>(`http://localhost:3000/hotels`).pipe(
    map(hotels => hotels.find(hotel => hotel.hspid === hspId)) // This filters the hotels and finds the one with the matching hspid
  );
}

getHotelIdByhspId(hspId: string): Observable<string | null> {
  return this.http.get<any[]>(this.apiUrl).pipe(
    map(hotels => {
      const hotel = hotels.find(hotel => hotel.hspid === hspId);
      return hotel ? hotel.id : null;
    })
  );
}

}
