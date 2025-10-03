import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import type { IEvents } from '../../base/Events';

interface IContactsForm {
  email: string;
  phone: string;
}

export class ContactsForm extends Component<IContactsForm> {
  protected form: HTMLFormElement;
  protected email: HTMLInputElement;
  protected phone: HTMLInputElement;
  protected errors: HTMLElement;
  protected payBtn: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.form = ensureElement<HTMLFormElement>('form[name="contacts"]', this.container);
    this.email = ensureElement<HTMLInputElement>('input[name="email"]', this.form);
    this.phone = ensureElement<HTMLInputElement>('input[name="phone"]', this.form);
    this.errors = ensureElement<HTMLElement>('.form__errors', this.form);
    this.payBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);

    const validate = () => this.updateValidity();
    this.email.addEventListener('input', validate);
    this.phone.addEventListener('input', validate);

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.updateValidity()) {
        this.events.emit('order:submit-step2', { email: this.email.value.trim(), phone: this.phone.value.trim() });
      }
    });
  }

  set emailValue(v: string) { this.email.value = v; this.updateValidity(); }
  set phoneValue(v: string) { this.phone.value = v; this.updateValidity(); }

  private updateValidity(): boolean {
    const emailOk = this.email.value.trim().length > 0;
    const phoneOk = this.phone.value.trim().length > 0;
    const valid = emailOk && phoneOk;
    this.payBtn.disabled = !valid;
    this.errors.textContent = !emailOk ? 'Не указан email' : (!phoneOk ? 'Не указан телефон' : '');
    return valid;
  }
}
