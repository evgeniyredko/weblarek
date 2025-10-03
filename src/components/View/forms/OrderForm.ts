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
    this.form = ensureElement<HTMLFormElement>('form[name="order"]', this.container);
    this.address = ensureElement<HTMLInputElement>('input[name="address"]', this.form);
    this.errors = ensureElement<HTMLElement>('.form__errors', this.form);
    this.nextBtn = ensureElement<HTMLButtonElement>('.order__button', this.form);
    this.btnCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.form);
    this.btnCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.form);

    this.btnCard.addEventListener('click', () => this.payment = 'card');
    this.btnCash.addEventListener('click', () => this.payment = 'cash');
    this.address.addEventListener('input', () => this.updateValidity());
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.updateValidity()) {
        this.events.emit('order:submit-step1', { payment: this._payment as TPayment, address: this.address.value.trim() });
      }
    });
  }

  set payment(v: TPayment) {
    this._payment = v;
    this.btnCard.classList.toggle('button_alt-active', v === 'card');
    this.btnCash.classList.toggle('button_alt-active', v === 'cash');
    this.updateValidity();
  }

  set addressValue(v: string) {
    this.address.value = v;
    this.updateValidity();
  }

  private updateValidity(): boolean {
    const addrOk = this.address.value.trim().length > 0;
    const payOk = !!this._payment;
    const valid = addrOk && payOk;
    this.nextBtn.disabled = !valid;
    this.errors.textContent = !addrOk ? 'Не указан адрес' : (!payOk ? 'Не выбран способ оплаты' : '');
    return valid;
  }
}
