import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMapMarkerAlt, faCircle, faMoneyBill, faStar, faTag } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotel-results',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, FormsModule],
  templateUrl: './admin-hotels.component.html',
  styleUrls: ['./admin-hotels.component.css'],
})
export class AdminHotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  faMapMarkerAlt = faMapMarkerAlt;
  faCircle = faCircle;
  faMoneyBill = faMoneyBill;
  faStar = faStar;
  faTag = faTag;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.hotelService.getHotels().subscribe((data) => {
      this.hotels = data;

      this.updatePagination();
    });
  }

  viewDetails(hotel: Hotel): void {
    this.hotelService.setSelectedHotel(hotel);
    // Navigate to details page or open details popup
  }

  updateHotel(hotel: Hotel): void {
    // Logic for updating hotel (show a form or navigate to update page)
  }

  deleteHotel(hotelId: string): void {
    if (confirm('Are you sure you want to delete this hotel?')) {
      this.hotelService.deleteHotel(hotelId).subscribe(() => {
        this.hotels = this.hotels.filter((hotel) => hotel.id !== hotelId);
      });
    }
  }




//   Pagination code
displayedHotels: Hotel[] = [];
rowsPerPageOptions: number[] = [5, 10, 15];
rowsPerPage: number = 5;
currentPage: number = 1;
totalPages: number = 1;

updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.displayedHotels = this.hotels.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.hotels.length / this.rowsPerPage);
  }

  changeRowsPerPage(event: any): void {
    this.rowsPerPage = +event.target.value;
    this.currentPage = 1; // Reset to first page
    this.updatePagination();
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

}

