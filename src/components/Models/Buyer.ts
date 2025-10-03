import type { IBuyer, TPayment } from '../../types';
import { EventEmitter } from '../base/Events';

export default class Buyer extends EventEmitter {
  private payment: TPayment = 'card';
  private email = '';
  private phone = '';
  private address = '';

  // сохранить все данные разом
  public setData(data: IBuyer): void {
    this.payment = data.payment;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.emit('buyer:changed', this.getData());
  }

  // сохранить данные по одному полю
  public setPayment(v: TPayment) { this.payment = v; this.emit('buyer:changed', this.getData()); }
  public setEmail(v: string) { this.email = v; this.emit('buyer:changed', this.getData()); }
  public setPhone(v: string) { this.phone = v; this.emit('buyer:changed', this.getData()); }
  public setAddress(v: string) { this.address = v; this.emit('buyer:changed', this.getData()); }

  // получить все данные покупателя
  public getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  // очистить данные покупателя
  public clear(): void {
    this.payment = 'card';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.emit('buyer:changed', this.getData());
  }

  // валидация, возвращающая сообщения по каждому невалидному полю
  public validate(): {
    errors: Partial<Record<'email' | 'phone' | 'address' | 'payment', string>>;
    isValid: boolean;
  } {
    const errors: Partial<Record<'email' | 'phone' | 'address' | 'payment', string>> = {};

    if (!this.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }
    if (!this.address.trim()) {
      errors.address = 'Не указан адрес';
    }
    if (!this.phone.trim()) {
      errors.phone = 'Не указан телефон';
    }
    if (!this.email.trim()) {
      errors.email = 'Не указан email';
    }

    return { errors, isValid: Object.keys(errors).length === 0 };
  }
}