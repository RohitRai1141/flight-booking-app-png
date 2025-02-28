import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CabService } from '../../services/cab.service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';


@Component({
  selector: 'app-cab-service-provider',
  standalone: true,
  imports: [FormsModule, CommonModule, NgChartsModule],
  providers:[CabService],
  templateUrl: './cab-service-provider.component.html',
  styleUrl: './cab-service-provider.component.css'
})
export class CabServiceProviderComponent {
  agencyId: string = ''; 
  filteredCabs: any[] = []; 
  agencyName: string = ''; 
  isInvalidInput: boolean = false; // Flag to show/hide popup

  // Pie Chart Variables
  pieChartLabels: string[] = ['Active Cabs', 'Inactive Cabs'];
  pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [{ data: [0, 0], backgroundColor: ['#a3c1e0', '#007bff'] }],
  };
  pieChartType: ChartType = 'pie';
  pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows custom size
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  constructor(private cabService: CabService) {}

  // Function to fetch and filter cabs by Agency ID
  searchByAgencyId() {
    if (this.agencyId.trim()) {
      this.isInvalidInput = false; // Hide error if valid input
      this.cabService.getCabsByAgency(this.agencyId).subscribe((cabs) => {
        if (cabs.length > 0) {
          this.filteredCabs = cabs;
          this.agencyName = `Agency: ${cabs[0].agencyId}`;

          // ✅ Update Pie Chart Data  
          const activeCabs = cabs.filter(cab => cab.available).length;
          const inactiveCabs = cabs.length - activeCabs;

          this.pieChartData = {
            labels: this.pieChartLabels,
            datasets: [{ data: [activeCabs, inactiveCabs], backgroundColor: ['#4CAF50', '#F44336'] }],
          };
        } else {
          this.filteredCabs = [];
          this.agencyName = 'No cabs found for this Agency ID';
          this.pieChartData = { labels: this.pieChartLabels, datasets: [{ data: [0, 0] }] };
        }
      });
    } else {
      this.isInvalidInput = true; // Show error popup
      this.filteredCabs = [];
      this.agencyName = '';
      this.pieChartData = { labels: this.pieChartLabels, datasets: [{ data: [0, 0] }] };
    }
  }
}





