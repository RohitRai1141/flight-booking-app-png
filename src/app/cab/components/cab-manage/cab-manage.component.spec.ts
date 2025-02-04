import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabManageComponent } from './cab-manage.component';

describe('CabManageComponent', () => {
  let component: CabManageComponent;
  let fixture: ComponentFixture<CabManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CabManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
