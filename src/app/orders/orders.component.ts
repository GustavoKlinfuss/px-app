import { Component } from '@angular/core';
import { OrdersService } from './shared/orders.service';
import { CartItem, ETipoPesagem } from './shared/order.models';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  public _cart: Array<CartItem> | null = null;

  constructor(private ordersService: OrdersService, private router: Router){
    this._cart = ordersService.getCart();
  }

  getCart(): Array<CartItem> {
    return this._cart ?? new Array<CartItem>;
  }

  toCurrency(value: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatter.format(value);
  }

  getCartSum(): number {
    if (!this._cart)
      return 0;
    return this._cart
      .reduce((partial, cartItem) => {
        const priceToConsider: number = cartItem.weightType == ETipoPesagem.Saco
          ? cartItem.bag && cartItem.bagQuantity ? cartItem.bag.price * cartItem.bagQuantity : 0
          : cartItem.product.bulkPrice && cartItem.bulkQuantity ? cartItem.product.bulkPrice * cartItem.bulkQuantity : 0;
        return partial + priceToConsider;
      },0);
  }

  getDeliveryTax(): number {
    return this.getCartSum() >= 50 ? 0 : 5;
  }

  onClear(): void {
    this.ordersService.clearCart();
    this._cart = new Array<CartItem>();
  }

  addNewItem(): void {
    this.router.navigate(['pedidos/novo'])
  }
}
