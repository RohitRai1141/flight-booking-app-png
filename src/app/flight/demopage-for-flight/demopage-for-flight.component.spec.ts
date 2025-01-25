import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemopageForFlightComponent } from './demopage-for-flight.component';

describe('DemopageForFlightComponent', () => {
  let component: DemopageForFlightComponent;
  let fixture: ComponentFixture<DemopageForFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemopageForFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemopageForFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
