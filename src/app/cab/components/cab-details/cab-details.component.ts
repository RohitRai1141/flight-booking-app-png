import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CabService } from '../../services/cab.service'; // Adjust the path as needed
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf/ngFor
import { RouterModule } from '@angular/router'; // Import RouterModule for navigation
import { HttpClientModule } from '@angular/common/http'; // Ensure HttpClientModule is imported for HTTP requests
 

@Component({
  selector: 'app-cab-details',
  templateUrl: './cab-details.component.html',
  styleUrls: ['./cab-details.component.css'],  
  standalone: true, // Mark this component as standalone
  imports: [CommonModule, HttpClientModule, RouterModule], // Required for CommonModule, HTTP requests, and routing
  providers: [CabService]
})
export class CabDetailsComponent implements OnInit {
  cabId: string = ''; // Treat as a string because the id is a mix of numbers and alphabets
  cab: any = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cabService: CabService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.cabId = params['id']; // Keep 'cabId' as a string
      this.loadCabDetails();
      
    });
  }

  loadCabDetails(): void {
    this.isLoading = true;
    this.cabService.getCabById(this.cabId).subscribe(
      (data) => {
        if (data.length > 0) {
          this.cab = data[0]; // Ensure we take the first item from data (assuming data is an array)
        } else {
          this.error = 'Cab not found';
        }
        this.isLoading = false;
      },
      (error) => {
        this.error = 'Failed to load cab details';
        this.isLoading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/cab/cab-search']); // Navigate back to the search page
  }

  book(): void {
    this.router.navigate(['/cab/manage-bookings', this.cabId]); // Navigate to manage bookings with cabId as a parameter
  }
}
