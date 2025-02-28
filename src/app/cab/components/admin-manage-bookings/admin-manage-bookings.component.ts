import { Component, OnInit } from '@angular/core';
import { CabService } from '../../services/cab.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Booking, User, cabs } from '../../models/cab-entities';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-manage-booking',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-manage-bookings.component.html',
  styleUrls: ['./admin-manage-bookings.component.css'],
  providers: [CabService],
})
export class AdminManageBookingsComponent implements OnInit {
  // Statistics
  totalBookings = 0;
  totalCancelled = 0;
  totalCompleted = 0;
  totalUpcoming = 0;

  // Data and UI State
  bookings: any[] = [];
  filteredBookings: any[] = [];
  displayedBookings: any[] = [];
  isFabMenuOpen: boolean = false;
  showCancelPopup = false;
  showDetailsPopup = false;
  showEditPopup = false;
  selectedBooking: any = null;

  // Pagination and Search
  searchQuery = '';
  selectedStatus = '';
  error: string | null = null;
  editPickupLocation: string = '';
  editDropLocation: string = '';
  editDate: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  minDate: string;
  maxDate: string;
  showDeletePopup: boolean = false;


  constructor(private cabService: CabService, private router: Router) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];  
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 20);  
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.cabService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.updateDynamicStatuses(); // Ensure statuses are updated
        this.applyFilters();
        this.calculateStatistics();
        this.updatePagination();
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
        this.error = 'Failed to fetch bookings.';
      },
    });
  }

  updateDynamicStatuses(): void {
    const currentDate = new Date();
    this.bookings.forEach((booking) => {
      const bookingDate = new Date(booking.users?.[0]?.date);
      if (booking.status === 'Cancelled') return;
      booking.status = bookingDate < currentDate ? 'Completed' : 'Upcoming';
    });
  }

  calculateStatistics() {
    const currentDate = new Date();

    this.totalBookings = this.bookings.length;
    this.totalCancelled = this.bookings.filter((b) => b.status === 'Cancelled').length;
    this.totalUpcoming = this.bookings.filter(
      (b) => new Date(b.users[0]?.date) > currentDate && b.status !== 'Cancelled'
    ).length;
    this.totalCompleted = this.bookings.filter(
      (b) => new Date(b.users[0]?.date) < currentDate && b.status !== 'Cancelled'
    ).length;
  }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredBookings = this.bookings.filter(
      (booking) =>
        booking.cab?.[0]?.location.toLowerCase().includes(query) &&
        (!this.selectedStatus || booking.status === this.selectedStatus)
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredBookings.length / this.itemsPerPage);
    this.setCurrentPage(1); // Reset to first page after filtering
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedBookings = this.filteredBookings.slice(startIndex, endIndex);
  }

  getPaginationRange(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  toggleFabMenu(): void {
    this.isFabMenuOpen = !this.isFabMenuOpen;
  }

  openEditPopup(booking: any): void {
    this.selectedBooking = { ...booking }; // Clone to prevent direct mutation
    this.editPickupLocation = booking.cab?.[0]?.location || '';
    this.editDropLocation = booking.cab?.[0]?.dropLocation || '';
    this.editDate = booking.users?.[0]?.date || '';
    this.showEditPopup = true;
  }

  closeEditPopup(): void {
    this.showEditPopup = false;
    this.selectedBooking = null;
  }

  

  saveBookingEdits(): void {
    if (this.selectedBooking) {
      this.selectedBooking.cab[0].location = this.editPickupLocation;
      this.selectedBooking.cab[0].dropLocation = this.editDropLocation;
      this.selectedBooking.users[0].date = this.editDate;
   
      this.cabService.updateBooking(this.selectedBooking, this.selectedBooking.id).subscribe({
        next: () => {
          console.log('Booking updated successfully!');
          this.fetchBookings();  
        },
        error: (err) => {
          console.error('Error updating booking:', err);
        },
      });
    }
  
    // Close the edit popup
    this.closeEditPopup();
  }
  

  viewBooking(booking: any): void {
    this.selectedBooking = booking;
    this.showDetailsPopup = true;
  }


  confirmDeleteBooking(): void {
    if (this.selectedBooking) {
      const bookingId = this.selectedBooking.id;
      this.cabService.deleteBooking(bookingId).subscribe({
        next: () => {
          // Remove the deleted booking from the UI
          this.bookings = this.bookings.filter(b => b.id !== bookingId);
          this.filteredBookings = this.filteredBookings.filter(b => b.id !== bookingId);
          this.applyFilters(); // Refresh the UI after deletion
          console.log('Booking deleted successfully.');
          this.showDeletePopup = false; // Close the popup after confirmation
        },
        error: (err) => {
          console.error('Error deleting booking:', err);
          this.showDeletePopup = false; // Close the popup in case of error
        }
      });
    }
  }

    confirmDelete(booking: any): void {
      this.selectedBooking = booking;
      this.showDeletePopup = true;  
     }



      closeDeletePopup(): void {
       this.showDeletePopup = false;  
      }


  closeDetailsPopup(): void {
    this.showDetailsPopup = false;
    this.selectedBooking = null;
  }

  cancelBooking(booking: any): void {
    this.selectedBooking = booking;
    this.showCancelPopup = true;
  }

  closeCancelPopup(): void {
    this.showCancelPopup = false;
    this.selectedBooking = null;
  }

  confirmCancellation(): void {
    if (this.selectedBooking) {
      const bookingId = this.selectedBooking.id;
      this.cabService.updateBookingStatus(bookingId, 'Cancelled').subscribe({
        next: () => {
          this.selectedBooking.status = 'Cancelled';
          this.calculateStatistics();
          this.applyFilters();
          this.showCancelPopup = false;
        },
        error: (err) => {
          console.error('Error updating booking status:', err);
        },
      });
    }
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
}
