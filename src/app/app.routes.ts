import { Routes } from '@angular/router';
import { NewOrderComponent } from './orders/new-order/new-order.component';
import { OrderCartComponent } from './orders/cart/order-cart.component';
import { ComplementaryInfoComponent } from './orders/complementary-info/complementary-info.component';
import { FinishOrderComponent } from './orders/finish-order/finish-order.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pedidos/novo',
  },
  {
    path: 'pedidos/novo',
    component: NewOrderComponent
  },
  {
    path: 'pedidos',
    component: OrderCartComponent
  },
  {
    path: 'pedidos/informacoes-complementares',
    component: ComplementaryInfoComponent
  },
  {
    path: 'pedidos/finalizar',
    component: FinishOrderComponent
  }
];
