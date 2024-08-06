import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CartItem, ETipoPesagem } from '../shared/order.models';
import { OrdersService } from '../shared/orders.service';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmActionDialogComponent } from '../../../components/confirm-action-dialog/confirm-action-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'order-cart',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './order-cart.component.html',
  styleUrl: './order-cart.component.scss'
})
export class OrderCartComponent {
  public _cart: Array<CartItem> | null = null;

  constructor(private ordersService: OrdersService, private router: Router, private dialog: MatDialog) {
    this._cart = ordersService.getCart();
    if (this._cart.length === 0)
      this.redirectToAddNewItem();
  }

  getCart(): Array<CartItem> {
    return this._cart ?? [];
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

  redirectToAddNewItem(): void {
    this.router.navigate(['pedidos/novo'])
  }

  advanceToNextStep(): void {
    this.router.navigate(['pedidos/informacoes-complementares'])
  }

  exclude(id: string): void {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        title: 'Confirmar exclusão',
        contentText: 'Você deseja excluir esse item do carrinho?'
      }
    });

    dialogRef
      .afterClosed()
      .subscribe(result => {
        console.log({result});
        if (result == true)
          this.ordersService.removeFromCart(id);
      })
  }
}
