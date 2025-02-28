import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router
import { HotelService } from '../../services/hotel.service';
import { FormsModule} from '@angular/forms'; // Import FormsModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHotel, faMapMarkerAlt, faCalendarCheck, faCalendarMinus, faBed, faCircle, faMoneyBill, faCloudMoon, faUsers, faBars, faClipboardList, faHome, faArrowLeft, faArrowRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { AdminNavigationComponent } from '../admin-navigation/admin-navigation.component';
import { Booking, Room, specialOffers } from '../../models/hotel.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule,  FormsModule, FontAwesomeModule, AdminNavigationComponent],
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  currentBookings: Booking[] = [];
  pastBookings: Booking[] = [];
  availableRooms: Room[] = []; 
  specialOffers: specialOffers[] = [];

  //userid of logged in user
  userid: string = "USER001";


  //icons
  faHotel = faHotel;
  faMapMarkerAlt = faMapMarkerAlt;
  faCalendarCheck = faCalendarCheck;
  faCalendarMinus = faCalendarMinus;
  faBed = faBed;
  faCircle = faCircle;
  faMoneyBill = faMoneyBill;
  faCloudMoon = faCloudMoon;
  faUsers = faUsers;
  faBars = faBars;
  faClipboardList = faClipboardList;
  faHome = faHome;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  
   selectedBooking: Booking = {} as Booking;
  
   
   editForm : Booking = {} as Booking;
  
    rebookForm = {
    id: '',
    hotelName: '',
    location: '',
    name: '',
    age: 0,
    gender: '',
    email: '',
    phone: '',
    guests: [] as { name: string; age: number; gender: string }[],
    roomType: '',
    roomPrice: 0,
    noOfrooms: 1,
    stayDuration: 0,
    noOfGuests: 1,
    totalPrice: 0,
    totalPayable: 0,
    checkIn: '',
    checkOut: '',
    status: 'booked',
    offer: 0,
    netPrice: 0
  };
  

  minCheckInDate: string;


  constructor(private hotelService: HotelService, private router: Router) 
  {
    const today = new Date();
    this.minCheckInDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.fetchBookings();
    
  }

  
  //--------------------------Other functions section-------------------------------------------------

  
  fetchBookings(): void {
    this.hotelService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.segregateBookings();
        this.updateCurrentPagination();
        this.updatePastPagination();
      },
      error: (err) => console.error('Error fetching bookings:', err)
    });

  }




  segregateBookings(): void {
    const today = new Date();
  
    // Filter for current bookings
    this.currentBookings = this.bookings.filter((booking) => {
      const checkOutDate = new Date(booking.checkOut);
      return (
        booking.status === 'booked' && // Status is 'booked'
        checkOutDate >= today // Check-out is in the future or today
      );
    });
  
    // Filter for past bookings and update status
    this.pastBookings = this.bookings.filter((booking) => {
      const checkOutDate = new Date(booking.checkOut);
      const isPast = checkOutDate < today;
  
      if (isPast && booking.status !== 'cancelled' && booking.status !== 'visited') {
        const updatedBooking = { ...booking, status: 'visited' };
        this.hotelService.updateBookingStatus(updatedBooking).subscribe({
          next: () => {
            console.log(`Booking ${booking.id} updated to 'visited'.`);
          },
          error: (err) => console.error('Error updating past booking status:', err),
        });
      }
  
      return booking.status === 'visited' || booking.status === 'cancelled' || isPast;
    });
  }
  
  

  updatePastBookingStatus(): void {
    const today = new Date();
  
    this.pastBookings.forEach((booking: Booking) => {
      if (booking.status !== 'cancelled') {
        const checkOutDate = new Date(booking.checkOut);
        if (checkOutDate < today && booking.status !== 'visited') {
          const updatedBooking = { ...booking, status: 'visited' };
          this.hotelService.updateBookingStatus(updatedBooking).subscribe();
        }
      }
    });
  }
  
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'booked':
        return 'green'; // Active bookings
      case 'visited':
        return 'blue'; // Completed bookings
      case 'cancelled':
        return 'red'; // Cancelled bookings
      default:
        return 'gray'; // Default color for unknown statuses
    }
  }

  private convertToDBDate(date: string): string {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`; // Format: MM/DD/YYYY
  }


  calculateOfferPrice(totalPrice: number, discount: number): number {
    return (totalPrice * discount) / 100; // Calculate offer amount
  }

      //for getting next date for checkout date
      getNextDate(date: string | null): string {
        if (!date) {
          return ''; // Return empty string if date is not provided
        }
        const selectedDate = new Date(date);
        const nextDate = new Date(selectedDate);
        nextDate.setDate(selectedDate.getDate() + 1); // Add one day
        return nextDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
      }

      private formatToDateInput(date: string): string {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
      }
      
      
  
//--------------------------other functions section-------------------------------------------------



//--------------------------Cancel section-------------------------------------------------
  
  // Cancel Popup State
showCancelPopup = false;

// Open Cancel Popup
openCancelPopup(booking: Booking): void {
  this.selectedBooking = booking;
  this.showCancelPopup = true;
}

// Close Cancel Popup
closeCancelPopup(): void {
  this.showCancelPopup = false;
}

// Confirm Cancellation
confirmCancellation(): void {
  if (!this.selectedBooking) {
    console.error('No booking selected for cancellation.');
    return;
  }

  const updatedBooking = { ...this.selectedBooking, status: 'cancelled' };

  this.hotelService.updateBookingStatus(updatedBooking).subscribe({
    next: () => {
      this.fetchBookings(); // Refresh bookings to reflect updated status
      this.showCancelPopup = false; // Close the confirmation popup
      this.showCancelSuccessPopup = true; // Show success popup
    },
    error: (err) => console.error('Error cancelling booking:', err),
  });
}


showCancelSuccessPopup = false;

closeCancelSuccessPopup(): void {
  this.showCancelSuccessPopup = false;
}
  

  cancelBooking(id: string): void {
    const bookingToCancel = this.currentBookings.find((b) => b.id === id);
    if (!bookingToCancel) {
      console.error('Booking not found for cancellation.');
      return;
    }
  
    const updatedBooking = { ...bookingToCancel, status: 'cancelled' };
  
    this.hotelService.cancelBooking(id, updatedBooking).subscribe({
      next: () => {
        this.fetchBookings(); // Refresh bookings after cancellation
      },
      error: (err) => console.error('Error cancelling booking:', err)
    });
  }

  //--------------------------Cancel section-------------------------------------------------
  



  //--------------------------details section-------------------------------------------------

  // details
  showDetailsPopup = false;
  openDetailsPopup(booking: any): void {
    this.selectedBooking = booking;
    this.showDetailsPopup = true;
  }

  closeDetailsPopup(): void {
    this.showDetailsPopup = false;
  }

//--------------------------details section-------------------------------------------------


  //--------------------------Edit section-------------------------------------------------
  showEditPopup = false;
 openEditPopup(booking: Booking): void {
  this.editForm = booking;

  this.editForm = {
    ...booking,
    checkIn: this.formatToDateInput(booking.checkIn), // Convert to YYYY-MM-DD
    checkOut: this.formatToDateInput(booking.checkOut), // Convert to YYYY-MM-DD
  };

  this.hotelService.getSpecialOffersByHotelId(booking.hotelid).subscribe({
    next: (offers) => {
      this.specialOffers = offers;
    },
    error: (err) => console.error('Error fetching special offers:', err),
  })

  this.hotelService.getRoomTypesByHotelId(booking.hotelid).subscribe({
    next: (rooms) => {
      this.availableRooms = rooms;
      this.showEditPopup = true;
    },
    error: (err) => console.error('Error fetching room types:', err),
  });
}


addGuest(): void {
  if (!this.editForm.guests) {
    this.editForm.guests = [];
  }
  this.editForm.guests.push({ name: '', age: 0, gender: '' });
}

removeGuest(index: number): void {
  if (this.editForm.guests && this.editForm.guests.length > index) {
    this.editForm.guests.splice(index, 1);
  }
}


closeEditPopup(): void {
  this.showEditPopup = false;
}

submitEditForm(): void {
  const checkIn = new Date(this.editForm.checkIn);
  const checkOut = new Date(this.editForm.checkOut);
  const stayDuration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const room = this.availableRooms.find((r) => r.type === this.editForm.roomType);

  if (stayDuration > 0 && room) {
    this.editForm.stayDuration = stayDuration;
    const totalPrice = room.price * stayDuration;

    // Check for offer
    const specialOffer = this.specialOffers?.[0]; // Assuming specialOffers array exists
    const offerApplied = specialOffer ? this.calculateOfferPrice(totalPrice, specialOffer.discount) : 0;

    this.editForm.totalPrice = totalPrice; // Store the total price
    this.editForm.offer = offerApplied; // Store the offer amount
    this.editForm.netPrice = totalPrice - offerApplied; // Calculate net price
    this.editForm.totalPayable = this.editForm.netPrice + this.editForm.netPrice * 0.18; // Add 18% GST
  }

  const totalGuests = this.editForm.guests?.length + 1 || 0;
  this.editForm.noOfGuests = totalGuests;

  // Format dates for DB
  this.editForm.checkIn = this.convertToDBDate(this.editForm.checkIn);
  this.editForm.checkOut = this.convertToDBDate(this.editForm.checkOut);

  this.hotelService.editBooking(this.editForm).subscribe({
    next: () => {
      this.fetchBookings();
      this.showUpdateSuccessPopup = true;
      this.closeEditPopup();
    },
    error: (err) => {
      console.error('Error updating booking:', err);
      alert('Failed to update booking. Please try again.');
    },
  });
}



showUpdateSuccessPopup = false;

closeUpdateSuccessPopup(): void {
  this.showUpdateSuccessPopup = false;
}

//--------------------------Edit section-------------------------------------------------



//--------------------------rebook section-------------------------------------------------
showRebookPopup = false;
openRebookPopup(booking: Booking): void {

  this.rebookForm = {
    ...booking,
    id: Math.random().toString(36).substring(2, 9),
    checkIn: '', 
    checkOut: '', 
  };
  
  this.hotelService.getRoomTypesByHotelId(booking.hotelid).subscribe({
    next: (rooms) => {
      this.availableRooms = rooms; // Store available rooms
      this.rebookForm.roomType = rooms[0]?.type; // Set default room type if available
      this.showRebookPopup = true; // Show the rebook popup
    },
    error: (err) => console.error('Error fetching room types:', err),
  });
}


closeRebookPopup(): void {
  this.showRebookPopup = false;
}


removeRebookGuest(index: number): void {
  this.rebookForm.guests.splice(index, 1);
}

addRebookGuest(): void {
  this.rebookForm.guests.push({ name: '', age: 0, gender: '' });
}


submitRebookForm(): void {
  const checkIn = new Date(this.rebookForm.checkIn);
  const checkOut = new Date(this.rebookForm.checkOut);
  const stayDuration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const room = this.availableRooms.find((r) => r.type === this.rebookForm.roomType);

  if (stayDuration > 0 && room) 
  {
    this.rebookForm.stayDuration = stayDuration;
    const totalPrice = room.price * stayDuration;

    // Check for offer
    const specialOffer = this.specialOffers?.[0]; // Assuming specialOffers array exists
    const offerApplied = specialOffer ? this.calculateOfferPrice(totalPrice, specialOffer.discount) : 0;

    this.rebookForm.totalPrice = totalPrice; // Store the total price
    this.rebookForm.offer = offerApplied; // Store the offer amount
    this.rebookForm.netPrice = totalPrice - offerApplied; // Calculate net price
    this.rebookForm.totalPayable = this.rebookForm.netPrice + this.rebookForm.netPrice * 0.18; // Add 18% GST
  }

  const totalGuests = this.rebookForm.guests?.length + 1 || 0;
  this.rebookForm.noOfGuests = totalGuests;

  // Format dates for DB
  this.rebookForm.checkIn = this.convertToDBDate(this.rebookForm.checkIn);
  this.rebookForm.checkOut = this.convertToDBDate(this.rebookForm.checkOut);
  this.rebookForm.status = 'booked';

  this.hotelService.bookHotel(this.rebookForm).subscribe({
    next: () => {
      this.fetchBookings();
      this.showRebookingSuccessPopup = true;
      this.closeRebookPopup();
    },
    error: (err) => {
      console.error('Error during rebooking:', err);
      alert('Rebooking failed. Please try again.');
    },
  });
}

showRebookingSuccessPopup = false;

closeRebookingSuccessPopup(): void {
  this.showRebookingSuccessPopup = false;
}

//--------------------------rebook section-------------------------------------------------


//--------------------------toggle section-------------------------------------------------
    isMenuOpen = false; // To track the toggle state


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen; // Toggle the menu state
  }

  navigateToHome(): void {
    this.router.navigate(['/hotels']); // Navigate to home
    this.isMenuOpen = false; // Close the menu after navigation
  }

  navigateToMyBookings(): void {
    this.router.navigate(['/hotels/my-bookings']); // Navigate to my bookings page
    this.isMenuOpen = false; // Close the menu after navigation
  }

  //--------------------------toggle section-------------------------------------------------


  // ---------------------------Pagination--------------------------------------------------

  // for current bookings
  
  displayedCurrentBookings: Booking[] = [];
  currentRowsPerPageOptions: number[] = [3, 6, 9, 12];
  currentRowsPerPage: number = 3;
  currentCurrentPage: number = 1;
  currentTotalPages: number = 1;
  
  updateCurrentPagination(): void {
    const startIndex = (this.currentCurrentPage - 1) * this.currentRowsPerPage;
    const endIndex = startIndex + this.currentRowsPerPage;
    this.displayedCurrentBookings = this.currentBookings.slice(startIndex, endIndex);
    this.currentTotalPages = Math.ceil(this.currentBookings.length / this.currentRowsPerPage);
    
  }
  
    changeCurrentRowsPerPage(event: any): void {
      this.currentRowsPerPage = +event.target.value;
      this.currentCurrentPage = 1; // Reset to first page
      this.updateCurrentPagination();
    }
  
    goToCurrentPreviousPage(): void {
      if (this.currentCurrentPage > 1) {
        this.currentCurrentPage--;
        this.updateCurrentPagination();
      }
    }
  
    goToCurrentNextPage(): void {
      if (this.currentCurrentPage < this.currentTotalPages) {
        this.currentCurrentPage++;
        this.updateCurrentPagination();
      }
    }

    // for past bookings

    displayedPastBookings: Booking[] = [];
    pastRowsPerPageOptions: number[] = [3, 6, 9, 12];
    pastRowsPerPage: number = 3;
    pastCurrentPage: number = 1;
    pastTotalPages: number = 1;

    updatePastPagination(): void {
      const startIndex = (this.pastCurrentPage - 1) * this.pastRowsPerPage;
      const endIndex = startIndex + this.pastRowsPerPage;
      this.displayedPastBookings = this.pastBookings.slice(startIndex, endIndex);
      this.pastTotalPages = Math.ceil(this.pastBookings.length / this.pastRowsPerPage);
    }
  
    changePastRowsPerPage(event: any): void {
      this.pastRowsPerPage = +event.target.value;
      this.pastCurrentPage = 1; // Reset to first page
      this.updatePastPagination();
    }
  
    goToPastPreviousPage(): void {
      if (this.pastCurrentPage > 1) {
        this.pastCurrentPage--;
        this.updatePastPagination();
      }
    }
  
    goToPastNextPage(): void {
      if (this.pastCurrentPage < this.pastTotalPages) {
        this.pastCurrentPage++;
        this.updatePastPagination();
      }
    }

  // ---------------------------Pagination--------------------------------------------------
  
  

}