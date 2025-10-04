import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import type { IEvents } from '../../base/Events';
import type { TPayment } from '../../../types';

interface IOrderForm {
  payment: TPayment;
  address: string;
}

export class OrderForm extends Component<IOrderForm> {
  protected form: HTMLFormElement;
  protected address: HTMLInputElement;
  protected errors: HTMLElement;
  protected nextBtn: HTMLButtonElement;
  protected btnCard: HTMLButtonElement;
  protected btnCash: HTMLButtonElement;
  private _payment: TPayment | null = null;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.form = this.container instanceof HTMLFormElement && this.container.name === 'order'
    ? this.container
    : ensureElement<HTMLFormElement>('form[name="order"]', this.container);
    this.address = ensureElement<HTMLInputElement>('input[name="address"]', this.form);
    this.errors = ensureElement<HTMLElement>('.form__errors', this.form);
    this.nextBtn = ensureElement<HTMLButtonElement>('.order__button', this.form);
    this.btnCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.form);
    this.btnCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.form);

    this.address.addEventListener('input', () => {
      this.events.emit('order:change', { field: 'address', value: this.address.value });
    });
    this.btnCard.addEventListener('click', () => {
      this.events.emit('order:change', { field: 'payment', value: 'card' });
    });
    this.btnCash.addEventListener('click', () => {
      this.events.emit('order:change', { field: 'payment', value: 'cash' });
    });

    this.nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.nextBtn.disabled) return;
      this.events.emit('order:submit-step1');
    });
  }

  set payment(v: TPayment) {
    this._payment = v;
    this.btnCard.classList.toggle('button_alt-active', v === 'card');
    this.btnCash.classList.toggle('button_alt-active', v === 'cash');
  }

  set addressValue(v: string) {
    this.address.value = v;
  }

  set canSubmit(v: boolean) {
    this.nextBtn.disabled = !v;
  }

  set errorsEl(text: string) {
    this.errors.textContent = text ?? '';
  }
}
