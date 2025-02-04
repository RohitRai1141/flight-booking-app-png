import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightServiceProviderComponent } from './flight-service-provider.component';

describe('FlightServiceProviderComponent', () => {
  let component: FlightServiceProviderComponent;
  let fixture: ComponentFixture<FlightServiceProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightServiceProviderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlightServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
