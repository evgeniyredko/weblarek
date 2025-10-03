import { ensureElement, cloneTemplate } from '../../utils/utils';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IProduct } from '../../types';

export interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class BasketItem extends Component<Pick<IProduct, 'id' | 'title' | 'price'>> {
  protected indexEl: HTMLElement;
  protected titleEl: HTMLElement;
  protected priceEl: HTMLElement;
  protected deleteBtn: HTMLButtonElement;
  private _id = '';

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.indexEl = ensureElement('.basket__item-index', this.container);
    this.titleEl = ensureElement('.card__title', this.container);
    this.priceEl = ensureElement('.card__price', this.container);
    this.deleteBtn = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    this.deleteBtn.addEventListener('click', () => this.events.emit('cart:remove', { id: this._id }));
  }

  set id(v: string) { this._id = v; }
  set index(v: number) { this.indexEl.textContent = String(v); }
  set title(v: string) { this.titleEl.textContent = v; }
  set price(v: number | null) { this.priceEl.textContent = v === null ? 'Бесценно' : `${v} синапсов`; }
}

export class Basket extends Component<IBasketData> {
  protected list: HTMLElement;
  protected totalEl: HTMLElement;
  protected submitBtn: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.list = ensureElement('.basket__list', this.container);
    this.totalEl = ensureElement('.basket__price', this.container);
    this.submitBtn = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.submitBtn.addEventListener('click', () => {
      if (!this.submitBtn.disabled) this.events.emit('order:open');
    });
  }

  set items(els: HTMLElement[]) {
    if (!els.length) {
      this.list.replaceChildren(document.createTextNode('Корзина пуста'));
      this.submitBtn.disabled = true;
    } else {
      this.list.replaceChildren(...els);
      this.submitBtn.disabled = false;
    }
  }

  set total(v: number) { this.totalEl.textContent = `${v} синапсов`; }

  static createItem(events: IEvents, tpl: HTMLTemplateElement, product: IProduct, index: number) {
    const item = new BasketItem(events, cloneTemplate<HTMLLIElement>(tpl));
    item.index = index;
    return item.render({ id: product.id, title: product.title, price: product.price });
  }
}
