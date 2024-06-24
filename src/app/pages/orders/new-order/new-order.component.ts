import { Component } from '@angular/core';

enum ECategoria
{
  Indefinido = "Indefinido",
  Cachorro = "Cachorro",
  Gato = "Gato",
  Peixe = "Peixe",
  Passaro = "Pássaro"
}

enum ETipoPesagem
{
  Indefinido = "Indefinido",
  Saco = "Saco",
  Granel = "Granel"
}

export interface Option {
  category: ECategoria,
  value: string,
  label: string,
  bags: Bag[]
}

export interface Bag {
  weight: number,
  price: number
}

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.scss'
})
export class NewOrderComponent {
  formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  public categoryOptions = [ ECategoria.Cachorro, ECategoria.Gato, ECategoria.Passaro, ECategoria.Peixe ];
  public weightOptions = [ ETipoPesagem.Saco, ETipoPesagem.Granel ]

  private _generalOptions : Array<Option> = [
    { 
      category: ECategoria.Cachorro, 
      value: 'special-dog-carne',
      label: 'Special Dog - Carne',
      bags: [
        { weight: 2, price: 12.4 },
        { weight: 10, price: 50.4 }
      ] 
    },
    { 
      category: ECategoria.Cachorro,
      value: 'special-dog-vegetais',
      label: 'Special Dog - Vegetais', bags: [] },
    { 
      category: ECategoria.Cachorro,
      value: 'special-dog-filhotes',
      label: 'Special Dog - Filhotes', bags: [] },
    { 
      category: ECategoria.Cachorro,
      value: 'golden-castrados',
      label: 'Golden - Castrados', bags: [] },
    { 
      category: ECategoria.Cachorro,
      value: 'golden-adultos',
      label: 'Golden - Adultos', bags: [] },
    { 
      category: ECategoria.Cachorro,
      value: 'golden-filhotes',
      label: 'Golden - Filhotes', bags: [] },
    { 
      category: ECategoria.Gato,
      value: 'golden-gatos',
      label: 'Golden - Gatos', bags: [] },
    { 
      category: ECategoria.Passaro,
      value: 'golden-passaros',
      label: 'Golden - Pássaros', bags: [] },
    { 
      category: ECategoria.Peixe,
      value: 'golden-passaros',
      label: 'Golden - Peixes', bags: [] }
  ];

  selectedCategory: ECategoria = this.categoryOptions[0];
  selectedBrand: string | null = this.getBrandsByCategory()[0].value;
  selectedWeightMethod: ETipoPesagem = this.weightOptions[0];
  selectedBag: Bag = this.getBagOptions()[0];
  selectedBulkInKilograms: number = 1; 

  getBrandsByCategory() : Option[] {
    return this._generalOptions.filter(brand => brand.category === this.selectedCategory);
  }

  getBagOptions() : Array<Bag> {
    return this._generalOptions.find(options =>
                                     options.category === this.selectedCategory
                                  && options.value == this.selectedBrand)!.bags;
  }

  onCategoryChange(event: Event){
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory = ECategoria[selectElement.value as keyof typeof ECategoria];
  }

  onBrandChange(event: Event){
    const selectElement = event.target as HTMLSelectElement;
    this.selectedBrand = selectElement.value;
  }

  onBagWeightChange(event: Event){
    const selectElement = event.target as HTMLSelectElement;
    this.selectedBag = this.getBagOptions().find(x => x.weight == Number(selectElement.value))!;
  }

  selectWeightMethod(value: string) {
    this.selectedWeightMethod = ETipoPesagem[value as keyof typeof ETipoPesagem];
  }

  toCurrency(value: number) : string {
    return this.formatter.format(value);
  }

  sendOrder() {
    var order = {
      category: this.selectedCategory,
      brand: this._generalOptions.find(x => x.value == this.selectedBrand)?.label,
      weightMethod: this.selectedWeightMethod,
      bag: this.selectedBag,
      bulkInKilograms: this.selectedBulkInKilograms
    }

    alert(JSON.stringify(order, null, ' '));
  }
}
