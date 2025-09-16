import './scss/styles.scss';

// Модели
import Products from './components/Models/Products';
import Cart from './components/Models/Cart';
import Buyer from './components/Models/Buyer';

// Типы
import type { IProduct, IBuyer } from './types';
import { apiProducts } from './utils/data'; // предполагается объект с { items: IProduct[] }
import { API_URL } from './utils/constants'; // ${VITE_API_ORIGIN}/api/weblarek
import { Api } from './components/base/Api'; // базовый API
import WeblarekApi from './components/Services/WeblarekApi';

const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

const http = new Api(API_URL); // baseUrl = `${VITE_API_ORIGIN}/api/weblarek`
const api = new WeblarekApi(http);

// Products
productsModel.setItems((apiProducts.items ?? []) as IProduct[]);
console.log('Каталог. Все товары:', productsModel.getItems());

const first = productsModel.getItems()[0];
if (first) {
  console.log('Каталог. Товар по id:', productsModel.getProductById(first.id));
  productsModel.setCurrentProduct(first);
  console.log('Каталог. Выбранный товар:', productsModel.getCurrentProduct());
}

// Cart
if (first) {
  cartModel.addItem(first);
  console.log('Корзина. После addItem:', cartModel.getItems());
  console.log('Корзина. Есть ли товар?', cartModel.hasItem(first.id));
  console.log('Корзина. Количество:', cartModel.getCount());
  console.log('Корзина. Сумма:', cartModel.getTotalAmount());
  cartModel.removeItem(first);
  console.log('Корзина. После removeItem:', cartModel.getItems());
  cartModel.clear();
  console.log('Корзина. После clear:', cartModel.getItems());
}

// Buyer
const buyerData: IBuyer = {
  payment: 'card',
  email: 'user@example.com',
  phone: '+7 (999) 123-45-67',
  address: 'г. Алматы, ул. Сейфуллина, 10',
};
buyerModel.setData(buyerData);
console.log('Покупатель. Данные:', buyerModel.getData());
console.log('Покупатель. Валидация:', buyerModel.validate());
buyerModel.clear();
console.log('Покупатель. После clear:', buyerModel.getData());

// получаем товары и кладём их в модель каталога
api.fetchProducts()
  .then((items) => {
    productsModel.setItems(items);
    console.log('Каталог с сервера:', productsModel.getItems());
  })
  .catch((e) => {
    console.error('Ошибка загрузки каталога:', e);
  });
