import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-flight',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule],
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.css'
})
export class FlightComponent {
  tripType: string = 'oneWay'; // Default trip type
  departureCity: string = '';
  destinationCity: string = '';
  departureDate: string = '';
  returnDate: string = '';
  adults: number = 1;
  children: number = 0;
  infants: number = 0;

  constructor() {}

  ngOnInit(): void {}

  increment(type: string) {
    if (type === 'adults'&& this.adults<9) {
      this.adults++;
      this.adults>9;
    } else if (type === 'children' && this.children<5) {
      this.children++;
    } else if (type === 'infants'&& this.infants<3) {
      this.infants++;
    }
  }
  decrement(type: string) {
    if (type === 'adults' && this.adults > 1) {
      this.adults--;
    } else if (type === 'children' && this.children > 0) {
      this.children--;
    } else if (type === 'infants' && this.infants > 0) {
      this.infants--;
    }
  }

  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form Submitted:', form.value);
    } else {
      console.log('Form is invalid');
    }
  }
}

