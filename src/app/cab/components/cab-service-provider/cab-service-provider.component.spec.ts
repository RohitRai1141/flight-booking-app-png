import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabServiceProviderComponent } from './cab-service-provider.component';

describe('CabServiceProviderComponent', () => {
  let component: CabServiceProviderComponent;
  let fixture: ComponentFixture<CabServiceProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabServiceProviderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CabServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
