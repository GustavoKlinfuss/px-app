export enum ETipoAnimal
{
  Indefinido = "Indefinido",
  Cachorro = "Cachorro",
  Gato = "Gato",
  Peixe = "Peixe",
  Passaro = "Pássaro"
}

export enum ETipoPesagem
{
  Indefinido = "Indefinido",
  Saco = "Saco",
  Granel = "Granel"
}

export interface Catalog {
  petType: ETipoAnimal,
  products: Array<Option>
}

export interface Option {
  label: string,
  bags: Array<Bag>,
  bulkPrice: number | undefined
}

export interface Bag {
  weight: number,
  price: number
}
