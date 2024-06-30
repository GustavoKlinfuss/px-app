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
            },
            {
              label: 'Premier Raças grandes',
              bags: [
                { weight: 15, price: 140.9 },
                { weight: 20, price: 170.9 }
              ],
              bulkPrice: 15.9
            },
            {
              label: 'Purina Dog Show',
              bags: [
                { weight: 2, price: 40.9 },
                { weight: 10, price: 170.9 }
              ],
              bulkPrice: 20.9
            }
          ]
        },
        {
          petType: ETipoAnimal.Gato,
          products: [
            {
              label: 'Premier Raças grandes',
              bags: [
                { weight: 15, price: 140.9 },
                { weight: 20, price: 170.9 }
              ],
              bulkPrice: 15.9
            },
            {
              label: 'Purina Dog Show',
              bags: [
                { weight: 2, price: 40.9 },
                { weight: 10, price: 170.9 }
              ],
              bulkPrice: 20.9
            }
          ]
        },
        {
          petType: ETipoAnimal.Passaro,
          products: [
            {
              label: 'Premier Raças grandes',
              bags: [
                { weight: 15, price: 140.9 },
                { weight: 20, price: 170.9 }
              ],
              bulkPrice: 15.9
            },
            {
              label: 'Purina Dog Show',
              bags: [
                { weight: 2, price: 40.9 },
                { weight: 10, price: 170.9 }
              ],
              bulkPrice: 20.9
            }
          ]
        },
        {
          petType: ETipoAnimal.Peixe,
          products: [
            {
              label: 'Premier Raças grandes',
              bags: [
                { weight: 15, price: 140.9 },
                { weight: 20, price: 170.9 }
              ],
              bulkPrice: 15.9
            },
            {
              label: 'Purina Dog Show',
              bags: [
                { weight: 2, price: 40.9 },
                { weight: 10, price: 170.9 }
              ],
              bulkPrice: 20.9
            }
          ]
        },
      ])
  }
}
