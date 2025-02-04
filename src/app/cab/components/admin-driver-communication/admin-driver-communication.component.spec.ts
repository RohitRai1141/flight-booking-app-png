import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDriverCommunicationComponent } from './admin-driver-communication.component';

describe('AdminDriverCommunicationComponent', () => {
  let component: AdminDriverCommunicationComponent;
  let fixture: ComponentFixture<AdminDriverCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDriverCommunicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDriverCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
