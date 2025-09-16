import type { IProduct } from '../../types';

export default class Products {
  // хранит массив всех товаров
  private products: IProduct[] = [];
  // хранит товар, выбранный для подробного отображения
  private currentProduct: IProduct | null = null;

  // сохранить массив товаров
  public setItems(items: IProduct[]): void {
    this.products = Array.isArray(items) ? [...items] : [];
  }

  // получить массив всех товаров
  public getItems(): IProduct[] {
    return [...this.products];
  }

  // получить один товар по id
  public getProductById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  // сохранить товар для подробного отображения
  public setCurrentProduct(product: IProduct): void {
    this.currentProduct = product ?? null;
  }

  // получить товар для подробного отображения
  public getCurrentProduct(): IProduct | null {
    return this.currentProduct;
  }
}
