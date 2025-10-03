import type { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export default class Cart extends EventEmitter {
  // хранит товары, выбранные покупателем для покупки
  private items: IProduct[] = [];

  // получить массив товаров в корзине
  public getItems(): IProduct[] {
    return [...this.items];
  }

  // добавить товар в корзину
  public addItem(product: IProduct): void {
    if (!product) return;
    // простая модель без количеств: один товар = одна позиция
    this.items.push(product);
    this.emit('cart:changed', this.snapshot());
  }

  // удалить товар (по объекту)
  public removeItem(product: IProduct): void {
    this.items = this.items.filter((p) => p.id !== product.id);
    this.emit('cart:changed', this.snapshot());
  }

  // очистить корзину
  public clear(): void {
    this.items = [];
    this.emit('cart:changed', this.snapshot());
  }

  // получить стоимость всех товаров в корзине
  public getTotalAmount(): number {
    // цены могут быть null — игнорируем такие позиции
    return this.items.reduce((sum, p) => sum + (typeof p.price === 'number' ? p.price : 0), 0);
  }

  // получить количество товаров
  public getCount(): number {
    return this.items.length;
  }

  // проверка наличия товара по id
  public hasItem(id: string): boolean {
    return this.items.some((p) => p.id === id);
  }

  private snapshot() {
    return { items: this.getItems(), total: this.getTotalAmount(), count: this.getCount() };
  }
}
