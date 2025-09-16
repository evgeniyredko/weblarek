export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' | 'sbp';

// Товар
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Покупатель
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Ответ сервера со списком товаров
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

// Формат отправки заказа (используем уже описанные IBuyer и id товаров)
export interface IOrderRequest {
  items: string[]; // массив product.id
  buyer: IBuyer; // данные покупателя
}

// Ответ сервера при создании заказа
export interface IOrderResponse {
  id: string; // идентификатор заказа
  total?: number; // опционально, если сервер возвращает сумму
}