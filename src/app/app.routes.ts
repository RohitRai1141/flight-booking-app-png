// src/app/app.routes.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { FlightComponent } from './flight/flight/flight.component';
import { BookingComponent } from './flight/booking/booking.component';
import { SeatComponent } from './flight/seat/seat.component';
import { HistoryComponent } from './flight/history/history.component';

export const routes: Routes = [
  // Default route for displaying flights
  { path: '', component: FlightComponent },

  // Route for booking, with dynamic parameter `id` for the selected flight
  { path: 'booking/:id', component: BookingComponent },

  // Route for seat selection
  { path: 'seat/:id', component: SeatComponent },

  // Wildcard route for handling unknown routes (optional)
  { path: 'history', component: HistoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
