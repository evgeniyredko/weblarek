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
  protected nextBtn: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.form = this.container instanceof HTMLFormElement && this.container.name === 'contacts'
    ? this.container
    : ensureElement<HTMLFormElement>('form[name="contacts"]', this.container);
    this.email = ensureElement<HTMLInputElement>('input[name="email"]', this.form);
    this.phone = ensureElement<HTMLInputElement>('input[name="phone"]', this.form);
    this.errors = ensureElement<HTMLElement>('.form__errors', this.form);
    this.nextBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);

    this.email.addEventListener('input', () => {
      this.events.emit('order:change', { field: 'email', value: this.email.value });
    });
    this.phone.addEventListener('input', () => {
      this.events.emit('order:change', { field: 'phone', value: this.phone.value });
    });

    this.nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.nextBtn.disabled) return;
      this.events.emit('order:submit-step2');
    });
  }

  set emailValue(v: string) { this.email.value = v; this.updateValidity(); }
  set phoneValue(v: string) { this.phone.value = v; this.updateValidity(); }

  set canSubmit(v: boolean) {
  this.nextBtn.disabled = !v;
}

set errorsEl(text: string) {
  this.errors.textContent = text ?? '';
}

  private updateValidity(): boolean {
    const emailOk = this.email.value.trim().length > 0;
    const phoneOk = this.phone.value.trim().length > 0;
    const valid = emailOk && phoneOk;
    this.nextBtn.disabled = !valid;
    this.errors.textContent = !emailOk ? 'Не указан email' : (!phoneOk ? 'Не указан телефон' : '');
    return valid;
  }
}
