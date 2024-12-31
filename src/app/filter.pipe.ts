import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(flights: any[], searchCriteria: any): any[] {
    if (!flights || !searchCriteria) return flights;

    return flights.filter(flight => {
      const matchesFrom = flight.from.toLowerCase().includes(searchCriteria.from.toLowerCase());
      const matchesTo = flight.to.toLowerCase().includes(searchCriteria.to.toLowerCase());
      const matchesAirline = flight.airline.toLowerCase().includes(searchCriteria.airline.toLowerCase());
      const matchesDate = searchCriteria.date ? flight.departureDate.includes(searchCriteria.date) : true;

      return matchesFrom && matchesTo && matchesAirline && matchesDate;
    });
  }
}
