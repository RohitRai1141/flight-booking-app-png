import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHotelsComponent } from './admin-hotels.component';

describe('AdminHotelsComponent', () => {
  let component: AdminHotelsComponent;
  let fixture: ComponentFixture<AdminHotelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHotelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminHotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
