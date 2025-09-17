import type { IBuyer, TPayment } from '../../types';

export default class Buyer {
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
  }

  // сохранить данные по одному полю
  public setPayment(v: TPayment) { this.payment = v; }
  public setEmail(v: string) { this.email = v; }
  public setPhone(v: string) { this.phone = v; }
  public setAddress(v: string) { this.address = v; }

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