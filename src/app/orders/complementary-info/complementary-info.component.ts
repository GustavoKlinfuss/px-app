import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { ETipoPagamento, ETipoPesagem, PersonalInfo } from '../shared/order.models';
import { OrdersService } from '../shared/orders.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-complementary-info',
  standalone: true,
  imports: [
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule
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
    complement: new FormControl<string>("", Validators.required)
  })

  constructor(private router: Router, private ordersService: OrdersService) {}

  toCurrency(value: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatter.format(value);
  }

  ngOnInit(): void {
    this.isLoading = false;
  }

  isLoading = true;

  getPaymentOptions(): Array<ETipoPagamento> {
    return [ ETipoPagamento.Dinheiro, ETipoPagamento.CartaoCredito, ETipoPagamento.CartaoDebito ]
  }

  advanceToNextStep() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    const rawValue = this.form.getRawValue();
    const personalInfo: PersonalInfo = {
      name: rawValue.name!,
      phone: rawValue.phone!,
      zipCode: rawValue.zipCode!,
      street: rawValue.street!,
      numberInStreet: rawValue.numberInStreet!,
      paymentMethod: rawValue.paymentMethod!,
      neighborhood: rawValue.neighborhood!,
      complement: rawValue.complement!
    }
    this.ordersService.setPersonalInfo(personalInfo);
    this.chatOnWhatsapp();
  }

  chatOnWhatsapp() {
    const base = "https://wa.me";
    const phoneNumber = "554192947095";

    const cart = this.ordersService.getCart();
    const personalInfo = this.ordersService.getPersonalInfo();
    console.log(cart);
    console.log(personalInfo);
    if (!cart || cart.length == 0 || !personalInfo) {
      this.ordersService.clearCart();
      alert('Ocorreu um erro');
      return;
    }

    var textoDosPedidos = '';

    cart.forEach(item => {
      if (item.weightType == ETipoPesagem.Saco)
        textoDosPedidos += `- ${item.bagQuantity}x sacos - ${item.bag?.weight}KG ${item.product.label} ${item.bag?.price ? this.toCurrency(item.bag.price) : 'ERRO'}%0a`;
      else 
        textoDosPedidos += `- ${item.bulkQuantity}KG - ${item.product.label} ${item.product.bulkPrice ? this.toCurrency(item.product.bulkPrice) : 'ERRO'}%0a`;
    });

    this.ordersService.clearCart();
    const redirectUrl = `${base}/${phoneNumber}`+
      `?text=${personalInfo.name}%0a${personalInfo.phone}%0a${personalInfo.street}, ${personalInfo.numberInStreet} - ${personalInfo.neighborhood}%0aComplemento: ${personalInfo.complement}`+
      `%0a${textoDosPedidos}`;
    console.log(redirectUrl)

    window.location.href = redirectUrl;
  }
}
