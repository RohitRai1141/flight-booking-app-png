import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-history',
  standalone:true,
  imports: [CommonModule,FormsModule,AdminNavbarComponent],
  templateUrl: './admin-history.component.html',
  styleUrl: './admin-history.component.css'
})
export class AdminHistoryComponent implements OnInit{
  users: any[] = [];
  filteredUsers: any[] = [];
  currentUser = { id: null, flight: {}, status: '' };
  showMenuForUser: number | null = null;
  searchId: string | null = null;
  selectedUserId: number | null = null;
  noResultsFound: boolean = false;
  showConfirmationModal: boolean = false; // Modal visibility flag
  confirmationMessage: string = ''; // Message to show in the modal
  actionToConfirm: string = ''; // Which action to confirm ('delete' or 'update')
  userIdToActOn: number | null = null; // User ID to act on
  isDeleteModalOpen: boolean = false;
  

  constructor(
    private http: HttpClient,
    private flightService: FlightService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  trackUserId(index: number, user: any): number {
    return user.id;
  }

  // Load users from the backend
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

  // Toggle visibility of the options menu for each user
  toggleMenu(userId: number): void {
    this.showMenuForUser = this.showMenuForUser === userId ? null : userId;
  }

  // Edit user details
  editUser(user: any): void {
    this.currentUser = { ...user };
    this.showMenuForUser = null;
  }
  // Delete user by ID (sync with backend JSON)
  deleteUser(userId: number): void {
    const userToDelete = this.users.find(user => user.id === userId);
  
    if (userToDelete && userToDelete.status.toLowerCase() === 'cancelled') {
      // Proceed with deletion if the status is 'Cancelled'
      this.http.delete(`http://localhost:3000/users/${userId}`).subscribe(
        () => {
          // Remove user from both users and filteredUsers lists
          this.users = this.users.filter(user => user.id !== userId);
          this.filteredUsers = this.filteredUsers.filter(user => user.id !== userId);
          this.showMenuForUser = null;
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    } else {
      // Optionally, display a message or handle the case where the status is not 'Cancelled'
      alert('This user cannot be deleted because their status is not "Cancelled".');
    }
}
  
  

  // Update user data (sync with backend JSON)
  updateUser(user: any): void {
    this.http.put(`http://localhost:3000/users/${user.id}`, user).subscribe(
      (updatedUser) => {
        const index = this.users.findIndex(existingUser => existingUser.id === this.currentUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.filteredUsers[index] = updatedUser;
        }
        this.cancelEdit();
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  // Add a new user (sync with backend JSON)
  addUser(user: any): void {
    this.http.post('http://localhost:3000/users', user).subscribe(
      (newUser) => {
        this.users.push(newUser);
        this.filteredUsers.push(newUser);
        this.cancelEdit();
      },
      (error) => {
        console.error('Error adding user:', error);
      }
    );
  }
  // Close the delete confirmation modal
  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedUserId = null;
  }

  // Cancel editing and reset the current user form
  cancelEdit(): void {
    this.currentUser = { id: null, flight: {}, status: '' }; // Reset current user form
    this.showMenuForUser = null; // Close any open menus
    this.selectedUserId = null; // Reset the selected user
    this.filteredUsers = [...this.users]; // Reset filtered users to the original list
  }

  //Cancel booking status
  cancelstatus() {
      // Ensure a user is selected for cancellation
      if (this.selectedUserId !== null) {
        const userToCancel = this.users.find((user) => user.id === this.selectedUserId);
    
        if (userToCancel) {
          // Fetch seat data to update the status
          this.flightService.getSeats().subscribe(
            (seatsData) => {
              console.log('Fetched seats data:', seatsData);  // Debug log
    
              // Find the seats related to the current user's flight
              const flightSeats = seatsData.find((seat: any) => seat.flightId === userToCancel.flight.id);
    
              if (flightSeats) {
                // Mark the seats as 'available' for the user
                userToCancel.seats.forEach((seatId: string) => {
                  const seatInfo = flightSeats.seats.find((seat: any) => seat.id === seatId);
                  if (seatInfo) {
                    seatInfo.status = 'available';
                  }
                });
    
                console.log('Updated seat statuses:', flightSeats.seats);  // Debug log
    
                // Update the seat data on the backend (PATCH request)
                this.http.patch(`http://localhost:3002/seats/${flightSeats.id}`, { seats: flightSeats.seats }).subscribe(
                  () => {
                    // After seats are updated, change the user status to 'Cancelled'
                    userToCancel.status = 'Cancelled';
    
                    console.log('Updated user status:', userToCancel);  // Debug log
    
                    // Send a PUT request to update the user status to 'Cancelled'
                    this.http.put(`http://localhost:3000/users/${this.selectedUserId}`, userToCancel).subscribe(
                      () => {
                        console.log('User status updated to "Cancelled".');
                        this.loadUsers();  // Reload the users to reflect the changes
                        this.closeDeleteModal();  // Close any open delete modal
                      },
                      (error) => {
                        console.error('Error updating user status:', error);
                      }
                    );
                  },
                  (error) => {
                    console.error('Error updating seat statuses:', error);
                  }
                );
              } else {
                console.error('No matching flight seats found for this user.');
              }
            },
            (error) => {
              console.error('Error fetching seat data:', error);
            }
          );
        } else {
          console.error('User to cancel not found!');
        }
      }
    }
    
  
  

searchUser(): void {
  if (this.searchId && this.searchId.trim() !== '') {
    this.filteredUsers = this.users.filter(user =>
      user.id.toString().toLowerCase().includes(this.searchId?.trim().toLowerCase())
    );

    // Set noResultsFound to true if no results match the search
    this.noResultsFound = this.filteredUsers.length === 0;
  } else {
    this.filteredUsers = [...this.users];
    this.noResultsFound = false; // Reset when search is cleared
  }
}

}
  

