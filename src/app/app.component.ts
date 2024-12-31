import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FlightComponent } from '../app/flight/flight/flight.component';
import { BookingComponent } from './flight/booking/booking.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FlightComponent,BookingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'PlanNGo';
  
}

