import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finish-order',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './finish-order.component.html',
  styleUrl: './finish-order.component.scss'
})
export class FinishOrderComponent {
  
  constructor(private router: Router) {
    
  }
  
  chatOnWhatsapp() {
    window.location.href = "https://wa.me/554192947095";
  }
}
