// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { BookingsComponent } from './bookings.component';
// import { By } from '@angular/platform-browser';

// describe('BookingComponent', () => {
//   let component: BookingsComponent;
//   let fixture: ComponentFixture<BookingsComponent>;
//   let httpMock: HttpTestingController;

//   const mockBookings = [
//     {
//       id: 1,
//       service: 'Hotel Booking',
//       date: '2025-01-24',
//       status: 'Confirmed',
//     },
//     {
//       id: 2,
//       service: 'Flight Booking',
//       date: '2025-01-25',
//       status: 'Pending',
//     },
//   ];

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [BookingsComponent],
//       imports: [HttpClientTestingModule],
//     }).compileComponents();

//     fixture = TestBed.createComponent(BookingsComponent);
//     component = fixture.componentInstance;
//     httpMock = TestBed.inject(HttpTestingController);
//     fixture.detectChanges();
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should fetch bookings and render them in the table', () => {
//     // Mock the HTTP request
//     const req = httpMock.expectOne('http://localhost:3000/bookings');
//     expect(req.request.method).toBe('GET');
//     req.flush(mockBookings);

//     // Trigger change detection
//     fixture.detectChanges();

//     // Check if bookings are rendered
//     const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
//     expect(rows.length).toBe(mockBookings.length);

//     const firstRow = rows[0].nativeElement;
//     expect(firstRow.textContent).toContain('Hotel Booking');
//     expect(firstRow.textContent).toContain('2025-01-24');
//     expect(firstRow.textContent).toContain('Confirmed');
//   });

//   it('should call viewBooking method when the "View" button is clicked', () => {
//     spyOn(component, 'viewBooking');

//     // Mock the HTTP request
//     const req = httpMock.expectOne('http://localhost:3000/bookings');
//     req.flush(mockBookings);
//     fixture.detectChanges();

//     // Click the "View" button
//     const viewButton = fixture.debugElement.query(By.css('tbody tr button:first-child')).nativeElement;
//     viewButton.click();

//     expect(component.viewBooking).toHaveBeenCalledWith(mockBookings[0].id);
//   });

//   it('should call updateBooking method when the "Update" button is clicked', () => {
//     spyOn(component, 'updateBooking');

//     // Mock the HTTP request
//     const req = httpMock.expectOne('http://localhost:3000/bookings');
//     req.flush(mockBookings);
//     fixture.detectChanges();

//     // Click the "Update" button
//     const updateButton = fixture.debugElement.query(By.css('tbody tr button:nth-child(2)')).nativeElement;
//     updateButton.click();

//     expect(component.updateBooking).toHaveBeenCalledWith(mockBookings[0].id);
//   });

//   it('should call cancelBooking method when the "Cancel" button is clicked', () => {
//     spyOn(component, 'cancelBooking');

//     // Mock the HTTP request
//     const req = httpMock.expectOne('http://localhost:3000/bookings');
//     req.flush(mockBookings);
//     fixture.detectChanges();

//     // Click the "Cancel" button
//     const cancelButton = fixture.debugElement.query(By.css('tbody tr button:nth-child(3)')).nativeElement;
//     cancelButton.click();

//     expect(component.cancelBooking).toHaveBeenCalledWith(mockBookings[0].id);
//   });
// });
