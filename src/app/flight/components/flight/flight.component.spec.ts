//flight.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightComponent } from './flight.component';

describe('FlightComponent', () => {
  let component: FlightComponent;
  let fixture: ComponentFixture<FlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add flight-specific tests here
  it('should display flight table when data is available', () => {
    // Test implementation
  });

  it('should show no flights message when data is empty', () => {
    // Test implementation
  });
});