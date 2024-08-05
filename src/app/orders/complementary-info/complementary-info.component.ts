import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { ETipoPagamento, ETipoPesagem, PersonalInfo } from '../shared/order.models';
import { OrdersService } from '../shared/orders.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-complementary-info',
  standalone: true,
  imports: [
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    NgxMaskDirective
  ],
  templateUrl: './complementary-info.component.html',
  styleUrl: './complementary-info.component.scss'
})
export class ComplementaryInfoComponent implements OnInit {
  isLoading = true;
  public form = new FormGroup({
    name: new FormControl<string>("", Validators.required),
    phone: new FormControl<string>("", [Validators.required, this.isValidPhone()]),
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


  getPaymentOptions(): Array<ETipoPagamento> {
    return [ ETipoPagamento.Dinheiro, ETipoPagamento.CartaoCredito, ETipoPagamento.CartaoDebito ]
  }

  advanceToNextStep() : void {
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

  chatOnWhatsapp() : void {
    const base = "https://wa.me";
    const phoneNumber = "41998074452";

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

  isValidPhone() : ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => {
      const matched = /([1-9]{2})(9{1})(\d{8})/.test(control.value);
      return !matched ? {phoneInvalid: {value: control.value}} : null;
    };
  }
}
