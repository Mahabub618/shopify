export class CreateOrderDto {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  country: string;
  city: string;
  zip: string;
  code: string;
  products: {
    productId: number;
    quantity: number;
  }[]
}
