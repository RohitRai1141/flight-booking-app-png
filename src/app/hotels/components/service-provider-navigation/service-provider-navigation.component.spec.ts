import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderNavigationComponent } from './service-provider-navigation.component';

describe('ServiceProviderNavigationComponent', () => {
  let component: ServiceProviderNavigationComponent;
  let fixture: ComponentFixture<ServiceProviderNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceProviderNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceProviderNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
