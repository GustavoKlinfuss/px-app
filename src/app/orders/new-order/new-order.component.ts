import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService } from '../shared/orders.service';
import { Product, Bag, ETipoAnimal, ETipoPesagem, Catalog, CartItem } from '../shared/order.models';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.scss'
})
export class NewOrderComponent {
  private _catalog?: Array<Catalog>;
  
  public form = new FormGroup({
    petType: new FormControl<ETipoAnimal>(ETipoAnimal.Cachorro),
    product: new FormControl<Product|null>(null, Validators.required),
    weightType: new FormControl<ETipoPesagem|null>(null),
    bag: new FormGroup({
      weight: new FormControl<number|null>(null),
      price: new FormControl<number|null>(null),
    }),
    bagQuantity: new FormControl<number | null>(null),
    bulkQuantity: new FormControl<number | null>(null)
  })

  constructor(private ordersService: OrdersService, private router: Router){
    ordersService
      .getCatalogToOrder()
      .subscribe(response => {
        if (response instanceof HttpErrorResponse)
          return;
        this.form.controls.product.setValue(response[0]?.products[0]);
        this._catalog = response;
        this.selectWeightType(0);
        console.log({catalog: this._catalog})
      });
  }

  public weightOptions = [ ETipoPesagem.Saco, ETipoPesagem.AGranel ];

  getCatalog(): Array<Catalog> | undefined { return this._catalog; }
  getPetTypeOptions(): Array<ETipoAnimal> { return this._catalog!.map(x => x.petType); }
  getProductOptions() : Product[] { return this._catalog!.find(product => product.petType === this.form.controls.petType.value)!.products };

  getBagOptions() : Array<Bag> | undefined {
    const catalogByPetType = this._catalog!.find(catalog => catalog.petType === this.form.controls.petType.value);
    return catalogByPetType!.products.find(product => product == this.form.controls.product.value)?.bags;
  }

  toCurrency(value: number) : string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatter.format(value);
  }

  getSumFromBags(): string | null {
    if (!this.form.controls.bagQuantity.value || !this.form.controls.bag.value)
      return null;
    return this.toCurrency(this.form.controls.bagQuantity.value * this.form.controls.bag.value!.price!);
  }

  getBulkPriceFromSelectedProduct(): number|undefined {
    return this.getProductOptions().find(x => x == this.form.value.product)?.bulkPrice;
  }

  onBagSelect(event: Event) {
    const weight = Number((event.target as HTMLSelectElement).value);
    this.form.controls.bag.patchValue({
      weight: weight,
      price: this.getBagOptions()?.find(x => x.weight === weight)?.price
    })
  }

  selectWeightType($event: number) {
    const tipoPesagem = this.weightOptions[$event];
    this.form.controls.weightType.setValue(tipoPesagem);
    if (tipoPesagem == ETipoPesagem.AGranel){
      this.form.controls.bag.reset();
      this.form.controls.bagQuantity.reset();
      this.form.controls.bulkQuantity.setValue(1);
    }
    else{
      this.form.controls.bulkQuantity.reset();
      this.form.controls.bagQuantity.setValue(1);
    }
  }

  onSubmit(){
    if (!this.form.valid) {
      alert('inválido');
      return;
    }
    const raw = this.form.getRawValue();
    const cartItem: CartItem = {
      petType: raw.petType!,
      product: raw.product!,
      weightType: raw.weightType!,
      bagQuantity: raw.bagQuantity,
      bagWeight: raw.bag.weight,
      bulkQuantity: raw.bulkQuantity
    }
    this.ordersService.addItemToCart(cartItem);
    this.router.navigate(['/pedidos']);
  }

  converteEmString(arg0: any) {
    return JSON.stringify(arg0, null, "\n");
  }
}
