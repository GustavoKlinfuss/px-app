import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complementary-info',
  standalone: true,
  imports: [
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './complementary-info.component.html',
  styleUrl: './complementary-info.component.scss'
})
export class ComplementaryInfoComponent {

  constructor(private router: Router) {

  }

  advanceToNextStep() {
    this.router.navigate(['pedidos/finalizar'])
  }
}
