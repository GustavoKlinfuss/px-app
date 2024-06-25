import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OrdersService } from '../shared/orders.service';
import { Option, Bag, ETipoAnimal, ETipoPesagem, Catalog } from '../shared/order.models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.scss'
})
export class NewOrderComponent {
  private _catalog?: Array<Catalog>;
  
  public form = new FormGroup({
    petType: new FormControl(ETipoAnimal.Cachorro),
    product: new FormControl<string|null>(null),
    weightType: new FormControl<ETipoPesagem|null>(null),
    bag: new FormGroup({
      weight: new FormControl<number|null>(null),
      price: new FormControl<number|null>(null),
    }),
    bagQuantity: new FormControl<number | null>(null),
    bulkQuantity: new FormControl<number | null>(null)
  })

  constructor(ordersService: OrdersService){
    ordersService
      .getCatalogToOrder()
      .subscribe(response => {
        if (response instanceof HttpErrorResponse)
          return;
        this.form.controls.product.setValue(response[0]?.products[0]?.label)
        this._catalog = response;
        console.log({catalog: this._catalog})
      });
  }

  public weightOptions = [ ETipoPesagem.Saco, ETipoPesagem.Granel ];

  getCatalog(): Array<Catalog> | undefined {
    return this._catalog;
  }

  getPetTypes(): Array<ETipoAnimal> {
    return this._catalog!.map(x => x.petType);
  }

  getProducts() : Option[] {
    return this._catalog!.find(product => product.petType === this.form.controls.petType.value)!.products;
  }

  getBagOptions() : Array<Bag> | undefined {
    const byPetType = this._catalog!.find(catalog => catalog.petType === this.form.controls.petType.value);
    return byPetType!.products.find(x => x.label == this.form.controls.product.value)?.bags;
  }

  toCurrency(value: number) : string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatter.format(value);
  }

  onSubmit(){
    console.log({ord: this.form})
    alert(JSON.stringify(this.form.getRawValue(), null, '    '));
  }

  selectBagWeightType() {
    this.form.controls.weightType.setValue(ETipoPesagem.Saco);
    this.form.controls.bagQuantity.setValue(1);
  }

  selectBulkWeightType() {
    this.form.controls.bag.reset();
    this.form.controls.weightType.setValue(ETipoPesagem.Granel);
  }

  getSumFromBags(): string | null {
    if (!this.form.controls.bagQuantity.value || !this.form.controls.bag.value){
      console.log('sem valor garaio');
      return null;
    }
    console.log(this.form);

    var x = this.toCurrency(this.form.controls.bagQuantity.value * this.form.controls.bag.value!.price!);
    console.log('valor' + x + 'caraio');
    return x;
  }

  getBulkPriceFromSelectedProduct(): number|undefined {
    return this.getProducts().find(x => x.label == this.form.value.product)?.bulkPrice;
  }

  onBagSelect(event: Event) {
    const weight = Number((event.target as HTMLSelectElement).value);
    this.form.controls.bag.patchValue({
      weight: weight,
      price: this.getBagOptions()?.find(x => x.weight === weight)?.price
    })
  }
}
