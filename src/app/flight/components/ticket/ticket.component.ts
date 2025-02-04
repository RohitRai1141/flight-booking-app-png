import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import jsPDF from 'jspdf';  

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [FormsModule, DatePipe, CommonModule, RouterOutlet],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  users: any[] = [];
  lastUpdatedUser: any = null;
  showAllPassengers: boolean = false;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.flightService.getUserData().subscribe(
      (data) => {
        // Filter users with UID, remove duplicates, and reverse order
        this.users = data
          .filter(user => 
            user.passengers &&
            user.passengers[0] &&
            user.passengers[0].uid
          )
          .filter((user, index, self) =>
            index === self.findIndex((t) => t.id === user.id)
          )
          .reverse();

        // Select the last updated user (latest one)
        if (this.users.length > 0) {
          this.lastUpdatedUser = this.users[0];
        } else {
          console.warn('No users found.');
        }
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  trackUserId(index: number, user: any): number {
    return user.uid;
  }

  togglePassengerDisplay(): void {
    this.showAllPassengers = !this.showAllPassengers;
  }

  generatePDF(): void {
    const doc = new jsPDF();

    if (this.lastUpdatedUser) {
      const user = this.lastUpdatedUser;

      // Ticket Header
      doc.setFontSize(20);
      doc.text('FlyHigh - Flight Ticket', 10, 10);

      // Flight Info
      doc.setFontSize(14);
      doc.text(`From: ${user.flight.from} to ${user.flight.to}`, 10, 20);
      doc.text(`Airline: ${user.flight.airline}`, 10, 30);

      // Passenger Details
      doc.setFontSize(12);
      doc.text(`Passenger: ${user.passengers[0].firstName} ${user.passengers[0].lastName}`, 10, 40);
      doc.text(`DOB: ${user.passengers[0].dateOfBirth}`, 10, 50);
      doc.text(`Gender: ${user.passengers[0].gender}`, 10, 60);
      doc.text(`Nationality: ${user.passengers[0].nationality}`, 10, 70);

      // Flight Details
      doc.text(`Flight ID: ${user.flight.id}`, 10, 80);
      doc.text(`Departure: ${user.flight.from} at ${user.flight.fromTime}`, 10, 90);
      doc.text(`Arrival: ${user.flight.to} at ${user.flight.toTime}`, 10, 100);
      doc.text(`Duration: ${user.flight.duration}`, 10, 110);

      // Seat Information
      doc.text(`Seat(s): ${user.seats.join(', ')}`, 10, 120);

      // Ticket Footer
      doc.text(`Total Price: ${user.totalPrice}`, 10, 130);
      doc.text('Status: Confirmed', 10, 140);

      // Save the PDF
      doc.save('flight_ticket.pdf');
    } else {
      console.error('No ticket data available to generate PDF');
    }
  }
}