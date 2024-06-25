import { Injectable } from '@angular/core';
import { Catalog, ETipoAnimal } from './order.models';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor() { }

  getCatalogToOrder(): Observable<Array<Catalog>|HttpErrorResponse> {
    return of([
        {
          petType: ETipoAnimal.Cachorro,
          products: [
            {
              label: 'Special Dog Carne',
              bags: [
                { weight: 2, price: 32.9 }
              ],
              bulkPrice: 22.9
            },
            {
              label: 'Special Dog Vegetais',
              bags: [
                { weight: 15, price: 140.9 },
                { weight: 20, price: 170.9 }
              ],
              bulkPrice: 12.9
            }
          ]
        },
        {
          petType: ETipoAnimal.Gato,
          products: [
            
          ]
        },
        {
          petType: ETipoAnimal.Passaro,
          products: [
            
          ]
        },
        {
          petType: ETipoAnimal.Peixe,
          products: [
            
          ]
        },
      ])
  }
}
