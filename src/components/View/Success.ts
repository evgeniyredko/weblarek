import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

interface ISuccess { total: number }

export class Success extends Component<ISuccess> {
  protected titleEl: HTMLElement;
  protected descEl: HTMLElement;
  protected closeBtn: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.titleEl = ensureElement('.order-success__title', this.container);
    this.descEl = ensureElement('.order-success__description', this.container);
    this.closeBtn = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.closeBtn.addEventListener('click', () => this.events.emit('success:close'));
  }

  set total(value: number) {
    this.descEl.textContent = `Списано ${value} синапсов`;
  }
}
