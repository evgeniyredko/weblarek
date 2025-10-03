import type { IApi, IProductsResponse, IProduct, IOrderRequest, IOrderResponse } from '../../types';

export class WeblarekApi {
  constructor(private api: IApi) {}

  // GET /product/ — вернуть массив товаров
  async fetchProducts(): Promise<IProduct[]> {
    const data = await this.api.get<IProductsResponse>('/product/');
    return data.items;
  }

  // POST /order/ — отправить заказ
  async submitOrder(payload: IOrderRequest): Promise<IOrderResponse> {
    const { items, buyer } = payload as any;
    const total = (payload as any).total;  // может быть undefined

    const body: Record<string, unknown> = {
      items,
      payment: buyer.payment,
      address: buyer.address,
      email: buyer.email,
      phone: buyer.phone,
    };

    if (typeof total === 'number') {
      body.total = total;
    }

    return this.api.post<IOrderResponse>('/order/', body, 'POST');
  }

}

export default WeblarekApi;
