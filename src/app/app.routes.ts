import { Routes } from '@angular/router';
import { OrderCartComponent } from './orders/cart/order-cart.component';
import { ComplementaryInfoComponent } from './orders/complementary-info/complementary-info.component';
import { AddItemComponent } from './orders/add-item/add-item.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pedidos',
  },
  {
    path: 'pedidos/novo',
    component: AddItemComponent
  },
  {
    path: 'pedidos',
    component: OrderCartComponent
  },
  {
    path: 'pedidos/informacoes-complementares',
    component: ComplementaryInfoComponent
  }
];
