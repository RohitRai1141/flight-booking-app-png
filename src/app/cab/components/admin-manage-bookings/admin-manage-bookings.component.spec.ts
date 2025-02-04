import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageBookingsComponent } from './admin-manage-bookings.component';

describe('AdminManageBookingsComponent', () => {
  let component: AdminManageBookingsComponent;
  let fixture: ComponentFixture<AdminManageBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminManageBookingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminManageBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
