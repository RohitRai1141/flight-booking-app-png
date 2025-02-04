import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FlightService } from '../../services/flight.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule,RouterOutlet,NavbarComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  users: any[] = [];
  isDeleteModalOpen: boolean = false;
  selectedUserId: number | null = null;

  constructor(
    private http: HttpClient,
    private flightService: FlightService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
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
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  trackUserId(index: number, user: any): number {
    return user.id;
  }

  openDeleteConfirmation(userId: number) {
    this.selectedUserId = userId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedUserId = null;
  }

  deleteUserHistory() {
    if (this.selectedUserId !== null) {
      const userToDisplay = this.users.find((user) => user.id === this.selectedUserId);

      if (userToDisplay) {
        this.flightService.getSeats().subscribe(
          (seatsData) => {
            const reversedSeatsData = [...seatsData].reverse();
            const flightSeats = reversedSeatsData.find(
              (seat: any) => seat.flightId === userToDisplay.flight.id
            );

            if (flightSeats) {
              userToDisplay.seats.forEach((seatId: string) => {
                const seatInfo = flightSeats.seats.find(
                  (seat: any) => seat.id === seatId
                );

                if (seatInfo) {
                  seatInfo.status = 'available';
                }
              });

              this.http
                .patch(`http://localhost:3000/seats/${flightSeats.id}`, {
                  seats: flightSeats.seats,
                })
                .subscribe(
                  () => {
                    userToDisplay.status = 'Cancelled';
                    this.http
                      .put(
                        `http://localhost:3000/flightusers/${this.selectedUserId}`,
                        userToDisplay
                      )
                      .subscribe(
                        () => {
                          this.loadUsers();
                          this.closeDeleteModal();
                        },
                        (error) => {
                          console.error('Error updating user status:', error);
                        }
                      );
                  },
                  (error) => {
                    console.error('Error updating seats:', error);
                  }
                );
            }
          },
          (error) => {
            console.error('Error fetching seats data:', error);
          }
        );
      }
    }
  }
}