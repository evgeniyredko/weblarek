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

  // базовая валидация полей
  public validate(): boolean {
    const emailOk = /\S+@\S+\.\S+/.test(this.email);
    const phoneOk = this.phone.replace(/\D/g, '').length >= 10; // простая проверка длины
    const addressOk = this.address.trim().length > 3;
    const paymentOk = ['card', 'cash', 'sbp'].includes(this.payment);
    return emailOk && phoneOk && addressOk && paymentOk;
  }
}
