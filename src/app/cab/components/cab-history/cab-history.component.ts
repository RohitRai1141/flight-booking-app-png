import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CabService } from '../../services/cab.service';  
import { HttpClient } from '@angular/common/http';
import { Booking } from '../../models/cab-entities';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { ChangeDetectorRef } from '@angular/core';
 

@Component({
    selector: 'cab-booking-history',
    templateUrl: './cab-history.component.html',
    styleUrls: ['./cab-history.component.css'],
    standalone: true, 
    imports:[CommonModule,FormsModule],
    providers: [CabService]
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];
  minDate: string;
  maxDate: string;
  dropdownOptions: string[] = [];
  dropdownOpen: boolean = false;
  isFabMenuOpen = false;
  currentBookings: any = {};
  pastBookings: any[] = [];
  isEditPopupOpen = false;
  currentBooking: any = {};
  isReviewPopupOpen = false;
  locationError = false;
  searchQuery: string = '';
  filteredBookings = [...this.bookings];
  statusFilter: string = '';  
  review = { comment: '', rating:0 };
  reviews: any[] = []; 
  isRebookPopupOpen = false;
rebookDetails: any = {};

  openEditPopup(booking: any) {
    // this.currentBooking = { ...booking.users?.[0] }; 
    this.currentBooking = { ...booking}; 
   console.log(this.currentBooking) 
    this.isEditPopupOpen = true;
    this.locationError = false; 
  }

  closeEditPopup() {
    this.isEditPopupOpen = false;
    this.currentBooking = {}; 
  }

  constructor(
    private router: Router,
    private cabService: CabService,
    private cdr: ChangeDetectorRef
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];  
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 20);  
    this.maxDate = maxDate.toISOString().split('T')[0];
  }


   
  // Validate if the drop location and location are the same
  validateLocations() {
    if (this.currentBooking.cab[0].dropLocation.trim().toLowerCase() === this.currentBooking.cab[0].location.trim().toLowerCase()) {
      this.locationError = true;
    } else {
      this.locationError = false;
    }
  }

  ngOnInit() {
    this.getBookings()
    this.getReviews();
  this.cabService.getBookings().subscribe(
    (response: Booking[]) => {
      this.bookings = response.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.filteredBookings = [...this.bookings];  
    },
    (error) => {
      console.error('Error fetching booking data:', error);
    }
  );
  }
  
   

  // Fetch reviews from the service
  getReviews() {
    this.cabService.getReviews().subscribe(
      (reviews) => {
        this.reviews = reviews;  // Store fetched reviews in the reviews array
        console.log('Fetched reviews:', this.reviews);  
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }
   // Open review popup for a specific booking
openReviewPopup(booking: Booking): void {
  // Store the selected booking for review
  this.currentBooking = booking;
  
   
  this.isReviewPopupOpen = true;

   
  this.review = { comment: '', rating: 0 };
  
  console.log("Opening review popup for booking:", this.currentBooking);
}


  // Close review popup
  closeReviewPopup() {
    this.isReviewPopupOpen = false;
  }

  setRating(star: number) {
    this.review.rating = star;
  }

   // Submit the review
   submitReview() {
    if (this.review.comment && this.review.rating) {
      // Prepare the review data
      const reviewData = {
        bookingId: this.currentBooking.id,   
        rating: this.review.rating,
        comment: this.review.comment,
        date: new Date().toISOString()   
      };
  
      // Call the addReview method from the service to post data to the server
      this.cabService.addReview(reviewData).subscribe(
        (response) => {
          console.log('Review Submitted:', response);
           
          this.closeReviewPopup();
        },
        (error) => {
          console.error('Error submitting review:', error);
        }
      );
    }
  }

  
  
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
  toggleFabMenu(): void {
    this.isFabMenuOpen = !this.isFabMenuOpen;
  }

   
  updateBookingDetails(): void {
    if (this.currentBooking) {
      console.log('Saving booking:', this.currentBooking);
  
      const userId = this.currentBooking.id;  
      
      // const bookingIndex = this.bookings.findIndex((booking) =>
      //   booking.some((user: any) => user.id === userId)
      // );

      const bookingIndex = this.currentBooking.users.find((user: any) => user.id === userId);
       
      if (bookingIndex !== -1) {
        
        // this.bookings[bookingIndex].users = this.bookings[bookingIndex].users.map(
        //   (user: any) =>
        //     user.id === userId ? { ...user, ...this.currentBooking } : user
        // );
  
        console.log('Updated bookings:', this.bookings);
  
        this.validateLocations();
           if (this.locationError) {
             return;  
            }


        this.cabService.updateBooking(this.currentBooking,this.currentBooking.id).subscribe(
          (response) => {
            console.log('Booking updated successfully in DB:', response);
  
            
            this.cdr.detectChanges();
  
            
            this.closeEditPopup();
          },
          (error) => {
            console.error('Error updating booking in DB:', error);
          }
        );
      } else {
        console.error('Booking or user not found.');
      }
    } else {
      console.error('No booking details available to save.');
    }
  }
  

   
  getBookings() {
    this.cabService.getBookings().subscribe(
      (response: Booking[]) => {
         
        this.bookings = response.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        console.log('Bookings with cab details:', this.bookings);
  
        // Process cab details for each booking
        this.bookings.forEach((booking) => {
          if (booking.cab && booking.cab.length > 0) {
            console.log(`Cabs for Booking ID ${booking.id}:`, booking.cab);
          } else {
            console.log(`No cabs available for Booking ID ${booking.id}`);
          }
        });
      },
      (error) => {
        console.error('Error fetching booking data:', error);
      }
    );
  }
   

   
  getStatusClass(bookingDate: string, status: string): string {
    if (status === 'Cancelled') {
      return 'Cancelled';
    } else if (this.isPastBooking(bookingDate)) {
      return 'Completed';
    } else {
      return 'Upcoming';
    }
  }

  isPastBooking(bookingDate: string): boolean {
    const today = new Date().setHours(0, 0, 0, 0);  
    const booking = new Date(bookingDate).setHours(0, 0, 0, 0);
    return booking < today;
  }
  
  // Method to filter bookings based on the search query
  filterBookings(): void {
    const query = this.searchQuery.trim().toLowerCase(); // Normalize query
    const status = this.statusFilter; // Get selected status filter
  
    this.filteredBookings = this.bookings.filter((booking) => {
      const locationMatch = booking.cab?.[0]?.location?.toLowerCase().includes(query);
      const statusMatch =
        !status || this.getStatusClass(booking.users?.[0]?.date, booking.status) === status;
  
      return locationMatch && statusMatch;
    });
  }
  

  
  viewDetails(id: number): void {
    this.router.navigate(['/cab/cab-booking', id]);    
  }
   
   
  openRebookPopup(booking: any) {
    if (!booking) {
      console.error("Error: No booking data available for rebooking.");
      return;
    }
  
    this.currentBooking = { ...booking };  
  
    if (!this.currentBooking.users || !Array.isArray(this.currentBooking.users)) {
      console.error("Error: Users data is missing in booking:", this.currentBooking);
      return;
    }
  
    this.rebookDetails = {
      date: '', // Reset new date input
      dropLocation: booking.cab?.[0]?.dropLocation || ''
    };
  
    this.isRebookPopupOpen = true;
  }
  

  closeRebookPopup() {
    this.isRebookPopupOpen = false;
  }
  
  confirmRebooking() {
    if (!this.currentBooking || !this.currentBooking.users || !Array.isArray(this.currentBooking.users)) {
      console.error("Error: currentBooking or users is undefined", this.currentBooking);
      return;
    }
  
    if (!this.rebookDetails.date || !this.rebookDetails.dropLocation) {
      console.error("Error: Missing rebooking details.");
      return;
    }
  
    const updatedBooking = {
      ...this.currentBooking,
      users: this.currentBooking.users.map((user: any) => ({
        ...user,
        date: this.rebookDetails.date,  
      })),
      status: "Upcoming",  
    };
  
    console.log("Rebooking confirmed:", updatedBooking);
  
    // Update the booking in the database (db.json)
    this.cabService.updateBooking(updatedBooking, updatedBooking.id).subscribe(
      (response) => {
        console.log("Booking updated successfully in DB:", response);
  
        // Find and update the booking in the UI
        const index = this.bookings.findIndex((b) => b.id === updatedBooking.id);
        if (index !== -1) {
          this.bookings[index] = updatedBooking;
          this.filterBookings();  
        }
  
        this.isRebookPopupOpen = false;  
      },
      (error) => {
        console.error("Error updating booking in DB:", error);
      }
    );
  }
  
  
  goBack(): void {
    this.router.navigate(['/cab/home']);  
  }
}