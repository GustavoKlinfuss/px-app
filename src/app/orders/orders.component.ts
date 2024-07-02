import { Component } from '@angular/core';
import { OrdersService } from './shared/orders.service';
import { CartItem } from './shared/order.models';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    MatCardModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  public _cart: Array<CartItem> | null = null;

  constructor(private ordersService: OrdersService){
    this._cart = ordersService.getCart();
  }

  getCart(): Array<CartItem> | null{
    return this._cart;
  }
}
