import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgotpassword.component';
import { By } from '@angular/platform-browser';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ForgotPasswordComponent], // Declare the component
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error if email is empty and form is submitted', () => {
    const resetButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    resetButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.email).toBe('');
    expect(window.alert).toHaveBeenCalledWith('Please enter a valid email address.');
  });

  it('should show a success alert when email is valid and form is submitted', () => {
    spyOn(window, 'alert');
    component.email = 'test@example.com';
    fixture.detectChanges();

    const resetButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    resetButton.nativeElement.click();
    fixture.detectChanges();

    expect(window.alert).toHaveBeenCalledWith('Password reset link has been sent to: test@example.com');
  });

  it('should bind the email input field to the component property', () => {
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
    emailInput.nativeElement.value = 'example@example.com';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.email).toBe('example@example.com');
  });
});
