import { Component, OnInit } from '@angular/core';
import { DriverService } from '../../services/driver.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { drivers } from '../../models/cab-entities';

@Component({
  selector: 'app-admin-driver-communication',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [DriverService],
  templateUrl: './admin-driver-communication.component.html',
  styleUrls: ['./admin-driver-communication.component.css'],
})
export class AdminDriverCommunicationComponent implements OnInit {
  cities: string[] = [];  
  drivers: drivers[] = [];  
  filteredDrivers: drivers[] = [];  
  availabilityFilter: 'all' | 'available' | 'unavailable' = 'all';
  searchQuery: string = '';  
  selectedDriver: drivers | null = null;  
  newMessage: string = '';
  emojiPickerVisible: boolean = false;
  emojis: string[] = ['😊', '😎', '🚗', '⚡', '🙏','✅','📍','📍🗺️'];
  messages: { text: string; sender: string; timestamp: Date }[] = [];
  expandedCity: string | null = null; 
  isFabMenuOpen: boolean = false;  

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    
    this.driverService.getDrivers().subscribe({
      next: (data) => {
        this.drivers = data; 
        this.filteredDrivers = [...this.drivers];  
        this.extractCities(); 
      },
      error: (err) => {
        console.error('Failed to fetch drivers:', err);  
      },
    });
  }

  // Toggle the Floating Action Button menu
  toggleFabMenu(): void {
    this.isFabMenuOpen = !this.isFabMenuOpen;
  }

  // Update the filtered drivers based on availability and search query
  updateFilteredDrivers(): void {
    this.filteredDrivers = this.drivers.filter((driver) => {
      const matchesAvailability =
        this.availabilityFilter === 'all' ||
        (this.availabilityFilter === 'available' && driver.available) ||
        (this.availabilityFilter === 'unavailable' && !driver.available);

      const matchesSearch = this.searchQuery
        ? driver.location.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;

      return matchesAvailability && matchesSearch;
    });
  }

  // Handle availability filter changes
  filterByAvailability(status: 'all' | 'available' | 'unavailable'): void {
    this.availabilityFilter = status;
    this.updateFilteredDrivers();
  }

  // Handle search input
  searchByLocation(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value.toLowerCase();
    this.updateFilteredDrivers();
  }

  // Extract unique cities from the drivers list
  extractCities(): void {
    const uniqueCities = new Set(this.drivers.map((driver) => driver.city));
    this.cities = Array.from(uniqueCities);
  }

  // Get drivers by city
  getDriversByCity(city: string): drivers[] {
    return this.drivers.filter((driver) => driver.city === city);
  }

  // Select a driver and reset chat messages
  selectDriver(driver: drivers): void {
    this.selectedDriver = driver;
    this.messages = [];  
  }

  // Expand or collapse a city's driver list
  toggleCity(city: string): void {
    this.expandedCity = this.expandedCity === city ? null : city;
  }

  // Send a quick message
  sendQuickMessage(message: string): void {
    this.messages.push({
      sender: 'admin',
      text: message,
      timestamp: new Date(),
    });
    this.newMessage = '';  
  }

  // Send a custom message
  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({
        sender: 'admin',
        text: this.newMessage,
        timestamp: new Date(),
      });
      this.newMessage = '';  
    }
  }

  // Toggle emoji picker visibility
  toggleEmojiPicker(): void {
    this.emojiPickerVisible = !this.emojiPickerVisible;
  }

  // Add emoji to the message
  addEmoji(emoji: string): void {
    this.newMessage += emoji;
    this.emojiPickerVisible = false; 
  }
}
