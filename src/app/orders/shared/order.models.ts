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
  AGranel = "A Granel"
}

export interface Catalog {
  petType: ETipoAnimal,
  products: Array<Product>
}

export interface Product {
  id: number,
  label: string,
  bags: Array<Bag>,
  bulkPrice: number | undefined
}

export interface Bag {
  weight: number,
  price: number
}

export interface CartItem {
  petType: ETipoAnimal,
  product: Product,
  weightType: ETipoPesagem,
  bag: Bag | null,
  bagQuantity: number | null,
  bulkQuantity: number | null
}

export enum ETipoPagamento {
  Dinheiro = "Dinheiro",
  CartaoCredito = "Cartão de Crédito",
  CartaoDebito = "Cartão de Débito"
}
