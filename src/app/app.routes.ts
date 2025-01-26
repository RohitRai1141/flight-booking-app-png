// src/app/app.routes.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { FlightComponent } from './flight/flight/flight.component';
import { BookingComponent } from './flight/booking/booking.component';
import { SeatComponent } from './flight/seat/seat.component';
import { HistoryComponent } from './flight/history/history.component';
import { DemopageForFlightComponent } from './flight/demopage-for-flight/demopage-for-flight.component';
import { AdminPanelComponent } from './flight/admin-panel/admin-panel.component';
import { AdminDashboardComponent } from './flight/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: DemopageForFlightComponent },
  {
    path: '',
    children: [
      { path: 'flight', component: FlightComponent },
      { path: 'booking/:id', component: BookingComponent },
      { path: 'seat/:id', component: SeatComponent },
      { path: 'history', component: HistoryComponent },
    ],
  },
  {
    path: 'admin',
    children: [
      { path: 'panel', component: AdminPanelComponent },
      { path: 'dashboard', component: AdminDashboardComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
