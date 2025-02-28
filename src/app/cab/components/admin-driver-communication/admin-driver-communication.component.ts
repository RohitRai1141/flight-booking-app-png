import { Component, OnInit } from '@angular/core';
import { DriverService } from '../../services/driver.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { drivers, ChatMessage } from '../../models/cab-entities';

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
  emojis: string[] = ['😊', '😎', '🚗', '⚡', '🙏', '✅', '📍', '📍🗺️'];
  messages: ChatMessage[] = [];
  expandedCity: string | null = null;
  isFabMenuOpen: boolean = false;

  predefinedReplies: { [key: string]: string } = {
    'Are you available?': "Yes, I'm available.",
    'Please confirm pickup.': 'Pickup confirmed.',
    'Request Location': "I'm near your location.",
    'Confirm Availability': "I'm ready for the trip.",
    'Estimated arrival time?': "I'll reach in approximately 5-10 minutes.",
    'Please share your live location.': "Here's my live location: [Location Link]",
    'I will reach in 5 minutes.': "Noted, I'll be ready.",
    'Trip has been assigned to you.': "Acknowledged, I will proceed with the trip.",
    'Please start the trip.': "Starting the trip now.",
    'Drop-off location confirmed.': "Got it, heading to the drop-off location.",
    'Please confirm fare details.': "The fare is as per the booking details.",
    'Emergency! Please respond immediately!': "I'm here! How can I assist?",
    'Trip completed successfully. Thank you!': "Thank you for the ride! Have a great day!",
    'Payment has been received.': "Okay. Thank you!"
  };
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

  toggleFabMenu(): void {
    this.isFabMenuOpen = !this.isFabMenuOpen;
  }

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

  filterByAvailability(status: 'all' | 'available' | 'unavailable'): void {
    this.availabilityFilter = status;
    this.updateFilteredDrivers();
  }

  searchByLocation(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value.toLowerCase();
    this.updateFilteredDrivers();
  }

  extractCities(): void {
    const uniqueCities = new Set(this.drivers.map((driver) => driver.location));
    this.cities = Array.from(uniqueCities);
  }

  getDriversByCity(city: string): drivers[] {
    return this.drivers.filter((driver) => driver.location === city);
  }

  selectDriver(driver: drivers): void {
    this.selectedDriver = driver;
    this.loadChatHistory();
  }

  toggleCity(city: string): void {
    this.expandedCity = this.expandedCity === city ? null : city;
  }

  loadChatHistory(): void {
    if (this.selectedDriver) {
      this.driverService.getMessageHistory(this.selectedDriver.id).subscribe((chats) => {
        this.messages = chats || [];  
      });
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedDriver) return;
  
    const message: ChatMessage = {
      sender: 'admin',
      receiver: this.selectedDriver.id,
      text: this.newMessage,
      timestamp: new Date().toISOString(),
    };
  
    this.driverService.sendMessage(this.selectedDriver.id, message).subscribe(() => {
      this.messages.push({ ...message });
      this.newMessage = '';
  
      // Auto-reply for predefined messages (only if driver is available)
      if (this.predefinedReplies[message.text] && this.selectedDriver?.available) {
        setTimeout(() => this.sendDriverReply(this.predefinedReplies[message.text]), 1000);
      }
    });
  }

  sendDriverReply(replyText: string): void {
    if (!this.selectedDriver || !this.selectedDriver.available) return; // Only send reply if available
  
    const driverMessage: ChatMessage = {
      sender: 'driver',
      receiver: 'admin',
      text: replyText,
      timestamp: new Date().toISOString(),
    };
  
    this.driverService.sendMessage(this.selectedDriver.id, driverMessage).subscribe(() => {
      this.messages.push({ ...driverMessage });
    });
  }
  
  sendQuickMessage(text: string): void {
    this.newMessage = text;
    this.sendMessage();
  }

  toggleEmojiPicker(): void {
    this.emojiPickerVisible = !this.emojiPickerVisible;
  }

  addEmoji(emoji: string): void {
    this.newMessage += emoji;
    this.emojiPickerVisible = false;
  }
}
