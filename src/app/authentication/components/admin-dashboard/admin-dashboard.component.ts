import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { User } from '../../models/auth';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { faCar } from '@fortawesome/free-solid-svg-icons';
import { faHotel } from '@fortawesome/free-solid-svg-icons';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faConciergeBell } from '@fortawesome/free-solid-svg-icons';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, NgChartsModule, FormsModule, FontAwesomeModule],
})
export class AdminDashboardComponent implements OnInit {
  isDarkTheme = false;

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;

    // Update the body class to toggle the theme for the entire page
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      this.updateChartHeaderStyles('white');
    } else {
      document.body.classList.remove('dark-theme');
      this.updateChartHeaderStyles('black');
    }
    this.generateCharts();
  }

  // Method to dynamically change the chart header styles
  updateChartHeaderStyles(color: string): void {
    const chartHeaders = document.querySelectorAll('.chart h2');
    chartHeaders.forEach((header) => {
      (header as HTMLElement).style.color = color;
    });
  }



  faCar = faCar;
  faHotel = faHotel;
  faPlane = faPlane;
  faSuitcase = faSuitcase;
  faInfoCircle = faInfoCircle;
  faConciergeBell = faConciergeBell;
  faAddressBook = faAddressBook;
  faUser = faUser;
  faLocationArrow = faLocationArrow;
  faVenusMars = faVenusMars;
  faChartBar = faChartBar;
  faUsers = faUsers;
  users: User[] = [];
  totalUsers = 0;
  isDashboardOpen = false;
  userId = ''; // For logged-in admin
  fullName = '';
  email = '';
  profileData: User | null = null;
  isEditing = false;
  paginatedUsers: User[] = []; // Users for the current page
  currentPage = 1; // Current page number
  itemsPerPage = 8; // Number of users per page
  Math = Math; // Add Math reference
  totalPages: number[] = []; // Array for pagination buttons

  defaultProfilePic = 'https://via.placeholder.com/150'; // Default profile picture

  @ViewChild('fileInput') fileInput!: ElementRef; // Reference to the file input element

  // Function to trigger file input
  triggerFileUpload(): void {
    this.fileInput.nativeElement.click();
  }
  // Chart Data
  genderDistribution!: ChartConfiguration<'pie'>['data'];
  ageDistribution!: ChartConfiguration<'bar'>['data'];
  locationDistribution!: ChartConfiguration<'line'>['data'];

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId') || ''; // Fetch userId from sessionStorage
    if (this.userId) {
      this.loadProfile(); // Load admin profile
    } else {
      console.error('No user ID found in sessionStorage.');
    }
    this.fetchUsers();
  }

  loadProfile(): void {
    this.authService.getUserProfile(this.userId).subscribe({
      next: (data: User) => {
        this.profileData = data; // Populate profileData
        this.fullName = data.fullName || ''; // Assign fullName
        this.email = data.email || ''; // Assign email
      },
      error: (error) => {
        console.error('Error fetching profile data:', error);
      },
    });
  }

  editProfile(): void {
    this.isEditing = true;
  }

  saveProfile(): void {
    if (this.profileData) {
      this.authService.updateUserProfile(this.userId, this.profileData).subscribe({
        next: (updatedData: User) => {
          this.profileData = updatedData; // Update profileData
          this.fullName = updatedData.fullName || ''; // Assign fullName
          this.email = updatedData.email || ''; // Assign email
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        },
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadProfile(); // Reload data to discard unsaved changes
  }
  toggleDashboard() {
    this.isDashboardOpen = !this.isDashboardOpen;
  }
  fetchUsers(): void {
    this.http.get<User[]>('http://localhost:3000/users').subscribe({
      next: (data) => {
        this.users = data.filter((user) => user.role === 'User'); // Filter users
        this.totalUsers = this.users.length;
        this.generateCharts();

        this.totalPages = Array.from(
          { length: Math.ceil(this.totalUsers / this.itemsPerPage) },
          (_, i) => i + 1
        ); // Create array of page numbers
        this.updatePaginatedUsers();
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }
  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updatePaginatedUsers();
  }

  goToNextPage(): void {
    if (this.currentPage < Math.ceil(this.totalUsers / this.itemsPerPage)) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }
  generateCharts(): void {
    this.generateGenderChart();
    this.generateAgeChart();
    this.generateLocationChart();
  }

  generateGenderChart(): void {
    const genderCounts: { [key: string]: number } = { Male: 0, Female: 0, Other: 0 };
    this.users.forEach(user => {
      genderCounts[user.gender] = (genderCounts[user.gender] || 0) + 1;
    });

    const isDarkTheme = this.isDarkTheme; // Use the component property directly

    // Define colors based on the theme
    const lightThemeColors = ['#42A5F5', '#FF6384', '#FFCE56'];
    const darkThemeColors = ['#167cc9', '#D32F2F', '#FFC107'];

    this.genderDistribution = {
      labels: Object.keys(genderCounts),
      datasets: [
        {
          data: Object.values(genderCounts),
          backgroundColor: isDarkTheme ? darkThemeColors : lightThemeColors,
        },
      ],
    };
  }


  generateAgeChart(): void {
    const ageGroups: { [key: string]: number } = { '0-18': 0, '19-35': 0, '36-50': 0, '51+': 0 };
    this.users.forEach(user => {
      if (user.age <= 18) ageGroups['0-18']++;
      else if (user.age <= 35) ageGroups['19-35']++;
      else if (user.age <= 50) ageGroups['36-50']++;
      else ageGroups['51+']++;
    });

    // Check the current theme
    const isDarkTheme = document.querySelector('.dashboard-container')?.classList.contains('dark-theme');

    // Define colors for both themes
    const lightThemeColors = ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A'];
    const darkThemeColors = ['#D32F2F', '#1976D2', '#FBC02D', '#388E3C'];

    // Assign background colors based on the theme
    this.ageDistribution = {
      labels: Object.keys(ageGroups),
      datasets: [
        {
          label: 'Users by Age Group',
          data: Object.values(ageGroups),
          backgroundColor: isDarkTheme ? lightThemeColors : darkThemeColors,
        },
      ],
    };
  }

  generateLocationChart(): void {
    const locationCounts: { [key: string]: number } = {};
    this.users.forEach(user => {
      locationCounts[user.location] = (locationCounts[user.location] || 0) + 1;
    });

    // Check the current theme
    const isDarkTheme = document.querySelector('.dashboard-container')?.classList.contains('dark-theme');

    // Define colors for both themes
    const lightThemeColor = '#42A5F5';
    const darkThemeColor = '#167cc9';

    // Assign background and border colors based on the theme
    this.locationDistribution = {
      labels: Object.keys(locationCounts),
      datasets: [
        {
          label: 'Users by Location',
          data: Object.values(locationCounts),
          backgroundColor: isDarkTheme ? lightThemeColor : darkThemeColor,
          borderColor: isDarkTheme ? '#0D47A1' : '#167cc9', // Adjust border colors for better contrast
          fill: false,
        },
      ],
    };
  }

  uploadProfilePicture(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const profilePicUrl = reader.result as string;
        this.updateUserProfilePic(profilePicUrl);
      };

      reader.readAsDataURL(file); // Convert file to Base64
    }
  }

  // Function to update profile picture in the backend
  updateUserProfilePic(profilePicUrl: string): void {
    if (this.profileData) {
      const updatedData = { ...this.profileData, profilePic: profilePicUrl };
      this.authService.updateUserProfile(this.userId, updatedData).subscribe({
        next: (updatedUser: User) => {
          this.profileData = updatedUser; // Update local data
          console.log('Profile picture updated successfully');
        },
        error: () => {
          console.error('Failed to update profile picture');
        },
      });
    }
  }
}
