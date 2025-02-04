import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightAdminDashboardComponent } from './flight-admin-dashboard.component';

describe('FlightAdminDashboardComponent', () => {
  let component: FlightAdminDashboardComponent;
  let fixture: ComponentFixture<FlightAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightAdminDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlightAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
