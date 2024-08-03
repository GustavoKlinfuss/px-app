import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { OrdersService } from '../shared/orders.service';
import { Product, Bag, ETipoAnimal, ETipoPesagem, Catalog, CartItem } from '../shared/order.models';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.scss'
})
export class NewOrderComponent {
  private _catalog?: Array<Catalog>;
  public hasCart: Boolean = false;
  
  public form = new FormGroup({
    petType: new FormControl<ETipoAnimal>(ETipoAnimal.Cachorro, Validators.required),
    product: new FormControl<Product|null>(null, Validators.required),
    weightType: new FormControl<ETipoPesagem|null>(null, Validators.required),
    bag: new FormControl<Bag|null>(null, this.conditionalRequiredBagSelectValidator()),
    bagQuantity: new FormControl<number | null>(null, this.conditionalRequiredBagQuantityValidator()),
    bulkQuantity: new FormControl<number | null>(null, this.conditionalRequiredBulkQuantityValidator())
  })

  conditionalRequiredBagSelectValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isInvalid = this.form && this.form.controls.weightType.value == ETipoPesagem.Saco && this.form.controls.bag.value == null;
      return isInvalid ? {conditionalBagNotInformed: {value: control.value}} : null;
    };
  }

  conditionalRequiredBagQuantityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const shouldbeValidated = this.form && this.form.controls.weightType.value == ETipoPesagem.Saco;
      if (!shouldbeValidated) return null;

      const isNumeric = (x: string) => /^[+-]?\d+(\.\d+)?$/.test(x);

      return !isNumeric(control.value) || control.value <= 0 ?  {conditionalBagQuantityNotInformed: {value: control.value}} : null;
    };
  }

  conditionalRequiredBulkQuantityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isInvalid = this.form && this.form.controls.weightType.value == ETipoPesagem.AGranel && this.form.controls.bulkQuantity.value == null;
      return isInvalid ? {conditionalBulkQuantityNotInformed: {value: control.value}} : null;
    };
  }

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

    this.hasCart = ordersService.getCart().length > 0;
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

  selectWeightType($event: number) {
    const tipoPesagem = this.weightOptions[$event];
    this.form.controls.weightType.setValue(tipoPesagem);
    if (tipoPesagem == ETipoPesagem.AGranel){
      if (!this.form.controls.bulkQuantity.value)
        this.form.controls.bulkQuantity.setValue(1);
    }
    else{
      if (!this.form.controls.bagQuantity.value)
        this.form.controls.bagQuantity.setValue(1);
    }
    this.form.controls.bag.updateValueAndValidity();
    this.form.controls.bagQuantity.updateValueAndValidity();
    this.form.controls.bulkQuantity.updateValueAndValidity();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    const raw = this.form.getRawValue();
    const date = new Date();
    const cartItem: CartItem = {
      id: `${date.getFullYear()}${date.getMonth()}${date.getDay()}-${raw.product!.id}`,
      petType: raw.petType!,
      product: raw.product!,
      weightType: raw.weightType!,
      bagQuantity: raw.bagQuantity,
      bag: raw.bag,
      bulkQuantity: raw.bulkQuantity
    }
    this.ordersService.addItemToCart(cartItem);
    this.router.navigate(['/pedidos']);
  }

  redirectToCart() {
    this.router.navigate(['/pedidos']);
  }
}
