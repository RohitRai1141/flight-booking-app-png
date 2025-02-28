import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import  Chart  from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-dashboard.component.html',
  standalone:true,
  imports:[FormsModule,CommonModule],
  styleUrls: ['./admin-dashboard.component.css'],
})
export class CabAdminDashboardComponent implements OnInit {
  totalCabs = 0;
  totalRides = 0;
  totalBookings = 0;
  isFabMenuOpen: boolean = false;  

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    try {
      // Using .toPromise() instead of firstValueFrom()
      const cabs = await this.http.get<any>('http://localhost:3000/cabs').toPromise();
      const bookings = await this.http.get<any>('http://localhost:3000/cabbookings').toPromise();

      this.totalCabs = cabs.length;
      this.totalBookings = bookings.length;
      this.totalRides = bookings.filter((b: any) => b.status !== 'Cancelled').length;

      console.log('Cabs:', cabs);
      this.renderCityPieChart(cabs);
      this.renderGenderPieChart(bookings);
      this.renderCarBarChart(cabs);
      console.log('Bookings:', bookings);
    } catch (error) { 
      console.error('Error fetching data:', error); 
    }
  }

  // Toggle the Floating Action Button menu
  toggleFabMenu(): void {
    this.isFabMenuOpen = !this.isFabMenuOpen;
  }

  renderCityPieChart(cabs: any[]) {
    const cityCounts = cabs.reduce((acc: any, cab: any) => {
      acc[cab.location] = (acc[cab.location] || 0) + 1;
      return acc;
    }, {});

    const cities = Object.keys(cityCounts).slice(0, 4);
    const counts = Object.values(cityCounts).slice(0, 4);

    new Chart('cityPieChart', {
      type: 'pie',
      data: {
        labels: cities,
        datasets: [
          {
            data: counts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          },
        ],
      },
    });
  }

  renderGenderPieChart(bookings: any[]) {
    const genderCounts = bookings.reduce(
      (acc: any, booking: any) => {
        const gender = booking.users[0]?.gender.toLowerCase();
        if (gender === 'male') acc.male++;
        else if (gender === 'female') acc.female++;
        return acc;
      },
      { male: 0, female: 0 }
    );

    new Chart('genderPieChart', {
      type: 'pie',
      data: {
        labels: ['Male', 'Female'],
        datasets: [
          {
            data: [genderCounts.male, genderCounts.female],
            backgroundColor: ['blue', 'pink'],
          },
        ],
      },
    });
  }

  renderCarBarChart(cabs: any[]) {
    const carTypeCounts = cabs.reduce((acc: any, cab: any) => {
      acc[cab.type] = (acc[cab.type] || 0) + 1;
      return acc;
    }, {});

    const carTypes = Object.keys(carTypeCounts);
    const counts = Object.values(carTypeCounts);

    new Chart('carBarChart', {
      type: 'bar',
      data: {
        labels: carTypes,
        datasets: [
          {
            label: 'Bookings',
            data: counts,
            backgroundColor: 'orange',
            barPercentage: 0.7,
            categoryPercentage: 0.75,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 25,
              },
            },
            min: 0,
            max: carTypes.length - 1,
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }
}