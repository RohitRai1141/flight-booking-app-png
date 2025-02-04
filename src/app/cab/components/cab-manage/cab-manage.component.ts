import { Component, Output, EventEmitter, OnInit, ViewChild  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CabService } from '../../services/cab.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';  
import { User } from '../../models/cab-entities';

@Component({
  selector: 'app-cab-booking-management',
  templateUrl: './cab-manage.component.html',
  standalone: true,
  providers: [CabService],
  styleUrls: ['./cab-manage.component.css'],
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule]
})
export class CabManageComponent implements OnInit {

  @ViewChild('userForm') userForm!: NgForm;
  minDate: string;
  maxDate: string;
  showConfirmationPopup = false;
  dropdownOptions: string[] = [];
  dropdownOpen: boolean = false;
  isFabMenuOpen = false;

  @Output() userCancelled = new EventEmitter<boolean>();

  selectedCab: {
    location: string;
    dropLocation: string;
    type: string;
    fareEstimate: string;
    carNumber: string;
    estimatedTime: string;
    pinGenerated: string;
  } | null = null;

  user: User = {
    id:'',
    firstname: '',
    midname:'',
    lastname: '',
    gender: '',
    contactNumber: '',
    date: '',
  };

  users: User[] = [];
  userAdded = false;
  editing = false;
  editingIndex = -1;

  constructor(
    private router: Router,
    private cabService: CabService,
    private route: ActivatedRoute
  ) {

    
      const today = new Date();
      this.minDate = this.formatDate(today);
      const maxAdvanceDate = new Date(today.setDate(today.getDate() + 20));
      this.maxDate = this.formatDate(maxAdvanceDate);
    }
  
    formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }
  

    toggleDropdown(): void {
      this.dropdownOpen = !this.dropdownOpen;
    }
    toggleFabMenu(): void {
      this.isFabMenuOpen = !this.isFabMenuOpen;
    }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const cabId = params['id'];
      if (cabId) {
        this.cabService.getCabById(cabId).subscribe(
          (cab) => {
            this.selectedCab = cab;
          },
          (error) => {
            console.error('Error fetching cab details:', error);
          }
        );
      }
    });
  }

  submitUser() {
    if (this.userAdded) {
      alert('A user has already been added. You can edit or remove the current user.');
      return;
    }
  
    if (this.editing) {
      this.users[this.editingIndex] = { ...this.user };
      this.editing = false;
      this.editingIndex = -1;
    } else {
      this.user.id = this.generateRandomId(); // Generate a random ID for the user
      this.users.push({ ...this.user });
      this.userAdded = true; 
    }
  
    this.resetUserForm();
  }
  
  generateRandomId(): string {
    return Math.random().toString(36).substr(2, 4).toUpperCase(); // Generates a 4-character string
  }
  
  
  

  confirmUser(): void {
    if (!this.selectedCab) {
      alert('Cab details are missing. Cannot confirm user.');
      return;
    }

    if (this.users.length > 0) {
      const userData = {
        cab: this.selectedCab,
        users: this.users,
      };

      this.cabService.saveUserData(userData).subscribe(
        (response) => {
          // alert('User confirmed and saved!');
          this.router.navigate(['/confirmation']);
        },
        (error) => {
          console.error('Failed to save user data:', error);
          alert('Failed to save user. Please try again.');
        }
      );
    } else {
      alert('Please add user details.');
    }
    this.showConfirmationPopup = true;
  }

  closeConfirmationPopup() {
    this.showConfirmationPopup = false;
  }

  cancelUser(index: number): void {
    this.users.splice(index, 1);
    this.userAdded = false;
  }

  editUser(index: number) {
    this.user = { ...this.users[index] };
    this.editing = true;
    this.editingIndex = index;
  }

  resetUserForm() {
    this.user = {
      id:'',
      firstname: '',
      midname:'',
      lastname: '',
      gender: '',
      contactNumber: '',
      date: '',
      
    };
    this.userAdded = false;
    this.userForm.resetForm();
  }

  goBack(): void {
    this.router.navigate(['/cab/home']);
  }
}

