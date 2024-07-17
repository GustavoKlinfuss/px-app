import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { ETipoPagamento } from '../shared/order.models';

@Component({
  selector: 'app-complementary-info',
  standalone: true,
  imports: [
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './complementary-info.component.html',
  styleUrl: './complementary-info.component.scss'
})
export class ComplementaryInfoComponent implements OnInit {

  public form = new FormGroup({
    name: new FormControl<string>("", Validators.required),
    phone: new FormControl<string>("", Validators.required),
    zipCode: new FormControl<string>("", Validators.required),
    street: new FormControl<string>("", Validators.required),
    numberInStreet: new FormControl<number|null>(null, Validators.required),
    paymentMethod: new FormControl<ETipoPagamento>(ETipoPagamento.CartaoDebito, Validators.required),
    neighborhood: new FormControl<string>("", Validators.required),
    complement: new FormControl<string>("")
  })

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isLoading = false;
  }

  isLoading = true;

  getPaymentOptions(): Array<ETipoPagamento> {
    return [ ETipoPagamento.Dinheiro, ETipoPagamento.CartaoCredito, ETipoPagamento.CartaoDebito ]
  }

  advanceToNextStep() {
    this.router.navigate(['pedidos/finalizar'])
  }
}
