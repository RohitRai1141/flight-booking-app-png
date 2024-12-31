import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
  })
  export class PaymentComponent {
    totalPrice: number = 0;
    paymentMethod: string = '';
    paymentStatus: string = '';
  
    constructor(private router: Router) {}
  
    makePayment() {
      if (!this.paymentMethod) {
        alert('Please select a payment method!');
        return;
      }
      this.paymentStatus = 'Payment successful!';
      this.router.navigate(['/']);
    }
  
    cancelPayment() {
      this.router.navigate(['/']);
    }
  }