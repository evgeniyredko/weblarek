import { ensureElement } from '../../../utils/utils';
import { categoryMap, CDN_URL } from '../../../utils/constants';
import type { IProduct } from '../../../types';
import { Component } from '../../base/Component';

type CategoryKey = keyof typeof categoryMap;
export type TCardCatalog = Pick<IProduct, 'title' | 'image' | 'category' | 'price'>;

export class CardCatalog extends Component<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement   = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.titleElement   = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement   = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) { this.titleElement.textContent = value; }

  set category(value: string) {
    this.categoryElement.textContent = value;
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
    }
  }

  set image(value: string) {
    const alt = this.titleElement.textContent || '';
    this.setImage(this.imageElement, `${CDN_URL}/${value}`, alt);
  }

  set price(value: number | null) {
    this.priceElement.textContent = value === null ? '—' : `${value} синапсов`;
  }
}
