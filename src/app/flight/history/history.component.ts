import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import history from '../../../../users.json'
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit{
  users: any[] = history.users;  // Users imported from JSON
  isDeleteModalOpen: boolean = false;  // Control whether the modal is visible
  selectedUserId: number | null = null;  // Store the ID of the user to be deleted


  constructor(private http: HttpClient) {}  // Inject HttpClient to perform HTTP operations

  ngOnInit() {
    this.loadUsers();  // Load users when the component is initialized
  }
   // Fetch users from the backend (JSON Server)
   loadUsers() {
    this.http.get<any[]>('http://localhost:3001/users').subscribe(
      (data) => {
        this.users = data;  // Set the fetched data to users array
      },
      (error) => {
        console.error('Error loading users:', error);  // Handle error
      }
    );
  }

  trackUserId(index: number, user: any): number {
    return user.id;
  }

  // Open the confirmation modal
  openDeleteConfirmation(userId: number) {
    this.selectedUserId = userId;  // Save the user ID to delete
    this.isDeleteModalOpen = true;  // Show the modal
  }

  // Close the confirmation modal
  closeDeleteModal() {
    this.isDeleteModalOpen = false;  // Hide the modal
    this.selectedUserId = null;  // Reset selected user ID
  }

 // Delete user from both frontend and backend (JSON Server)
 deleteUserHistory() {
  if (this.selectedUserId !== null) {
    // Send DELETE request to the backend (JSON Server)
    this.http.delete(`http://localhost:3001/users/${this.selectedUserId}`).subscribe(
      () => {
        // Remove the user from the frontend array (update UI)
        this.users = this.users.filter(user => user.id !== this.selectedUserId);

        // Close the modal after deletion
        this.closeDeleteModal();
      },
      (error) => {
        console.error('Error deleting user:', error);  // Handle error
      }
    );
  }
}
}