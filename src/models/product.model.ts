export class ProductModel {
  title: string;
  saleTaxRate: number;
  salePriceGross: number;
  description: string;
  stockAmount?: number = 0;
  categoryId: string;
  producerId: string;
}
