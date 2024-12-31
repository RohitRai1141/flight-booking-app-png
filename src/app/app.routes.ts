// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { FlightComponent } from './flight/flight/flight.component';
import { BookingComponent } from './flight/booking/booking.component';

export const routes: Routes = [
  { path: '', 
    component: FlightComponent },

  { path: ':booking/:id', 
    component: BookingComponent },
];
