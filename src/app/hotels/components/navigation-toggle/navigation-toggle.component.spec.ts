import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationToggleComponent } from './navigation-toggle.component';

describe('NavigationToggleComponent', () => {
  let component: NavigationToggleComponent;
  let fixture: ComponentFixture<NavigationToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationToggleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavigationToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
