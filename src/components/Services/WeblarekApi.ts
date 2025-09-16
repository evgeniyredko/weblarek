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
    return this.api.post<IOrderResponse>('/order/', payload, 'POST');
  }
}

export default WeblarekApi;
