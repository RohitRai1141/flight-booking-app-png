import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderHotelComponent } from './service-provider-hotel.component';

describe('ServiceProviderHotelComponent', () => {
  let component: ServiceProviderHotelComponent;
  let fixture: ComponentFixture<ServiceProviderHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceProviderHotelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceProviderHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
