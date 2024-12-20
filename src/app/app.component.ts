import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlightComponent } from './flight/flight/flight.component';
import { FlightSearchComponent } from './flight/flight-search/flight-search.component'; // Import FlightSearchComponent if standalone


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlightComponent, FlightSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'PlanNGo';
}
