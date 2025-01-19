import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import history from '../../../../users.json'



@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  users: any[] = history.users;  // Users imported from JSON
  isDeleteModalOpen: boolean = false;  // Control whether the modal is visible
  selectedUserId: number | null = null;  // Store the ID of the user to be deleted

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

  // Delete user history
  deleteUserHistory() {
    // Filter out the user by ID and update the list
    this.users = this.users.filter(user => user.id !== this.selectedUserId);
    this.closeDeleteModal();  // Close the modal after deletion
  }
}