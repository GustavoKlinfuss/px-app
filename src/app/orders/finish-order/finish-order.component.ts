import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { OrdersService } from '../shared/orders.service';
import { ETipoPesagem } from '../shared/order.models';

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
  
  constructor(private ordersService: OrdersService) {
    
  }

  toCurrency(value: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatter.format(value);
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
