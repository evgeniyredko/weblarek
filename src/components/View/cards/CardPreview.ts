import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import type { IEvents } from '../../base/Events';
import type { IProduct } from '../../../types';
import { CDN_URL, categoryMap } from '../../../utils/constants';

type CategoryKey = keyof typeof categoryMap;

export type TCardPreview = Pick<IProduct, 'id' | 'title' | 'description' | 'image' | 'category' | 'price'> & {
  inCart?: boolean;
};

export class CardPreview extends Component<TCardPreview> {
  protected imageEl: HTMLImageElement;
  protected categoryEl: HTMLElement;
  protected titleEl: HTMLElement;
  protected descEl: HTMLElement;
  protected priceEl: HTMLElement;
  protected actionBtn: HTMLButtonElement;

  private _inCart = false;
  private _id = '';

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.imageEl = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryEl = ensureElement<HTMLElement>('.card__category', this.container);
    this.titleEl = ensureElement<HTMLElement>('.card__title', this.container);
    this.descEl = ensureElement<HTMLElement>('.card__text', this.container);
    this.priceEl = ensureElement<HTMLElement>('.card__price', this.container);
    this.actionBtn = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.actionBtn.addEventListener('click', () => {
      if (this.actionBtn.disabled) return;
      if (this._inCart) this.events.emit('cart:remove', { id: this._id });
      else this.events.emit('cart:add', { id: this._id });

      this.events.emit('modal:close');
    });
  }

  set id(v: string) { this._id = v; }
  set title(v: string) { this.titleEl.textContent = v; }
  set description(v: string) { this.descEl.textContent = v; }
  set category(value: string) {
    this.categoryEl.textContent = value;
    this.categoryEl.className = `card__category ${categoryMap[value as CategoryKey] ?? ''}`;
  }
  set image(value: string) {
    this.setImage(this.imageEl, `${CDN_URL}/${value}`, this.titleEl.textContent || '');
  }
  set price(value: number | null) {
    this.priceEl.textContent = value === null ? '—' : `${value} синапсов`;
    this.actionBtn.disabled = value === null;
    this.actionBtn.textContent = value === null ? 'Недоступно' : (this._inCart ? 'Удалить из корзины' : 'В корзину');
  }
  set inCart(v: boolean | undefined) {
    this._inCart = !!v;
    if (!this.actionBtn.disabled) {
      this.actionBtn.textContent = this._inCart ? 'Удалить из корзины' : 'В корзину';
    }
  }

  render(data?: Partial<TCardPreview>): HTMLElement {
    return super.render(data);
  }
}
