import { Routes } from '@angular/router';
import { NewOrderComponent } from './pages/orders/new-order/new-order.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pedidos/novo',
  },
  {
    path: 'pedidos/novo',
    component: NewOrderComponent
  }
];
