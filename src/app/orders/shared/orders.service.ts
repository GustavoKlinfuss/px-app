import { Injectable } from '@angular/core';
import { CartItem, Catalog, ETipoAnimal, PersonalInfo } from './order.models';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private _cart: Array<CartItem> = new Array<CartItem>();
  private _personalInfo: PersonalInfo | undefined;

  constructor() {
    if (this._cart.length == 0) {
      const cartInStorage = localStorage.getItem('cart');
      if (cartInStorage != null)
        this._cart = JSON.parse(cartInStorage);
    }

    if (this._personalInfo === undefined) {
      const personalInfoInStorage: string | null = localStorage.getItem('personalInfo');
      if (personalInfoInStorage != null) {
        try {
          this._personalInfo = JSON.parse(personalInfoInStorage);
        } catch(ex) { }
      }
    }
   }

  getCatalogToOrder(): Observable<Array<Catalog>|HttpErrorResponse> {
    return of([
        {
          petType: ETipoAnimal.Cachorro,
          products: [
            {
              id: 1,
              label: 'Special Dog Carne',
              bags: [
                { weight: 2, price: 32.9 }
              ],
              bulkPrice: 22.9
            },
            {
              id: 2,
              label: 'Special Dog Vegetais',
              bags: [
                { weight: 15, price: 140.9 },
                { weight: 20, price: 170.9 }
              ],
              bulkPrice: 12.9
            },
            {
              id: 3,
              label: 'Premier Raças grandes',
              bags: [
                { weight: 15, price: 140.9 },
                { weight: 20, price: 170.9 }
              ],
              bulkPrice: 15.9
            },
            {
              id: 4,
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
              id: 5,
              label: 'Premier Raças grandes',
              bags: [
                { weight: 15, price: 140.9 },
                { weight: 20, price: 170.9 }
              ],
              bulkPrice: 15.9
            },
            {
              id: 6,
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
              id: 7,
              label: 'Premier Raças grandes',
              bags: [
                { weight: 15, price: 140.9 },
                { weight: 20, price: 170.9 }
              ],
              bulkPrice: 15.9
            },
            {
              id: 8,
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
              id: 9,
              label: 'Premier Raças grandes',
              bags: [
                { weight: 15, price: 140.9 },
                { weight: 20, price: 170.9 }
              ],
              bulkPrice: 15.9
            },
            {
              id: 10,
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

  addItemToCart(item: CartItem) : void {
    localStorage.removeItem('cart');
    this._cart.push(item);
    localStorage.setItem('cart', JSON.stringify(this._cart));
  }

  getCart(): Array<CartItem> {
    return this._cart;
  }

  setPersonalInfo(personalInfo: PersonalInfo): void {
    this._personalInfo = personalInfo;
    localStorage.setItem('personalInfo', JSON.stringify(this._personalInfo));
  }

  getPersonalInfo(): PersonalInfo | undefined {
    return this._personalInfo;
  }

  clearCart() {
    localStorage.removeItem('cart');
    this._cart = new Array<CartItem>;
  }

  removeFromCart(id: string) : void {
    const cartItem = this._cart.find(x => x.id == id);
    if (cartItem == null) return;
    this._cart.splice(this._cart.indexOf(cartItem), 1);
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(this._cart));
  }
}
